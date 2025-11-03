import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"; 
import { AppSidebar } from "@/components/app-sidebar"; 
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Researcher Recommendation",
  description: "Find relevant experts for your research topic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <AppSidebar />
              <main className="flex-1 p-8">
                <div className="flex">
                  <SidebarTrigger className="mb-4" />
                  <div className="text-2xl font-bold p-4">
                    my<span className="text-blue-500">ITS</span>
                  </div>
                </div>
                {children}
              </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}