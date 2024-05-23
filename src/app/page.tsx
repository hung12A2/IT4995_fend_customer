'use client'
import { useAuthContext } from "@/provider/auth.provider";

export default function Home() {
  const authProvide = useAuthContext();
  const {user} = authProvide;

  return (
    <main>
      <div>Hellllo {user?.fullName}</div>
    </main>
  );
}
