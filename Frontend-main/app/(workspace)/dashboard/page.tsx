import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAssetFlowRole, roleHome } from "@/app/lib/assetflow-roles";

export default async function DashboardRedirectPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("assetflow_role")?.value;
  if (role && isAssetFlowRole(role)) {
    redirect(roleHome(role));
  }
  redirect("/login");
}
