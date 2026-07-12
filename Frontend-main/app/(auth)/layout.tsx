import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAssetFlowRole, roleHome } from "@/app/lib/assetflow-roles";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get("assetflow_session")?.value;
  const role = cookieStore.get("assetflow_role")?.value;
  if (session) {
    if (role && isAssetFlowRole(role)) {
      redirect(roleHome(role));
    }
    redirect("/dashboard");
  }

  return <>{children}</>;
}
