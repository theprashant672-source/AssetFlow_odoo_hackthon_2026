"use client";

import { useRouter } from "next/navigation";
import RegisterScreen from "@/app/components/auth/RegisterScreen";

export default function SignupPage() {
  const router = useRouter();
  return <RegisterScreen onGoLogin={() => router.push("/login")} />;
}
