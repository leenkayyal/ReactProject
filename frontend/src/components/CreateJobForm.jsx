import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext"; // Ensure only logged-in users can access

const CreateJobForm = ({ show, onHide, onJobCreated }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    salary: "",
    description: "",
    skills: "",
    postingDate: "",
    logoUrl: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          salary: Number(formData.salary),
          description: formData.description,
          skills: formData.skills,
          date: formData.postingDate,
          picture: formData.logoUrl || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create the job.");
      }

      const createdJob = await response.json();
      setSuccess("Job created successfully!");
      console.log("Job created:", createdJob);

      // Call the callback to update the job list if provided
      if (onJobCreated) {
        onJobCreated(createdJob);
      }

      // Reset the form
      setFormData({
        title: "",
        type: "",
        salary: "",
        description: "",
        skills: "",
        postingDate: "",
        logoUrl: "",
      });

      // Close the modal after a short delay
      setTimeout(() => {
        setSuccess("");
        onHide();
      }, 1500);
    } catch (error) {
      console.error("Error creating job:", error);
      setError(error.message);
    }
  };

  if (!user) {
    return <p className="text-center text-danger">You must be logged in to create a job.</p>;
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Job</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Job Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="e.g., Senior Software Engineer"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="type">
            <Form.Label>Job Type *</Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select job type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="salary">
            <Form.Label>Annual Salary (USD) *</Form.Label>
            <Form.Control
              type="number"
              name="salary"
              placeholder="e.g., 100000"
              value={formData.salary}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              placeholder="Enter job description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="skills">
            <Form.Label>Required Skills</Form.Label>
            <Form.Control
              type="text"
              name="skills"
              placeholder="e.g., React, Node.js, SQL"
              value={formData.skills}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postingDate">
            <Form.Label>Posting Date *</Form.Label>
            <Form.Control
              type="date"
              name="postingDate"
              value={formData.postingDate}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="logoUrl">
            <Form.Label>Company Logo URL</Form.Label>
            <Form.Control
              type="url"
              name="logoUrl"
              placeholder="https://example.com/logo.png"
              value={formData.logoUrl}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={onHide}
              style={{
                backgroundColor: "#D3D3D3", // Grayed-out cancel button
                color: "#29353C", // Opposite color for text visibility
                fontWeight: "bold",
                border: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              style={{
                backgroundColor: "#768A96", // Submit button matching theme
                color: "#FFFFFF", // White text for contrast
                fontWeight: "bold",
                border: "none",
              }}
            >
              Create Job
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateJobForm;
