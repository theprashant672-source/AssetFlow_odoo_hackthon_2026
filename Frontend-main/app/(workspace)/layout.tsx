import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  if (!cookieStore.get("assetflow_session")) {
    redirect("/login");
  }

  return <>{children}</>;
}
