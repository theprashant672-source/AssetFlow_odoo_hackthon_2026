import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import WorkspaceShell from "@/app/components/assetflow/WorkspaceShell";
import { isAssetFlowRole, type AssetFlowRole, roleHome } from "@/app/lib/assetflow-roles";

export default async function RoleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}>) {
  const { role } = await params;
  if (!isAssetFlowRole(role)) notFound();

  const cookieStore = await cookies();
  const session = cookieStore.get("assetflow_session")?.value;
  const currentRole = cookieStore.get("assetflow_role")?.value;

  if (!session) {
    redirect("/login");
  }

  if (currentRole) {
    if (!isAssetFlowRole(currentRole)) {
      redirect("/login");
    }
    if (currentRole !== role) {
      redirect(roleHome(currentRole as AssetFlowRole));
    }
  }

  return <WorkspaceShell role={role as AssetFlowRole}>{children}</WorkspaceShell>;
}
