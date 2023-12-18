import React from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider } from "react-router-dom";
import router from "./router.jsx"

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

// Bringing in the GoogleOAuthProvider from the package
import { GoogleOAuthProvider } from '@react-oauth/google';

import { QueryClient, QueryClientProvider } from 'react-query'

import { App as AntdApp } from "antd";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="767745412305-nf0ir6rj1q2qqo016nosnugq9q66u9g8.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <AntdApp>
          <RouterProvider router={router} />
        </AntdApp>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
