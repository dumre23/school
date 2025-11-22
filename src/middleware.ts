import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware((auth, req) => {
  const { sessionClaims, userId } = auth();

  // Read from custom metadata claim (configured in Clerk dashboard)
  console.log("DEBUG - sessionClaims.metadata:", JSON.stringify((sessionClaims as any)?.metadata));
  const role = ((sessionClaims as any)?.metadata as { role?: string })?.role || "admin";
  
  console.log("Middleware - Path:", req.nextUrl.pathname, "Role:", role, "UserId:", userId);

  // Redirect authenticated users from sign-in page to their dashboard
  if (userId && req.nextUrl.pathname === "/sign-in") {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }

  // Redirect unauthenticated users to sign-in for protected routes
  const isProtectedRoute = matchers.some(({ matcher }) => matcher(req));
  if (!userId && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Check route access for authenticated users
  if (userId) {
    for (const { matcher, allowedRoles } of matchers) {
      if (matcher(req) && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL(`/${role}`, req.url));
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

