import '../scss/main.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SupProvider } from '@/context/sup.context'
import { AuthProvider } from '@/context/auth.context'
import { NextRouter } from 'next/router'

import { CommentProvider } from '@/context/comment.context'

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
          <SupProvider>
            <CommentProvider>
              {children}
            </CommentProvider>
          </SupProvider>
        </AuthProvider>
        </body>
    </html>
  )
}
