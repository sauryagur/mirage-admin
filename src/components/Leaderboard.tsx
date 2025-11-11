// src/components/Leaderboard.tsx
import { useState, useEffect } from "react";
import {
  Table,
  Alert,
  Container,
  Tooltip,
  OverlayTrigger,
  Pagination,
} from "react-bootstrap";
import { getTeams } from "../services/teamService";
import type { Team } from "../types";

const Leaderboard = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 15;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const allTeams = await getTeams();
        setTeams(allTeams);
      } catch (error) {
        setError("Failed to fetch teams.");
      }
    };

    fetchTeams();
  }, []);

  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = teams.slice(indexOfFirstTeam, indexOfLastTeam);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderTooltip = (team: Team) => (
    <Tooltip id={`tooltip-${team.teamId}`}>
      <strong>Members:</strong>
      <ul>
        {team.members.map((member) => (
          <li key={member.userId}>{member.name}</li>
        ))}
      </ul>
    </Tooltip>
  );

  return (
    <Container className="mt-4">
      <h2>Leaderboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>S. No.</th>
            <th>Team Name</th>
            <th>No of Questions Answered</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {currentTeams.map((team, index) => (
            <tr key={team.teamId}>
              <td>{indexOfFirstTeam + index + 1}</td>
              <td>
                <OverlayTrigger
                  placement="right"
                  overlay={renderTooltip(team)}
                >
                  <span>{team.teamName}</span>
                </OverlayTrigger>
              </td>
              <td>{team.answered_questions.length}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {Array.from({ length: Math.ceil(teams.length / teamsPerPage) }).map(
          (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ),
        )}
      </Pagination>
    </Container>
  );
};

export default Leaderboard;
