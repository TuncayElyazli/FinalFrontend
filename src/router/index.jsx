import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';

// User Pages
import HomePage from '../pages/user/HomePage';
import MoviesCatalogPage from '../pages/user/MoviesCatalogPage';
import MovieDetailPage from '../pages/user/MovieDetailPage';
import BookingPage from '../pages/user/BookingPage';
import LoginPage from '../pages/user/LoginPage';
import RegisterPage from '../pages/user/RegisterPage';

// Admin Pages
import AdminLayout from '../pages/admin/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';
import MoviesPage from '../pages/admin/MoviesPage';
import ScreeningsPage from '../pages/admin/ScreeningsPage';
import UsersPage from '../pages/admin/UsersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'movies',
        element: <MoviesCatalogPage />,
      },
      {
        path: 'movie/:id',
        element: <MovieDetailPage />,
      },
      {
        path: 'booking/:screeningId',
        element: <BookingPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'movies',
        element: <MoviesPage />,
      },
      {
        path: 'screenings',
        element: <ScreeningsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
