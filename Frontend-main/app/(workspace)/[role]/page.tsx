import { redirect } from "next/navigation";
import { roleHome, type AssetFlowRole, isAssetFlowRole } from "@/app/lib/assetflow-roles";

export default async function RoleIndexPage({
  params,
}: Readonly<{
  params: Promise<{ role: string }>;
}>) {
  const { role } = await params;
  if (!isAssetFlowRole(role)) {
    redirect("/login");
  }
  redirect(roleHome(role as AssetFlowRole));
}
