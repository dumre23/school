import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

const MessagesPage = async () => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role || "admin";

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Messages</h1>
      </div>
      
      {/* CONTENT */}
      <div className="flex flex-col items-center justify-center h-[400px] text-center">
        <Image
          src="/message.png"
          alt="Messages"
          width={100}
          height={100}
          className="opacity-50 mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          Messages Feature Coming Soon
        </h2>
        <p className="text-gray-400">
          The messaging system is currently under development.
        </p>
      </div>
    </div>
  );
};

export default MessagesPage;
