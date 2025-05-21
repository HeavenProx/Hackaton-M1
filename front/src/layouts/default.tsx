import { Link } from "@heroui/link";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="">{children}</main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://www.sciences-u-lyon.fr"
          title="Sciences-U homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className="text-primary">JVHLL</p>
        </Link>
      </footer>
    </div>
  );
}
