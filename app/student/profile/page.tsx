"use client";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-blue-100">
        <p>You must be logged in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-blue-100">
      <div className="bg-white rounded-lg shadow-lg w-[500px] h-[600px] flex flex-col items-center justify-center text-center p-10">
        <img
          src={user.user_metadata?.picture || user.user_metadata?.avatar_url}
          alt="Profile"
          className="w-32 h-32 rounded-full border mb-6"
        />
        <p className="text-2xl font-semibold text-black mb-2">
          {user.user_metadata?.full_name}
        </p>
        <p className="text-gray-600 mb-8">{user.email}</p>

        <Link
          href="/student"
          className="inline-block px-6 py-3 bg-emerald-900 text-white rounded hover:bg-emerald-700"
        >
          ← Back to Events
        </Link>
      </div>
    </div>
  );
}

