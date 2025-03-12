import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {ToastContainer} from "react-toastify";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lama Dev School Management Dashboard",
  description: "Next.js School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>{children} <ToastContainer position="bottom-right" theme="dark"/> </body>
    </html>
    </ClerkProvider>
  );
}
