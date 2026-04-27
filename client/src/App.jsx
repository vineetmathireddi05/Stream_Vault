import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './components/layout/PrivateRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Browse from './pages/Browse';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Search from './pages/Search';
import MyList from './pages/MyList';
import Profile from './pages/Profile';
import Watch from './pages/Watch';
import NotFound from './pages/NotFound';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="font-display text-3xl text-primary tracking-widest">STREAMVAULT</span>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={session ? <Navigate to="/browse" replace /> : <Landing />} />
        <Route path="/login" element={session ? <Navigate to="/browse" replace /> : <Login />} />
        <Route path="/signup" element={session ? <Navigate to="/browse" replace /> : <Signup />} />

        <Route element={<AppLayout />}>
          <Route
            path="/browse"
            element={
              <PrivateRoute>
                <PageTransition>
                  <Browse />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <PrivateRoute>
                <PageTransition>
                  <Movies />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/tv"
            element={
              <PrivateRoute>
                <PageTransition>
                  <TVShows />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <PageTransition>
                  <Search />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/my-list"
            element={
              <PrivateRoute>
                <PageTransition>
                  <MyList />
                </PageTransition>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <PageTransition>
                  <Profile />
                </PageTransition>
              </PrivateRoute>
            }
          />
        </Route>

        <Route
          path="/watch/:type/:id"
          element={
            <PrivateRoute>
              <Watch />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
