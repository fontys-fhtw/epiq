"use client";

import Button from "@src/components/common/Button";
import Heading from "@src/components/common/Heading";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center bg-black px-4 py-8 text-center md:py-16">
        <Heading
          level={1}
          className="mb-4 text-5xl font-extrabold tracking-wider md:text-8xl"
        >
          EpiQ
        </Heading>
        <p className="mb-12 max-w-xl text-xl text-gray-300 md:text-2xl">
          Discover a dining experience tailored just for you. Order with ease
          using our QR Code feature, enjoy great food, and seamless service at
          your favorite restaurants.
        </p>
        <Button
          size="lg"
          variant="success"
          onClick={() => router.push("/customer/auth")}
          className="px-6 py-3 font-bold text-white transition hover:bg-green-600"
        >
          Join Us
        </Button>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gray-900 px-4 py-16 text-center">
        <Heading level={2} className="mb-8 text-4xl">
          Features
        </Heading>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          <div className="flex flex-col items-center">
            {/* Fixed-size wrapper with aspect ratio */}
            <div className="relative mb-4 h-60 w-80 overflow-hidden rounded-lg">
              <Image
                fill
                src="/images/icons/qr-code.png"
                alt="QR Code Ordering"
                className="object-cover"
              />
            </div>
            <Heading level={3} className="text-2xl font-semibold">
              QR Code Ordering
            </Heading>
            <p className="mt-2 text-gray-300">
              Order seamlessly by scanning the QR code at your table.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative mb-4 h-60 w-80 overflow-hidden rounded-lg">
              <Image
                fill
                src="/images/icons/personalized.png"
                alt="Personalized Experience"
                className="object-cover"
              />
            </div>
            <Heading level={3} className="text-2xl font-semibold">
              Personalized Experience
            </Heading>
            <p className="mt-2 text-gray-300">
              Receive recommendations tailored to your tastes.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative mb-4 h-60 w-80 overflow-hidden rounded-lg">
              <Image
                fill
                src="/images/icons/seamless.png"
                alt="Seamless Service"
                layout="fill"
                className="object-cover"
              />
            </div>
            <Heading level={3} className="text-2xl font-semibold">
              Seamless Service
            </Heading>
            <p className="mt-2 text-gray-300">
              Enjoy a hassle-free dining experience.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-gray-800 px-4 py-16 text-center">
        <Heading level={2} className="mb-8 text-4xl">
          How It Works
        </Heading>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          <div className="flex flex-col items-center">
            <div className="relative mb-4 size-60 overflow-hidden rounded-lg">
              <Image
                fill
                src="/images/icons/step-1.png"
                alt="Scan QR Code"
                className="object-cover"
              />
            </div>
            <Heading level={3} className="text-2xl font-semibold">
              1. Scan QR Code
            </Heading>
            <p className="mt-2 text-gray-300">
              Start your dining experience by scanning the QR code at your
              table.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative mb-4 size-60 overflow-hidden rounded-lg">
              <Image
                fill
                src="/images/icons/step-2.png"
                alt="Place Order"
                className="object-cover"
              />
            </div>
            <Heading level={3} className="text-2xl font-semibold">
              2. Place Your Order
            </Heading>
            <p className="mt-2 text-gray-300">
              Browse the menu and place your order directly from your device.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative mb-4 size-60 overflow-hidden rounded-lg">
              <Image
                fill
                src="/images/icons/step-3.png"
                alt="Receive Order"
                className="object-cover"
              />
            </div>
            <Heading level={3} className="text-2xl font-semibold">
              3. Enjoy Your Meal
            </Heading>
            <p className="mt-2 text-gray-300">
              Receive personalized recommendations and enjoy a seamless dining
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center justify-center bg-black px-4 py-8 text-center md:py-16">
        <Heading level={2} className="mb-4 text-4xl">
          Ready to Elevate Your Dining Experience?
        </Heading>
        <Button
          size="lg"
          variant="success"
          onClick={() => router.push("/customer/auth")}
          className="bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600"
        >
          Get Started
        </Button>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 px-4 py-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white">
              Contact
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              href="https://facebook.com/epiq"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Image
                src="/images/icons/facebook.png"
                alt="Facebook"
                width={24}
                height={24}
                className="size-6"
              />
            </Link>
            <Link
              href="https://x.com/epiq"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Image
                src="/images/icons/x.png"
                alt="Twitter"
                width={24}
                height={24}
                className="size-6"
              />
            </Link>
            <Link
              href="https://instagram.com/epiq"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Image
                src="/images/icons/instagram.png"
                alt="Instagram"
                width={24}
                height={24}
                className="size-6"
              />
            </Link>
          </div>
          <p className="text-gray-500">© 2024 EpiQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
