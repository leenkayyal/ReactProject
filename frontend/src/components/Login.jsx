import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

const Login = ({ show, onHide, onRegisterClick }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      setEmail("");
      setPassword("");
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await login(email, password);
      onHide();
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login to Your Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Form.Group>
          <Button type="submit" className="w-100" style={{ backgroundColor: "#768A96" }}>
            Login
          </Button>
        </Form>
        <div className="text-center mt-3">
          <a href="#" onClick={(e) => { e.preventDefault(); onRegisterClick(); }}>
            Don’t have an account? Register
          </a>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Login;
