import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Fragment><Component {...pageProps} /><ToastContainer /></Fragment>
}
