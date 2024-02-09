import '../scss/main.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CardsProvider } from '@/context/cards.context'
import { AuthProvider } from '@/context/auth.context'

import { CommentProvider } from '@/context/comment.context'
import { ClientProvider } from '@/context/client.context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Compuservice',
  description: 'Compuservice Softwares',
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {

  
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClientProvider>
            <CardsProvider>
              <CommentProvider>
                {children}
              </CommentProvider>
            </CardsProvider>
          </ClientProvider>
        </AuthProvider>
        </body>
    </html>
  )
}
