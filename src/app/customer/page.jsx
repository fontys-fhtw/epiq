"use client";

import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="flex min-h-screen w-full flex-col items-center justify-center bg-black text-center">
        <h1 className="mb-8 text-8xl font-extrabold tracking-wider text-white">
          EpiQ
        </h1>
        <p className="mb-12 max-w-xl text-2xl text-gray-300">
          Discover a dining experience tailored just for you. Order with ease
          using our QR Code feature, great food, and seamless service at your
          favorite restaurants.
        </p>
        <div className="flex space-x-6">
          <Button
            size="lg"
            className="bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-300"
            onClick={() => router.push("/customer/auth")}
          >
            Join Us
          </Button>
          <Button
            size="lg"
            className="border-2 border-white bg-transparent px-6 py-3 text-white transition hover:bg-white hover:text-black"
            onClick={() => router.push("/customer/restaurant-menu")}
          >
            Explore Menu
          </Button>
        </div>
      </section>

      <section className="w-full bg-gray-900 py-24 text-center">
        <h2 className="mb-8 text-5xl font-bold">Why Choose EpiQ?</h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-400">
          EpiQ brings you personalized dining experiences, making every meal
          feel special. With our QR Code ordering feature, you can quickly place
          your order and enjoy your meal without any hassle.
        </p>
      </section>

      <section className="w-full bg-gray-800 py-24 text-center">
        <h2 className="mb-8 text-5xl font-bold">Made Just for You</h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-400">
          Enjoy personalized recommendations based on your tastes, and use our
          QR Code feature for easy, contactless ordering.
        </p>
      </section>
    </div>
  );
}
