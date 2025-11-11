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



// -------------------------------------------------------------------

// 1. Podium sub-component

// -------------------------------------------------------------------

interface PodiumItemProps {

  team: Team;

  rank: number;

}

const PodiumItem = ({ team, rank }: PodiumItemProps) => {

  const positionClass = rank === 1 ? "center" : rank === 2 ? "left" : "right";

  const rankClass = `rank-${rank}`;



  const Avatar = <div className={`podium-avatar ${rankClass}-avatar`} />;



  const formattedPoints = team.points.toFixed(2);



  return (

    <div className={`podium-item ${rankClass}`}>

      <div className={`podium-line ${positionClass}`} />

      <div className="podium-box">

        {Avatar}

        <div className="podium-rank-label">

          [{rank}] {team.teamName.toLowerCase().replace(/ /g, "_")}

        </div>



        <div className="podium-data">

          <span className="coin-icon" />

          <span className="points-number">{formattedPoints}</span>

        </div>

        <div className="points-label">POINTS</div>

      </div>

    </div>

  );

};



// -------------------------------------------------------------------

// 2. Main Leaderboard component

// -------------------------------------------------------------------

const Leaderboard = () => {

  const [teams, setTeams] = useState<Team[]>([]);

  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const teamsPerPage = 15;



  // -----------------------------------------------------------------

  // Fetch & sort teams

  // -----------------------------------------------------------------

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



  // -----------------------------------------------------------------

  // Pagination logic (includes *all* teams from rank 1)

  // -----------------------------------------------------------------

  const indexOfLast = currentPage * teamsPerPage;

  const indexOfFirst = indexOfLast - teamsPerPage;

  const currentTeams = teams.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(teams.length / teamsPerPage);

  const paginate = (page: number) => setCurrentPage(page);



  // -----------------------------------------------------------------

  // Tooltip for members

  // -----------------------------------------------------------------

  const renderTooltip = (team: Team) => (

    <Tooltip id={`tooltip-${team.teamId}`} className="neubrutal-tooltip">

      <strong className="neubrutal-text">MEMBERS:</strong>

      <ul className="neubrutal-list">

        {team.members.map((m) => (

          <li key={m.userId}>{m.name}</li>

        ))}

      </ul>

    </Tooltip>

  );



  // -----------------------------------------------------------------

  // Helper – highlight the row that belongs to the logged-in user

  // -----------------------------------------------------------------

  const currentUserHandle = "sauryagur"; // <-- from the prompt, replace if you store it elsewhere

  const isCurrentUserTeam = (team: Team) =>

    team.members.some((m) => m.handle?.toLowerCase() === currentUserHandle.toLowerCase());



  return (

    <>

      {/* Font import – put this in index.html if you prefer */}

      <link

        href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"

        rel="stylesheet"

      />



      <Container className="mt-4 neubrutal-page-container">

        {/* Header */}

        <header className="leaderboard-header">

          <h1 className="neubrutal-main-title">LEADERBOARD</h1>

          <p className="neubrutal-subtitle">

            Track your team's progress and see who is dominating the competition!

          </p>

        </header>



        {error && <Alert variant="danger" className="neubrutal-alert">{error}</Alert>}



        {/* Top-3 Podium */}

        {topTeams.length >= 3 && (

          <div className="podium-wrapper">

            <div className="podium-structure">

              <PodiumItem team={topTeams[1]} rank={2} />

              <PodiumItem team={topTeams[0]} rank={1} />

              <PodiumItem team={topTeams[2]} rank={3} />

            </div>

          </div>

        )}



        {/* Table */}

        <div className="leaderboard-table-area">

          <Table className="neubrutal-table" hover responsive>

            <thead>

              <tr>

                <th className="rank-col">S. No.</th>

                <th className="player-col">Team Name</th>

                <th className="questions-col">No of Questions Answered</th>

                <th className="points-col">Points</th>

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

                        ? `neubrutal-row neubrutal-row-rank-${globalRank}`

                        : isYou

                        ? "neubrutal-row unranked-you-row"

                        : "neubrutal-row"

                    }

                  >

                    <td className="rank-col">{globalRank}</td>

                    <td className="player-col">

                      <OverlayTrigger placement="right" overlay={renderTooltip(team)}>

                        <span className="team-name-trigger">{team.teamName}</span>

                      </OverlayTrigger>

                    </td>

                    <td className="questions-col">{team.answered_questions.length}</td>

                    <td className="points-col">{team.points.toFixed(2)}</td>

                  </tr>

                );

              })}

            </tbody>

          </Table>

        </div>



        {/* Pagination */}

        <Pagination className="neubrutal-pagination justify-content-center mt-4">

          {Array.from({ length: totalPages }, (_, i) => (

            <Pagination.Item

              key={i + 1}

              active={i + 1 === currentPage}

              onClick={() => paginate(i + 1)}

              className="neubrutal-pagination-item"

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