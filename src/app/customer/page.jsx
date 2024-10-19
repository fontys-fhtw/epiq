"use client";

import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center bg-black px-4 py-8 text-center md:py-16">
        <img
          src="/images/hero-image.png"
          alt="EpiQ in Action"
          className="mb-8 w-full max-w-md"
        />
        <h1 className="mb-4 text-5xl font-extrabold tracking-wider text-white md:text-8xl">
          EpiQ
        </h1>
        <p className="mb-12 max-w-xl text-xl text-gray-300 md:text-2xl">
          Discover a dining experience tailored just for you. Order with ease
          using our QR Code feature, enjoy great food, and seamless service at
          your favorite restaurants.
        </p>
        <Button
          size="lg"
          className="bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600"
          onClick={() => router.push("/customer/auth")}
        >
          Join Us
        </Button>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gray-900 px-4 py-16 text-center">
        <h2 className="mb-8 text-4xl font-bold text-white">Features</h2>
        <div className="flex flex-col justify-center space-y-8 md:flex-row md:space-x-12 md:space-y-0">
          <div className="flex flex-col items-center">
            <img
              src="/icons/qr-code.svg"
              alt="QR Code Ordering"
              className="mb-4 size-12"
            />
            <h3 className="text-2xl font-semibold text-white">
              QR Code Ordering
            </h3>
            <p className="mt-2 text-gray-300">
              Order seamlessly by scanning the QR code at your table.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/icons/personalization.svg"
              alt="Personalized Experience"
              className="mb-4 size-12"
            />
            <h3 className="text-2xl font-semibold text-white">
              Personalized Experience
            </h3>
            <p className="mt-2 text-gray-300">
              Receive recommendations tailored to your tastes.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/icons/seamless-service.svg"
              alt="Seamless Service"
              className="mb-4 size-12"
            />
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
        <div className="flex flex-col justify-center space-y-8 md:flex-row md:space-x-12 md:space-y-0">
          <div className="flex flex-col items-center">
            <img
              src="/icons/scan-qr.svg"
              alt="Scan QR Code"
              className="mb-4 size-12"
            />
            <h3 className="text-2xl font-semibold text-white">
              1. Scan QR Code
            </h3>
            <p className="mt-2 text-gray-300">
              Start your dining experience by scanning the QR code at your
              table.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/icons/order.svg"
              alt="Place Order"
              className="mb-4 size-12"
            />
            <h3 className="text-2xl font-semibold text-white">
              2. Place Your Order
            </h3>
            <p className="mt-2 text-gray-300">
              Browse the menu and place your order directly from your device.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/icons/receive.svg"
              alt="Receive Order"
              className="mb-4 size-12"
            />
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

      {/* Testimonials Section */}
      <section className="w-full bg-gray-700 px-4 py-16 text-center">
        <h2 className="mb-8 text-4xl font-bold text-white">
          What Our Users Say
        </h2>
        <div className="mx-auto flex max-w-2xl flex-col space-y-8">
          <div className="rounded-lg bg-gray-600 p-6">
            <p className="text-lg text-gray-300">
              “EpiQ transformed my dining experience! Ordering is so easy, and
              the personalized recommendations are spot on.”
            </p>
            <h4 className="mt-4 text-xl font-semibold text-white">
              - Maria S.
            </h4>
          </div>
          <div className="rounded-lg bg-gray-600 p-6">
            <p className="text-lg text-gray-300">
              “Our restaurant partnered with EpiQ, and we&apos;ve seen a
              significant increase in customer satisfaction and repeat visits.”
            </p>
            <h4 className="mt-4 text-xl font-semibold text-white">
              - Chef Luca, La Bella
            </h4>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col items-center justify-center bg-black px-4 py-8 text-center md:py-16">
        <h2 className="mb-4 text-4xl font-bold text-white">
          Ready to Elevate Your Dining Experience?
        </h2>
        <Button
          size="lg"
          className="bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600"
          onClick={() => router.push("/customer/auth")}
        >
          Get Started
        </Button>
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
              <img
                src="/icons/facebook.svg"
                alt="Facebook"
                className="size-6"
              />
            </a>
            <a
              href="https://twitter.com/epiq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icons/twitter.svg" alt="Twitter" className="size-6" />
            </a>
            <a
              href="https://instagram.com/epiq"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/icons/instagram.svg"
                alt="Instagram"
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
