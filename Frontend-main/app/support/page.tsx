import { Suspense } from "react";

import SupportClient from "./support-client";

export default function SupportPage() {
  return (
    <Suspense fallback={null}>
      <SupportClient />
    </Suspense>
  );
}
