import { Crimson_Text, Roboto } from "next/font/google";
import BackBtn from "./back-button";
import "./globals.css";

const crimsonText = Crimson_Text({
  weight: ["400"],
  variable: "--font-crimson-text",
  subsets: ["latin"],
});

const robotoText = Roboto({
  weight: ["300", "400"],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata = {
  title: "Maeglyn'); DROP TABLE Students; --",
  description: "Almost coherent ramblings",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={`${crimsonText.variable} ${robotoText.variable} antialiased`}>
        <BackBtn />
        {children}
      </body>
    </html>
  );
}
