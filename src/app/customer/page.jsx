"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="z-10 flex min-h-screen flex-col bg-black pt-20 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center bg-black px-4 py-8 text-center md:py-16">
        <h1 className="mb-4 text-5xl font-extrabold tracking-wider text-white md:text-8xl">
          EpiQ
        </h1>
        <p className="mb-12 max-w-xl text-xl text-gray-300 md:text-2xl">
          Discover a dining experience tailored just for you. Order with ease
          using our QR Code feature, enjoy great food, and seamless service at
          your favorite restaurants.
        </p>
        <button
          className="bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600"
          onClick={() => router.push("/customer/auth")}
        >
          Join Us
        </button>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gray-900 px-4 py-16 text-center">
        <h2 className="mb-8 text-4xl font-bold text-white">Features</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          <div className="flex flex-col items-center">
            {/* Fixed-size wrapper with aspect ratio */}
            <div className="relative mb-4 h-60 w-80 overflow-hidden">
              <Image
                src="/images/icons/qr-code.png"
                alt="QR Code Ordering"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white">
              QR Code Ordering
            </h3>
            <p className="mt-2 text-gray-300">
              Order seamlessly by scanning the QR code at your table.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative mb-4 h-60 w-80 overflow-hidden">
              <Image
                src="/images/icons/personalized.png"
                alt="Personalized Experience"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white">
              Personalized Experience
            </h3>
            <p className="mt-2 text-gray-300">
              Receive recommendations tailored to your tastes.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative mb-4 h-60 w-80 overflow-hidden">
              <Image
                src="/images/icons/seamless.png"
                alt="Seamless Service"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white">
              Seamless Service
            </h3>
            <p className="mt-2 text-gray-300">
              Enjoy a hassle-free dining experience.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-gray-800 px-4 py-16 text-center">
        <h2 className="mb-8 text-4xl font-bold text-white">How It Works</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          <div className="flex flex-col items-center">
            <div className="relative mb-4 size-60 overflow-hidden">
              <Image
                src="/images/icons/step-1.png"
                alt="Scan QR Code"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white">
              1. Scan QR Code
            </h3>
            <p className="mt-2 text-gray-300">
              Start your dining experience by scanning the QR code at your
              table.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative mb-4 size-60 overflow-hidden">
              <Image
                src="/images/icons/step-2.png"
                alt="Place Order"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white">
              2. Place Your Order
            </h3>
            <p className="mt-2 text-gray-300">
              Browse the menu and place your order directly from your device.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative mb-4 size-60 overflow-hidden">
              <Image
                src="/images/icons/step-3.png"
                alt="Receive Order"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white">
              3. Enjoy Your Meal
            </h3>
            <p className="mt-2 text-gray-300">
              Receive personalized recommendations and enjoy a seamless dining
              experience.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center justify-center bg-black px-4 py-8 text-center md:py-16">
        <h2 className="mb-4 text-4xl font-bold text-white">
          Ready to Elevate Your Dining Experience?
        </h2>
        <button
          className="bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600"
          onClick={() => router.push("/customer/auth")}
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 px-4 py-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <a href="/privacy" className="text-gray-400 hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white">
              Terms of Service
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white">
              Contact
            </a>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com/epiq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/icons/facebook.png"
                alt="Facebook"
                width={24}
                height={24}
                className="size-6"
              />
            </a>
            <a
              href="https://x.com/epiq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/icons/x.png"
                alt="Twitter"
                width={24}
                height={24}
                className="size-6"
              />
            </a>
            <a
              href="https://instagram.com/epiq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/icons/instagram.png"
                alt="Instagram"
                width={24}
                height={24}
                className="size-6"
              />
            </a>
          </div>
          <p className="text-gray-500">© 2024 EpiQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
