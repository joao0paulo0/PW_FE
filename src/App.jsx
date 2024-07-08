import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import PropTypes from "prop-types"; // Import prop-types
import Login from "./views/Login";
import ForgotPassword from "./views/ForgotPassword";
import Layout from "./views/Layout";
import BookList from "./views/BookList";
import Reservations from "./views/Reservations";
import BookDetails from "./views/BookDetails";
import ReservationsHistory from "./views/ReservationsHistory";
import ChangePassword from "./views/ChangePasword";
import Users from "./views/Users";
import UserDetail from "./views/UserDetail";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.user.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/app/book-list" replace />;
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

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
        <Route
          path="/app/*"
          element={<PrivateRoute allowedRoles={["user", "admin"]} />}
        >
          <Route path="" element={<Layout />}>
            <Route path="book-list" element={<BookList />} />
            <Route path="reservations" element={<Reservations />} />
            <Route
              path="reservations-history"
              element={<ReservationsHistory />}
            />
            <Route path="book/:bookId" element={<BookDetails />} />
            <Route path="book/create-book" element={<BookDetails />} />
            <Route
              path="users"
              element={<PrivateRoute allowedRoles={["admin"]} />}
            >
              <Route path="" element={<Users />} />
              <Route path=":userId" element={<UserDetail />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
