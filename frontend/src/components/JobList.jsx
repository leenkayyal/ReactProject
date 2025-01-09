import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext"; // Import user context
import ApplyNow from "./ApplyNow"; // Import ApplyNow component
import classNames from "classnames";
import "animate.css";

const JobList = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Filter state
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/jobs");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleApplicationSubmit = (formData) => {
    console.log("Application Submitted:", {
      ...formData,
      job: selectedJob,
    });
    setShowModal(false);
  };

  // Filtered Jobs
  const filteredJobs = jobs.filter((job) => {
    if (!filterType) return true; // No filter applied
    return job.type.toLowerCase() === filterType.toLowerCase();
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-danger">Error: {error}</p>;
  }

  if (!loading && filteredJobs.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h3 style={{ color: "#768A96" }}>No jobs available for the selected type.</h3>
        <Button
          variant="outline-secondary"
          className="mt-3"
          onClick={() => setFilterType("")} // Reset the filter
          style={{
            color: "#29353C",
            borderColor: "#768A96",
            fontWeight: "bold",
          }}
        >
          Clear Filter
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5" style={{ color: "#29353C", fontWeight: "bold" }}>
        Job Opportunities
      </h1>

      {/* Filter by Job Type */}
      <div className="d-flex justify-content-start mb-4">
        <Form.Select
          style={{
            width: "250px",
            justifyContent: "left",
            borderRadius: "20px",
            padding: "10px",
            border: "2px solid #768A96",
            backgroundColor: "#F5F5F5",
            fontWeight: "bold",
            color: "#29353C",
            outline: "none",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            transition: "all 1s ease-in-out",
          }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          onMouseEnter={(e) => (e.target.style.borderColor = "#5A707A")}
          onMouseLeave={(e) => (e.target.style.borderColor = "#768A96")}
        >
          <option value="">Filter by Job Type</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="contract">Contract</option>
        </Form.Select>
      </div>

      <Row className="g-4">
        {filteredJobs.map((job) => (
          <Col key={job.id} xs={12} sm={6} lg={4}>
            <Card
              className={classNames(
                "h-100 shadow border-0",
                "animate__animated animate__fadeIn"
              )}
              style={{
                backgroundColor: "#E6E6E6",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.5s ease, box-shadow 0.5s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
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
                  Type: {job.type}
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
                <Card.Text style={{ color: "#2C3E50" }}>
                  <strong>Skills:</strong> {job.skills}
                </Card.Text>
                <Card.Text style={{ color: "#768A96", fontStyle: "italic" }}>
                  <strong>Date:</strong> {new Date(job.date).toLocaleDateString()}
                </Card.Text><br></br>
                <Card.Text style={{ color: "#34495E", marginBottom: "8px" }}>
                  {job.description}
                </Card.Text>
              </Card.Body>
              <div className="d-flex justify-content-center pb-3">
                <Button
                  variant="primary"
                  style={{
                    backgroundColor: "#768A96",
                    border: "none",
                    fontWeight: "bold",
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#5A707A")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#768A96")}
                  onClick={() => handleApplyClick(job)}
                >
                  Apply Now
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ApplyNow Modal */}
      {selectedJob && (
        <ApplyNow
          show={showModal}
          onHide={() => setShowModal(false)}
          jobTitle={selectedJob.title}
          jobId={selectedJob.id}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </Container>
  );
};

export default JobList;
