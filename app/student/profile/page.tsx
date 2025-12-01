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
    return <p>You must be logged in to view your profile.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
          alt="Profile"
          className="w-16 h-16 rounded-full border"
        />
        <div>
          <p className="font-semibold">{user.user_metadata?.full_name}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Back button */}
      <Link
        href="/student"
        className="inline-block px-4 py-2 bg-emerald-900 text-white rounded hover:bg-emerald-700"
      >
        ← Back to Events
      </Link>
    </div>
  );
}
