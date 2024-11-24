import CustomerProfile from "@src/components/customer/ProfileComponent";
import { Suspense } from "react";

export default function CustomerProfilePage() {
  return (
    <Suspense>
      <CustomerProfile />
    </Suspense>
  );
}
