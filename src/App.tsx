import { useSelector } from 'react-redux';
import './App.css';
import RouteDefinitions from './components/Routes/RouteDefinitions';
import { Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './layouts/Navbar';
import { OverlayLoader } from './pages/OverlayLoader/OverlayLoader';

function App() {
  const authState = useSelector((state: any) => state.auth);
  const location = useLocation();
  const lastPathSegment = location.pathname.split('/').pop();

  if (authState.isAuthenticated &&
    (lastPathSegment === "login" || lastPathSegment === "register" || lastPathSegment === "")) {
    return <Navigate to="/reporting-system" />;
  }

  if (!authState.isAuthenticated &&
    (lastPathSegment === "reporting-system")) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="App">
      <ToastContainer />
      {authState.isAuthenticated && <Navbar />}
      <OverlayLoader />
      <RouteDefinitions />
    </div>
  );
}

export default App;
