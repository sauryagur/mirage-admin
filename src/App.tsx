import AdminDashboard from "./components/AdminDashboard";
import Auth from "./components/Auth";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Auth>{() => <AdminDashboard />}</Auth>
    </div>
  );
}

export default App;
