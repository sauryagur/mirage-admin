// src/components/UserManagement.tsx
import { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap";
import { getUsers } from "../services/userService";
import type { UserProfile } from "../types";

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getUsers();
        const filteredUsers = allUsers.filter(
          (user) =>
            user.role === "events-admin" || user.role === "mirage-admin",
        );
        setUsers(filteredUsers);
      } catch (error) {
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="mt-4">
      <h3>User Management</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Display Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.displayName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagement;
