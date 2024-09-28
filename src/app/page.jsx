import Link from "next/link";

function importAll(r) {
  return r.keys().map(r);
}

const bgImages = importAll(
  require.context(
    "/public/images/landing-page-bg",
    false,
    /\.(png|jpe?g|svg)$/,
  ),
);

export default function Home() {
  // Define a random bg image for the current request.
  const randomBgImage = bgImages[Math.floor(Math.random() * 9)].default;

  return (
    <>
      <header class="flex h-12 shrink-0 items-center bg-gray-200 md:h-16">
        <div class="container mx-auto">
          <img src="logo.png" alt="Logo" class="mx-auto h-8 md:h-12" />
        </div>
      </header>

      <main
        class="flex grow items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${randomBgImage.src})`,
        }}
      >
        <div class="container mx-auto px-2 md:px-4">
          <div class="grid grid-cols-1 gap-3 py-8 md:grid-cols-2 md:gap-4">
            <Link href="/customer" className="block">
              <div class="flex h-32 flex-col items-center rounded bg-white/80 p-1 text-black shadow transition duration-200 hover:scale-110 hover:bg-white md:h-64">
                <svg
                  className="h-full w-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
                  />
                </svg>
                <p class="mt-1 text-center text-sm md:mt-2 md:text-base">
                  Short text for card 1
                </p>
              </div>
            </Link>
            <Link href="/admin" className="block">
              <div class="flex h-32 flex-col items-center rounded bg-white/80 p-1 text-black shadow transition duration-200 hover:scale-110 hover:bg-white md:h-64">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-full w-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
                <p class="mt-1 text-center text-sm md:mt-2 md:text-base">
                  Short text for card 1
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <footer class="flex h-12 shrink-0 items-center bg-gray-200 md:h-16">
        <div class="container mx-auto text-center text-sm text-black md:text-base">
          <Link href="https://google.com" className="mx-1 md:mx-2">
            Link 1
          </Link>
          <Link href="https://google.com" className="mx-1 md:mx-2">
            Link 2
          </Link>
          <Link href="https://google.com" className="mx-1 md:mx-2">
            Link 3
          </Link>
        </div>
      </footer>
    </>
  );
}
