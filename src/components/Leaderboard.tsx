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
import "./Leaderboard.css";

/* ------------------------------------------------------------------- */
/* 1. Podium sub-component – now minimal                           */
/* ------------------------------------------------------------------- */
interface PodiumItemProps {
  team: Team;
  rank: number;
}
const PodiumItem = ({ team, rank }: PodiumItemProps) => {
  const heightPct = rank === 1 ? 100 : rank === 2 ? 75 : 50; // step heights
  const bg = rank === 1 ? "#e0e0e0" : rank === 2 ? "#f0f0f0" : "#fafafa";

  return (
    <div className="podium-item" style={{ height: `${heightPct}%` }}>
      <div className="podium-bar" style={{ backgroundColor: bg }} />
      <div className="podium-label">
        <div className="podium-rank">{rank}</div>
        <div className="podium-name">{team.teamName}</div>
        <div className="podium-points">{team.points.toFixed(2)}</div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------- */
/* 2. Main Leaderboard component                                    */
/* ------------------------------------------------------------------- */
const Leaderboard = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 15;

  /* --------------------- fetch & sort --------------------- */
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const allTeams = await getTeams();
        const sorted = allTeams.sort((a, b) => b.points - a.points);
        setTeams(sorted);
      } catch {
        setError("Failed to fetch teams.");
      }
    };
    fetchTeams();
  }, []);

  const topTeams = teams.slice(0, 3);

  /* --------------------- pagination --------------------- */
  const indexOfLast = currentPage * teamsPerPage;
  const indexOfFirst = indexOfLast - teamsPerPage;
  const currentTeams = teams.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(teams.length / teamsPerPage);
  const paginate = (page: number) => setCurrentPage(page);

  /* --------------------- tooltip --------------------- */
  const renderTooltip = (team: Team) => (
    <Tooltip id={`tooltip-${team.teamId}`} className="minimal-tooltip">
      <strong>MEMBERS:</strong>
      <ul className="member-list">
        {team.members.map((m) => (
          <li key={m.userId}>{m.name}</li>
        ))}
      </ul>
    </Tooltip>
  );

  /* --------------------- “you” row --------------------- */
  const currentUserHandle = "sauryagur";
  const isCurrentUserTeam = (team: Team) =>
    team.members.some(
      (m) => m.handle?.toLowerCase() === currentUserHandle.toLowerCase(),
    );

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
        rel="stylesheet"
      />

      <Container className="minimal-page">
        {/* Header */}
        <header className="leaderboard-header">
          <h1 className="title">LEADERBOARD</h1>
          <p className="subtitle">
            Track your team’s progress and see who is dominating the
            competition!
          </p>
        </header>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* ---------- PODIUM ---------- */}
        {topTeams.length >= 3 && (
          <div className="podium-wrapper">
            <PodiumItem team={topTeams[1]} rank={2} />
            <PodiumItem team={topTeams[0]} rank={1} />
            <PodiumItem team={topTeams[2]} rank={3} />
          </div>
        )}

        {/* ---------- TABLE ---------- */}
        <div className="table-wrapper">
          <Table hover responsive className="minimal-table">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Team Name</th>
                <th>No of Questions Answered</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {currentTeams.map((team, idx) => {
                const globalRank = indexOfFirst + idx + 1;
                const isYou = isCurrentUserTeam(team);
                return (
                  <tr
                    key={team.teamId}
                    className={
                      globalRank <= 3
                        ? `rank-${globalRank}`
                        : isYou
                          ? "you-row"
                          : ""
                    }
                  >
                    <td>{globalRank}</td>
                    <td>
                      <OverlayTrigger
                        placement="right"
                        overlay={renderTooltip(team)}
                      >
                        <span className="team-name">{team.teamName}</span>
                      </OverlayTrigger>
                    </td>
                    <td>{team.answered_questions.length}</td>
                    <td>{team.points.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* ---------- PAGINATION ---------- */}
        <Pagination className="minimal-pagination justify-content-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Container>
    </>
  );
};

export default Leaderboard;
