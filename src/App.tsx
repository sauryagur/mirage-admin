import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import Auth from "./components/Auth";
import Leaderboard from "./components/Leaderboard";
import Logs from "./components/Logs";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Auth>{() => <AdminDashboard />}</Auth>} />
          <Route
            path="/leaderboard"
            element={<Auth>{() => <Leaderboard />}</Auth>}
          />
          <Route path="/logs" element={<Auth>{() => <Logs />}</Auth>} />
          <Route
            path="*"
            element={
              <Container>
                <h1>don't try to play the fool with me nigesh</h1>
              </Container>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
