import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (role) {
    redirect(`/${role}`);
  }
  
  redirect("/sign-in");
}
