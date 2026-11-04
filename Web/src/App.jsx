<<<<<<< HEAD

import StaffDashboard from "./pages/StaffDashboard/StaffDashboard.jsx";

function App() {
  return <StaffDashboard />;
=======
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
>>>>>>> main
}

export default App;
