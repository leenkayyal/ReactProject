import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import ApplicationList from "./components/ApplicationList.jsx";
import MyJobList from "./components/MyJobList.jsx";
import { Navigation } from "./components/Navigation";
import JobList from "./components/JobList"; 
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

// Component to handle protected routes
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>; // Display loading message while user is being verified
  }

  if (!user) {
    return <Login />; // Redirect to Login if user is not authenticated
  }

  return element;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100 bg-light">
          {/* Navigation Bar */}
          <Navigation />
          <Container className="py-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<JobList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/applications"
                element={<ProtectedRoute element={<ApplicationList />} />}
              />
              <Route
                path="/my-jobs"
                element={<ProtectedRoute element={<MyJobList />} />}
              />
            </Routes>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
