import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-main flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center mt-3 py-5">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://www.sciences-u-lyon.fr"
          title="Sciences-U homepage"
        >
          <span className="text-default-600">2025 ©</span>
          <p className="text-primary">JVHLL</p>
        </Link>
      </footer>
    </div>
  );
}
