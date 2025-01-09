import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

const ApplyNow = ({ show, onHide, jobTitle, jobId, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cv: "",
    photoUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid =
    formData.name.trim() &&
    isValidEmail(formData.email) &&
    formData.cv.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const payload = {
      job_id: jobId,
      name: formData.name,
      email: formData.email,
      photo: formData.photoUrl,
      cv: formData.cv,
    };

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit the application.");
        setIsSubmitting(false);
        return;
      }

      const result = await response.json();
      onSubmit(result);
      alert("Application submitted successfully!");
      onHide();
    } catch (error) {
      setError("There was an error submitting your application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Apply for {jobTitle || "Position"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="mail@example.com"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!isValidEmail(formData.email) && formData.email}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="cv">
            <Form.Label>CV</Form.Label>
            <Form.Control
              as="textarea"
              name="cv"
              rows={3}
              placeholder="Enter details of your CV"
              value={formData.cv}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="photoUrl">
            <Form.Label>Photo URL</Form.Label>
            <Form.Control
              type="url"
              name="photoUrl"
              placeholder="Link to your photo"
              value={formData.photoUrl}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={onHide}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ApplyNow;
