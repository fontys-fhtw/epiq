"use client";

import ActionButton from "@src/components/common/ActionButton";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FEATURES = [
  {
    icon: "/images/icons/qr-code.png",
    title: "QR Code Ordering",
    description: "Order seamlessly by scanning the QR code at your table.",
  },
  {
    icon: "/images/icons/personalized.png",
    title: "Personalized Experience",
    description: "Receive recommendations tailored to your tastes.",
  },
  {
    icon: "/images/icons/seamless.png",
    title: "Seamless Service",
    description: "Enjoy a hassle-free dining experience.",
  },
];

const STEPS = [
  {
    icon: "/images/icons/step-1.png",
    title: "Scan QR Code",
    description:
      "Start your dining experience by scanning the QR code at your table.",
  },
  {
    icon: "/images/icons/step-2.png",
    title: "Place Your Order",
    description:
      "Browse the menu and place your order directly from your device.",
  },
  {
    icon: "/images/icons/step-3.png",
    title: "Enjoy Your Meal",
    description:
      "Receive personalized recommendations and enjoy a seamless dining experience.",
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      <section className="flex flex-col items-center justify-center bg-darkBg py-14 text-center">
        <p className="mb-6 max-w-xl text-xl text-gray-300">
          Discover a dining experience tailored just for you. Order with ease
          using our QR Code feature, enjoy great food, and seamless service at
          your favorite restaurants.
        </p>
        <ActionButton onClick={() => router.push("/customer/auth")}>
          Join Us
        </ActionButton>
      </section>

      <section className="w-full rounded-t-3xl bg-dark py-14 text-center">
        <h2 className="mb-8 text-4xl font-bold text-white">Features</h2>
        <div className="grid grid-cols-1 gap-12">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center">
              <div className="relative mb-4 h-60 w-80 overflow-hidden rounded-lg">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 px-6 text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full rounded-b-3xl bg-brown py-16 text-center">
        <h2 className="mb-8 text-4xl font-bold text-white">How It Works</h2>
        <div className="grid grid-cols-1 gap-12">
          {STEPS.map((step) => (
            <div key={step.title} className="flex flex-col items-center">
              <div className="relative mb-4 h-60 w-80 overflow-hidden rounded-lg">
                <Image
                  src={step.icon}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 px-6 text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center justify-center bg-darkBg py-14 text-center">
        <h2 className="mb-6 text-4xl font-bold text-white">
          Ready to Elevate Your Dining Experience?
        </h2>
        <ActionButton onClick={() => router.push("/customer/auth")}>
          Get Started
        </ActionButton>
      </section>
    </>
  );
}
