"use client";

import Image from "next/image";
import Link from "next/link";

const AdminOptionCard = ({
  href,
  title,
  imageSrc,
  imageAlt,
  description,
  targetBlank = false,
}) => {
  return (
    <Link
      href={href}
      target={targetBlank ? "_blank" : "_self"}
      rel={targetBlank ? "noopener noreferrer" : ""}
      className="flex flex-col items-center rounded-md bg-dark p-6 text-white transition-colors duration-200 hover:bg-brown"
    >
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <div className="relative z-10 mb-4 h-60 w-full overflow-hidden rounded-lg">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
      </div>
      <p className="text-center text-gray-300">{description}</p>
    </Link>
  );
};

export default AdminOptionCard;
