import React, { useEffect, useState } from "react";
import { Container, Alert, Spinner, Card, Row, Col } from "react-bootstrap";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/applications");
        if (!response.ok) {
          throw new Error("Failed to fetch applications.");
        }
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (applications.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="info">No applications have been submitted yet.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center" style={{ color: "#29353C", fontWeight: "bold" }}>
        Submitted Applications
      </h1>
      <Row className="g-4">
        {applications.map((application) => (
          <Col key={application.id} xs={12} md={6} lg={4}>
            <Card
              className="shadow-sm h-100"
              style={{
                borderRadius: "15px",
                border: "solid lightgray",
                backgroundColor: "#F9F9F9",
                minHeight: "300px",
              }}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className="badge"
                    style={{
                      fontSize: "0.9rem",
                      borderRadius: "10px",
                      backgroundColor: "#28a745", // Green color
                      color: "#FFFFFF",
                      padding: "5px 10px",
                    }}
                  >
                    {application.job?.type || "N/A"}
                  </span>
                  
                </div>
                <Card.Title
                  className="mt-3"
                  style={{ color: "#2C3E50", fontWeight: "bold", fontSize: "1.2rem" }}
                >
                  {application.name}
                </Card.Title>
                <Card.Text style={{ color: "#34495E", marginBottom: "5px" }}>
                  <strong>Email:</strong> {application.email}
                </Card.Text>
                <Card.Text style={{ color: "#34495E", marginBottom: "5px" }}>
                  <strong>Applied Position:</strong> {application.job?.title || "N/A"}
                </Card.Text>
                <Card.Text style={{ color: "#28a745", marginBottom: "5px" }}>
                  <strong>Salary:</strong> ${application.job?.salary || "N/A"}/year
                </Card.Text>
                <Card.Text style={{ color: "#34495E", marginBottom: "5px" }}>
                  <strong>Experience:</strong> {application.cv || "N/A"}
                </Card.Text>
              </Card.Body>
              <Card.Footer
                style={{
                  backgroundColor: "#FFFFFF",
                  borderTop: "1px solid #E6E6E6",
                  color: "#768A96",
                  fontStyle: "italic",
                  fontSize: "0.9rem",
                  borderRadius: "0 0 15px 15px",
                }}
              >
                <strong>Required Skills:</strong> {application.job?.skills || "N/A"}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ApplicationList;
