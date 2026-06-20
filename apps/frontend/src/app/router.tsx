import { createBrowserRouter } from 'react-router-dom';
import { App, ProtectedRoute } from './App';
import { Login } from '../modules/auth/pages/Login';
import { Onboarding } from '../modules/auth/pages/Onboarding';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'onboarding',
        element: <Onboarding />,
      },
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <div className="p-4 bg-white rounded shadow text-lg font-medium">Welcome to Commandix POC Dashboard!</div>,
          },
        ]
      }
    ],
  },
]);
