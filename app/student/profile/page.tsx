"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Card, Avatar } from "antd";

export default function StudentProfilePage() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!session) return <p>You must be logged in to view your profile.</p>;

  const { user } = session;
  const { email } = user;
  const name = user.user_metadata?.full_name;
  const image = user.user_metadata?.avatar_url;

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
      <Card style={{ maxWidth: 600, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
          <Avatar src={image} size={64} />
          <h2 style={{ marginLeft: 16 }}>{name}</h2>
        </div>
        <p><b>Email:</b> {email}</p>
      </Card>
    </div>
  );
}
