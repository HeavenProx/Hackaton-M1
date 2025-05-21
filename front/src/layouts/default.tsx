import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col">
      <Navbar />
      <main className="min-h-screen pb-[80px]">{children}</main>
      <footer className="absolute bottom-5 w-full flex items-center justify-center">
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
