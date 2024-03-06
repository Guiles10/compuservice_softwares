import '../scss/main.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CardsProvider } from '@/context/cards.context'
import { AuthProvider } from '@/context/auth.context'

import { CommentProvider } from '@/context/comment.context'
import { ClientProvider } from '@/context/client.context'

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Compuservice Softwares',
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
                <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false}
                closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>
                {children}
              </CommentProvider>
            </CardsProvider>
          </ClientProvider>
        </AuthProvider>
        </body>
    </html>
  )
}
