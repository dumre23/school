import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const ProfilePage = async () => {
  const { sessionClaims } = await auth();
  const user = await currentUser();
  const role = (sessionClaims?.metadata as { role?: string })?.role || "admin";

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="hidden md:block text-lg font-semibold">Profile</h1>
      </div>
      
      {/* PROFILE CONTENT */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT - Profile Image and Basic Info */}
        <div className="flex flex-col items-center md:w-1/3">
          <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-lamaSky flex items-center justify-center text-4xl font-bold text-white">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-500 capitalize">{role}</p>
        </div>

        {/* RIGHT - Detailed Information */}
        <div className="flex-1">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium">{user?.firstName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium">{user?.lastName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    {user?.emailAddresses[0]?.emailAddress || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{user?.username || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium capitalize">{role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-xs break-all">{user?.id}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t">
              <button className="px-4 py-2 bg-lamaSky text-white rounded-md hover:bg-lamaSkyLight">
                Edit Profile (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
