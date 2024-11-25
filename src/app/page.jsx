import getBaseUrl from "@src/utils/url";
import Link from "next/link";

const SUB_APPS = [
  {
    name: "Customer",
    href: getBaseUrl().customer,
    id: "customer",
    bgColor: "bg-gold",
    textColor: "text-black",
    hoverColor: "hover:bg-yellow-500",
  },
  {
    name: "Admin",
    href: getBaseUrl().admin,
    id: "admin",
    bgColor: "bg-black",
    textColor: "text-gold",
    hoverColor: "hover:bg-gray-800",
  },
];

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {SUB_APPS.map((subApp) => (
        <Link
          key={subApp.id}
          href={subApp.href}
          className={`flex h-1/2 w-full items-center justify-center border-b border-dark text-4xl font-bold transition-all duration-300 last:border-b-0 md:h-full md:w-1/2 md:border-r last:md:border-r-0${subApp.textColor} ${subApp.bgColor} ${subApp.hoverColor} hover:scale-105`}
        >
          <div className="text-center">{subApp.name}</div>
        </Link>
      ))}
    </div>
  );
}
