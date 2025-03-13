import type { Metadata } from "next"
import RootLayout from "./root-layout"

export const metadata: Metadata = {
  title: "The Art Gallery",
  description: "Discover and buy amazing artwork",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  )
}
