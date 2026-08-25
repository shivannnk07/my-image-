import "./globals.css";

export const metadata = {
  title: "My AI Image Generator",
  description: "Your own free, self-hosted AI image tool",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
