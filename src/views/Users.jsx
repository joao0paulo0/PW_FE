import { useState, useEffect } from "react";
import axios from "../api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { green, red } from "@mui/material/colors";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching users");
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      await axios.put(`/users/${userId}/block`, { isBlocked: !isBlocked });
      fetchUsers(); // Refetch users after blocking/unblocking
    } catch (error) {
      setError(error.response?.data?.message || "Error updating user status");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Verified</TableCell>
            <TableCell>Blocked</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user._id}
              hover
              onClick={() => navigate(`/app/users/${user._id}`)}
              style={{ cursor: "pointer" }}
            >
              <TableCell>{user._id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell
                style={{ color: user.verified ? green[500] : red[500] }}
              >
                {user.verified ? "Yes" : "No"}
              </TableCell>
              <TableCell style={{ color: user.isBlocked ? red[500] : "#000" }}>
                {user.isBlocked ? "Yes" : "No"}
              </TableCell>
              <TableCell>
                <IconButton
                  color={user.isBlocked ? "success" : "error"}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent row click event
                    handleBlockUser(user._id, user.isBlocked);
                  }}
                >
                  {user.isBlocked ? <CheckCircleIcon /> : <BlockIcon />}
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Users;
