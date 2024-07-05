import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
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

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
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
        <Route path="/app/*" element={<PrivateRoute />}>
          <Route path="" element={<Layout />}>
            <Route path="book-list" element={<BookList />} />
            <Route path="reservations" element={<Reservations />} />
            <Route
              path="reservations-history"
              element={<ReservationsHistory />}
            />
            <Route path="book/:bookId" element={<BookDetails />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:userId" element={<UserDetail />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
