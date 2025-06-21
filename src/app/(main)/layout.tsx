"use client"

import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className='w-full'>
                <Header />
                <main className='p-8 bg-gray-100 min-h-screen'>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
