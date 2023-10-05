import Navbar from "@/components/shared/navbar/Navbar";
import React, { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="background-light850_dark100">
      <Navbar/>
      <div className="flex">
        LeftSidebar
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        RightSideBar
      </div>
      Toaster
    </main>
  );
};

export default Layout;