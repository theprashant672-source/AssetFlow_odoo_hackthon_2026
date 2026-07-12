import type { ReactNode } from "react";

import NovaAssetsFooter from "./components/NovaAssetsFooter";
import NovaAssetsNavbar from "./components/NovaAssetsNavbar";
import NovaAssetsStyles from "./components/NovaAssetsStyles";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NovaAssetsStyles />
      <NovaAssetsNavbar />
      {children}
      <NovaAssetsFooter />
    </>
  );
}

