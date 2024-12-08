import EpiQLogo from "@src/components/common/EpiQLogo";
import BurgerMenu from "@src/components/customer/BurgerMenu";
import OrderStatusNotification from "@src/components/customer/OrderStatusNotification";
import Link from "next/link";

export default function CustomerPageLayout({ children }) {
  return (
    <div className="relative">
      <Header />
      <OrderStatusNotification />
      <div className="h-full min-h-screen bg-darkBg px-8 pt-20">{children}</div>
    </div>
  );
}

function Header() {
  return (
    <nav className="fixed left-0 top-0 z-20 w-full bg-transparent">
      <div className="z-20 flex h-20 w-full items-center justify-between px-8">
        <div>
          <Link href="/customer">
            <EpiQLogo width={100} height={50} />
          </Link>
        </div>
        <div>
          <BurgerMenu />
        </div>
      </div>
    </nav>
  );
}
