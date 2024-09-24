import Suggestions from "@src/components/customer/Suggestions";
import Link from "next/link";

export default function CustomerPage() {
  return (
    <>
      <Link href="/customer/signIn">Sign In page</Link>
      <h1>Customer Page</h1>
      <h2>Menu Suggestions</h2>
      <Suggestions />
    </>
  );
}
