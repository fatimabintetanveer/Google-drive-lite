import Navbar from '@/components/core/Navbar'
import { AuthProvider } from '@/contexts/AuthContext'
// import '@/styles/globals.css'
import '@/styles/styles.css'

export default function App({ Component, pageProps }) {
  return (
  <AuthProvider>
    <Navbar />
    <Component {...pageProps} />
  </AuthProvider>
  )
}
