import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { LangProvider } from "./contexts/LangContext";
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "AdSabai – Thailand's Premier Classifieds",
  description: "Post and manage your advertisements",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before paint — prevents flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('adSabaiTheme');if(t!=='dark')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();` }} />
      </head>
      <body>
        <LangProvider>
          <AuthProvider>
            <Navigation />
            {children}
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
