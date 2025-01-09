import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Alert, Spinner, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext"; // Import user context
import { api } from "../utils/api";

const MyJobList = () => {
  const { user } = useAuth(); // Get the logged-in user info
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [jobToDelete, setJobToDelete] = useState(null); // Store the job to delete

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/my-jobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data); // Save jobs to state
      } catch (err) {
        setError(err.message); // Save error to state
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    if (user) {
      fetchJobs(); // Fetch only if user is logged in
    } else {
      setLoading(false);
      setError("You must be logged in to view your jobs.");
    }
  }, [user]);

  const handleDeleteConfirmation = (job) => {
    setJobToDelete(job); // Set the job to be deleted
    setShowModal(true); // Show the modal
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/my-jobs`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: jobToDelete.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete the job");
      }

      setJobs(jobs.filter((job) => job.id !== jobToDelete.id)); // Update state
      setShowModal(false); // Close the modal
      setJobToDelete(null); // Clear the selected job
    } catch (err) {
      console.error("Error deleting job:", err.message);
      setError(err.message);
      setShowModal(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{`Error: ${error}`}</Alert>
      </Container>
    );
  }

  if (jobs.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="info">No jobs found. Create a job to see it listed here.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ minHeight: "100vh" }}>
      <h1 className="text-center mb-5" style={{ color: "#29353C", fontWeight: "bold" }}>
        My Jobs
      </h1>
      <Row className="g-4">
        {jobs.map((job) => (
          <Col key={job.id} xs={12} sm={6} lg={4}>
            <Card
              className="h-100 shadow border-0"
              style={{
                backgroundColor: "#E6E6E6",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Card.Body>
                <Card.Title
                  style={{
                    color: "#2C3E50",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    marginBottom: "10px",
                  }}
                >
                  {job.title}
                </Card.Title>
                <Card.Subtitle
                  className="mb-3"
                  style={{ color: "#768A96", fontSize: "1rem", fontWeight: "600" }}
                >
                  {job.type}
                </Card.Subtitle>
                <Card.Text
                  style={{
                    color: "#28a745",
                    fontWeight: "600",
                    fontSize: "1.2rem",
                    marginBottom: "8px",
                  }}
                >
                  Salary: ${job.salary.toLocaleString()}/Year
                </Card.Text>
                <Card.Text
                  style={{
                    color: "#2C3E50",
                    fontSize: "1rem",
                    marginBottom: "8px",
                  }}
                >
                  Required Skills: {job.skills}
                </Card.Text>
                <Card.Text
                  style={{
                    color: "#768A96",
                    fontStyle: "italic",
                    fontSize: "0.9rem",
                  }}
                >
                  Posted: {new Date(job.date).toLocaleDateString()}
                </Card.Text>
              </Card.Body>
              <div className="d-flex justify-content-center">
                <Button
                  variant="danger"
                  style={{
                    fontWeight: "bold",
                    width: "90%",
                  }}
                  onClick={() => handleDeleteConfirmation(job)}
                >
                  Delete Job
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Deletion of Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure that you want to delete the job <b>{jobToDelete?.title}</b>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Job
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyJobList;
