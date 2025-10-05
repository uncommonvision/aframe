import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />
      },
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: 'not-found',
        element: <NotFoundPage />
      },
      {
        path: '*',
        element: <Navigate to="/not-found" replace />
      }
    ]
  }
])
