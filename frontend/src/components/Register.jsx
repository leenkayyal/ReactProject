import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const Register = ({ show, onHide, onLoginClick }) => {
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
    console.log("Email:", email);
    console.log("Password:", password);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create an Account</Modal.Title>
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
              autoComplete="new-password"
            />
          </Form.Group>
          <Button type="submit" className="w-100" style={{ backgroundColor: "#768A96" }}>
            Register
          </Button>
        </Form>
        <div className="text-center mt-3">
          <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>
            Already have an account? Login
          </a>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Register;
