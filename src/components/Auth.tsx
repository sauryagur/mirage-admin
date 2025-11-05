// src/components/Auth.tsx
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  signInWithGoogle,
  signOut,
  checkUserRole,
} from "../services/authService";
import type { User } from "firebase/auth";
import { Button, Container, Spinner, Card } from "react-bootstrap";

interface AuthProps {
  children: (user: User) => React.ReactNode;
}

const Auth = ({ children }: AuthProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const hasRole = await checkUserRole(user);
        setIsAdmin(hasRole);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>Authentication Required</Card.Title>
            <Card.Text>
              You must be logged in to access the admin dashboard.
            </Card.Text>
            <Button variant="primary" onClick={signInWithGoogle}>
              Sign in with Google
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Title>Access Denied</Card.Title>
            <Card.Text>
              You do not have the necessary permissions to view this page.
            </Card.Text>
            <Button variant="danger" onClick={signOut}>
              Sign out
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return <>{children(user)}</>;
};

export default Auth;
