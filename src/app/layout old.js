// import { Crimson_Text, Geist } from "next/font/google";
import "./globals.css";
// import Nav from "./nav";

import localFont from "next/font/local";

// Font files can be colocated inside of `pages`
const pixelFont = localFont({ src: "./pixel.ttf" });
// const crimsonText = Crimson_Text({
//   weight: ["400"],
//   variable: "--font-crimson-text",
//   subsets: ["latin"],
// });

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700"],
// });

export const metadata = {
  title: "<Maeglyn>",
  description: " } < <=> > { ",
};

export default function RootLayout({ children }) {
  return (
    <html>
      {/* <body className={`${crimsonText.variable} ${geistSans.variable} antialiased dark`}> */}
      <body className={`${pixelFont.className}  antialiased`}>
        {/* <Nav /> */}
        {children}
      </body>
    </html>
  );
}
