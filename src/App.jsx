import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./views/Login";
import ForgotPassword from "./views/ForgotPassword";
import ChangePassword from "./views/ChangePasword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/change-password/:resetToken"
          element={<ChangePassword />}
        />
      </Routes>
    </Router>
  );
}

export default App;
