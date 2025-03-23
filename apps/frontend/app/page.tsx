"use client";
// import { PayBlock } from "@/components/Pay";
// import { VerifyBlock } from "@/components/Verify";
// import SimulateVerify from "@/components/simulate_verify";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { SignIn } from "@/components/SignIn";
import { MiniKit } from "@worldcoin/minikit-js";

export default function Home() {
  const { data: session } = useSession();
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    // 頁面加載時自動使用 World ID 登入
    if (!session) {
      signIn("worldcoin");
    }
  }, [session]);

  useEffect(() => {
    // 獲取並設置用戶名
    const currentUsername: string | undefined = MiniKit.user?.username || undefined;
    setUsername(currentUsername);
    console.log(currentUsername);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      <h1>Hello {username}</h1>
      <button onClick={() => signOut()}>登出</button>
    </main>
  );
}
