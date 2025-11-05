// src/components/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { Container, Form, Button, Table, Alert, Card } from "react-bootstrap";
import { GeoPoint } from "firebase/firestore";
import {
  getMarkers,
  addMarker,
  updateMarker,
  deleteMarker,
} from "../services/markerService";
import { getUserProfile } from "../services/authService";
import type { Marker, UserProfile } from "../types";
import Map from "./Map";

const AdminDashboard = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [hint, setHint] = useState("");
  const [points, setPoints] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editingMarker, setEditingMarker] = useState<Marker | null>(null);
  const [liveLocation, setLiveLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        setError("Failed to fetch user profile.");
      }
    };

    const fetchMarkers = async () => {
      const markers = await getMarkers();
      setMarkers(markers);
    };
    fetchUserData();
    fetchMarkers();
  }, []);

  const handleCheckLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLiveLocation({ latitude, longitude });

      let closestMarkerDistance = Infinity;
      let within50m = false;
      for (const marker of markers) {
        const distance = haversineDistance(
          { latitude, longitude },
          {
            latitude: marker.location.latitude,
            longitude: marker.location.longitude,
          },
        );

        if (distance < 50) {
          setLocationStatus(`Within 50m of marker: ${marker.title}`);
          within50m = true;
          break;
        }
        if (distance < closestMarkerDistance) {
          closestMarkerDistance = distance;
        }
      }

      if (!within50m) {
        if (closestMarkerDistance >= 100) {
          setLocationStatus("READY");
        } else {
          setLocationStatus(
            `Nearest marker is ${closestMarkerDistance.toFixed(2)}m away.`,
          );
        }
      }
    });
  };

  const handleAddMarker = async () => {
    setError(null);
    setSuccess(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = new GeoPoint(latitude, longitude);

        // Distance check
        for (const marker of markers) {
          const distance = haversineDistance(
            {
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
            },
            {
              latitude: marker.location.latitude,
              longitude: marker.location.longitude,
            },
          );
          if (distance < 100) {
            setError(
              "New marker is too close to an existing one (less than 100m)",
            );
            return;
          }
        }

        try {
          await addMarker({
            location: newLocation,
            title,
            question,
            answer,
            points,
            hint,
          });
          setSuccess("Marker added successfully!");
          setTitle("");
          setQuestion("");
          setAnswer("");
          setHint("");
          setPoints(0);
          const updatedMarkers = await getMarkers();
          setMarkers(updatedMarkers);
        } catch (e) {
          setError("Failed to add marker");
        }
      },
      () => {
        setError("Unable to retrieve your location");
      },
    );
  };

  const handleUpdateMarker = async () => {
    if (!editingMarker) return;

    setError(null);
    setSuccess(null);

    try {
      await updateMarker(editingMarker.id, {
        title: editingMarker.title,
        question: editingMarker.question,
        answer: editingMarker.answer,
        points: editingMarker.points,
        hint: editingMarker.hint,
      });
      setSuccess("Marker updated successfully!");
      setEditingMarker(null);
      const updatedMarkers = await getMarkers();
      setMarkers(updatedMarkers);
    } catch (e) {
      setError("Failed to update marker");
    }
  };

  const handleDeleteMarker = async (id: string) => {
    setError(null);
    setSuccess(null);

    try {
      await deleteMarker(id);
      setSuccess("Marker deleted successfully!");
      const updatedMarkers = await getMarkers();
      setMarkers(updatedMarkers);
    } catch (e) {
      setError("Failed to delete marker");
    }
  };

  const haversineDistance = (
    coords1: { latitude: number; longitude: number },
    coords2: { latitude: number; longitude: number },
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371e3; // metres
    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);
    const lat1 = toRad(coords1.latitude);
    const lat2 = toRad(coords2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const canDelete =
    userProfile?.role === "admin" || userProfile?.role === "events-admin";

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard</h2>
      <Form>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Question</Form.Label>
          <Form.Control
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter question"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Answer</Form.Label>
          <Form.Control
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter answer"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Hint</Form.Label>
          <Form.Control
            type="text"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="Enter hint"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Points</Form.Label>
          <Form.Control
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            placeholder="Enter points"
          />
        </Form.Group>
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Live Location Log</Card.Title>
            {liveLocation && (
              <Card.Text>
                Your Location: {liveLocation.latitude.toFixed(4)},{" "}
                {liveLocation.longitude.toFixed(4)}
              </Card.Text>
            )}
            <Card.Text>Status: {locationStatus}</Card.Text>
            <Button variant="info" onClick={handleCheckLocation}>
              Check Location
            </Button>
          </Card.Body>
        </Card>
        <Button variant="primary" onClick={handleAddMarker}>
          Add Marker at Current Location
        </Button>
      </Form>
      <h3 className="mt-4">Existing Markers</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Question</th>
            <th>Answer</th>
            <th>Location</th>
            <th>Points</th>
            <th>Hint</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {markers.map((marker) => (
            <tr key={marker.id}>
              <td>{marker.title}</td>
              <td>{marker.question}</td>
              <td>{marker.answer}</td>
              <td>
                {marker.location.latitude.toFixed(4)},{" "}
                {marker.location.longitude.toFixed(4)}
              </td>
              <td>{marker.points}</td>
              <td>{marker.hint}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => setEditingMarker(marker)}
                >
                  Edit
                </Button>
                {canDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleDeleteMarker(marker.id)}
                  >
                    Delete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingMarker && (
        <div className="mt-4">
          <h4>Edit Marker</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editingMarker.title}
                onChange={(e) =>
                  setEditingMarker({ ...editingMarker, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                value={editingMarker.question}
                onChange={(e) =>
                  setEditingMarker({
                    ...editingMarker,
                    question: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Answer</Form.Label>
              <Form.Control
                type="text"
                value={editingMarker.answer}
                onChange={(e) =>
                  setEditingMarker({ ...editingMarker, answer: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hint</Form.Label>
              <Form.Control
                type="text"
                value={editingMarker.hint}
                onChange={(e) =>
                  setEditingMarker({ ...editingMarker, hint: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Points</Form.Label>
              <Form.Control
                type="number"
                value={editingMarker.points}
                onChange={(e) =>
                  setEditingMarker({
                    ...editingMarker,
                    points: Number(e.target.value),
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" onClick={handleUpdateMarker}>
              Save Changes
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => setEditingMarker(null)}
            >
              Cancel
            </Button>
          </Form>
        </div>
      )}

      <Card className="mb-4">
        <Card.Header as="h4">Map of Markers</Card.Header>
        <Card.Body>
          <Map markers={markers} userLocation={liveLocation} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
