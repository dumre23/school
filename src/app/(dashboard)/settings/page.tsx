import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

const SettingsPage = async () => {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role || "admin";

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="hidden md:block text-lg font-semibold">Settings</h1>
      </div>
      
      {/* SETTINGS CONTENT */}
      <div className="space-y-6">
        {/* Notifications Section */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email updates about your account</p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Announcements</p>
                <p className="text-sm text-gray-500">Get notified about new announcements</p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Assignment Reminders</p>
                <p className="text-sm text-gray-500">Receive reminders for upcoming assignments</p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked disabled />
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Privacy</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Profile Visibility</p>
                <p className="text-sm text-gray-500">Make your profile visible to other users</p>
              </div>
              <input type="checkbox" className="w-4 h-4" defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Online Status</p>
                <p className="text-sm text-gray-500">Let others see when you're online</p>
              </div>
              <input type="checkbox" className="w-4 h-4" disabled />
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium mb-2">Theme</p>
              <select className="border rounded-md px-3 py-2 w-full md:w-1/2" disabled>
                <option>Light Mode</option>
                <option>Dark Mode</option>
                <option>Auto</option>
              </select>
            </div>
            <div>
              <p className="font-medium mb-2">Language</p>
              <select className="border rounded-md px-3 py-2 w-full md:w-1/2" disabled>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-800">
            Settings functionality is currently under development. Changes cannot be saved at this time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
