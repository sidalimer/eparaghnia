import "./globals.css";

// Google Fonts (via link tag dans <head>)
export const metadata = {
  title: "Eparagnia",
  description: "App de gestion de budget personnelle",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Polices Google selon charte graphique */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&family=Open+Sans:wght@400;600&family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F4F6F7] text-[#333333] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
