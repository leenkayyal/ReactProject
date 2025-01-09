import React, { useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";
import Register from "./Register";
import CreateJobForm from "./CreateJobForm";

export const Navigation = () => {
  const { user, loading, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCreateJob, setShowCreateJob] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        style={{
          backgroundColor: "#29353C",
          borderBottom: "2px solid #768A96",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        variant="dark"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand
              style={{
                fontWeight: "bold",
                color: "#E6E6E6",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              Job Board
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link
                  style={{
                    fontWeight: "600",
                    color: "#E6E6E6",
                    marginRight: "1rem",
                  }}
                >
                  All Jobs
                </Nav.Link>
              </LinkContainer>
              {!loading && user && (
                <NavDropdown
                  title="Admin"
                  id="admin-dropdown"
                  style={{
                    fontWeight: "600",
                    color: "#E6E6E6",
                  }}
                >
                  <LinkContainer to="/applications">
                    <NavDropdown.Item
                      style={{
                        fontWeight: "bold",
                        color: "#29353C",
                      }}
                    >
                      View Applications
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item
                    onClick={() => setShowCreateJob(true)}
                    style={{
                      fontWeight: "bold",
                      color: "#29353C",
                    }}
                  >
                    Create New Job
                  </NavDropdown.Item>
                  <LinkContainer to="/my-jobs">
                    <NavDropdown.Item
                      style={{
                        fontWeight: "bold",
                        color: "#29353C",
                      }}
                    >
                      My Posted Jobs
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>

            {!loading && user ? (
              <Nav className="align-items-center">
                <Navbar.Text
                  style={{
                    fontWeight: "bold",
                    color: "#E6E6E6",
                    marginRight: "1rem",
                  }}
                >
                  Welcome, <span style={{ color: "#28a745" }}>{user.email}</span>
                </Navbar.Text>
                <Button
                  variant="outline-light"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "20px",
                    padding: "5px 15px",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Nav>
            ) : (
              <Nav>
                <Button
                  variant="outline-light"
                  style={{
                    marginRight: "1rem",
                    fontWeight: "bold",
                    borderRadius: "20px",
                    padding: "5px 15px",
                  }}
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </Button>
                <Button
                  variant="light"
                  style={{
                    fontWeight: "bold",
                    borderRadius: "20px",
                    padding: "5px 15px",
                  }}
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </Button>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modals */}
      {showLogin && (
        <Login
          show={showLogin}
          onHide={() => setShowLogin(false)}
          onRegisterClick={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <Register
          show={showRegister}
          onHide={() => setShowRegister(false)}
          onLoginClick={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}

      {showCreateJob && (
        <CreateJobForm show={showCreateJob} onHide={() => setShowCreateJob(false)} />
      )}
    </>
  );
};

export default Navigation;
