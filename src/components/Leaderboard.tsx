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

// A generic component to display team data on a podium step
const PodiumStep = ({
  team,
  rank,
  className,
}: {
  team: Partial<Team>;
  rank: number;
  className: string;
}) => (
  <div className={`podium-step ${className}`}>
    {team.teamId && (
      <div className="podium-content">
        <img
          src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${team.teamId}`}
          alt="Team Avatar"
          className="podium-avatar"
          height={64}
        />
        <div className="podium-rank">{rank}</div>
        <div className="podium-name">{team.teamName}</div>
        <div className="podium-points">{team.points?.toFixed(2) ?? "0.00"}</div>
      </div>
    )}
    {/* podium-bar is hidden in CSS */}
  </div>
);

// The Main Podium Component
const LeaderboardPodium = ({ teams }: { teams: Team[] }) => {
  // Assuming teams are sorted and team[0] is 1st, team[1] is 2nd, etc.
  const team1 = teams[0] || {};
  const team2 = teams[1] || {};
  const team3 = teams[2] || {};

  return (
    <div className="podium-wrapper">
      {/* Row 1: Empty | 1st Place | Empty */}
      <div className="podium-step filler top-left"></div>

      {/* 1st Place (Spans 3 rows) */}
      <PodiumStep team={team1} rank={1} className="rank-1" />

      <div className="podium-step filler top-right"></div>

      {/* Row 2/3 (Grid Area handles the 2nd and 3rd place steps spanning 2 rows) */}
      <PodiumStep team={team2} rank={2} className="rank-2" />
      {/* The middle cell for rows 2 and 3 is covered by the rank-1 component's grid-area */}
      <PodiumStep team={team3} rank={3} className="rank-3" />
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
        <LeaderboardPodium teams={topTeams} />

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

                return (
                  <tr
                    key={team.teamId}
                    className={globalRank <= 3 ? `rank-${globalRank}` : ""}
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
