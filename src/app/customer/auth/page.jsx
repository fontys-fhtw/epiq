import AuthComponent from "@src/components/customer/AuthComponent";
import { Suspense } from "react";

export default function AuthPage() {
  return (
    <Suspense>
      <AuthComponent />
    </Suspense>
  );
}
