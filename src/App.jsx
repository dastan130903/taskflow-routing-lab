import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RootLayout from './components/RootLayout.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';

const About = lazy(() => import('./pages/About.jsx'));
const Items = lazy(() => import('./pages/Items.jsx'));
const ItemDetails = lazy(() => import('./pages/ItemDetails.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="route-loader" role="status">
          <span className="spinner" />
          Loading page…
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="items" element={<Items />} />
          <Route path="items/:id" element={<ItemDetails />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
