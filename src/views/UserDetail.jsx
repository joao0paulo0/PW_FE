import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import {
  CircularProgress,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Box,
  Button,
} from "@mui/material";
import { Email } from "@mui/icons-material";

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingAlerts, setLoadingAlerts] = useState([]); // State to track loading state of each alert button

  useEffect(() => {
    fetchUserDetails();
    fetchUserReservations();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching user details");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReservations = async () => {
    try {
      const response = await axios.get(`/reservations/user/${userId}`);
      setReservations(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching reservations");
    }
  };

  const sendReturnAlert = async (reservationId, index) => {
    try {
      setLoadingAlerts((prevLoading) => [...prevLoading, index]); // Set loading state to true for the specific button
      await axios.post(`/reservations/${reservationId}/alert`);
      alert("Alert email sent successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Error sending alert");
    } finally {
      setLoadingAlerts(
        (prevLoading) => prevLoading.filter((item) => item !== index) // Set loading state to false after sending alert
      );
    }
  };

  const renderReservations = () => {
    const sortedReservations = [
      ...reservations.filter((res) => res.status === "reserved"),
      ...reservations.filter((res) => res.status !== "reserved"),
    ];

    return (
      <List>
        {sortedReservations.map((reservation, index) => (
          <Paper key={reservation._id} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={`Book: ${reservation.bookTitle}`}
                secondary={
                  <>
                    <Typography component="span">
                      Status: {reservation.status} | Reserved On:{" "}
                      {new Date(
                        reservation.reservationDate
                      ).toLocaleDateString()}
                    </Typography>
                    {reservation.returnByDate && (
                      <Typography component="span">
                        {" "}
                        | Return By:{" "}
                        {new Date(
                          reservation.returnByDate
                        ).toLocaleDateString()}
                      </Typography>
                    )}
                  </>
                }
              />
              {reservation.status === "reserved" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => sendReturnAlert(reservation._id, index)}
                  disabled={loadingAlerts.includes(index)} // Disable button if loading for this button is true
                  sx={{ gap: 2 }}
                >
                  <Email />
                  {loadingAlerts.includes(index) ? (
                    <CircularProgress size={24} /> // Show loading indicator
                  ) : (
                    "Send Return Alert"
                  )}
                </Button>
              )}
            </ListItem>
            <Divider />
          </Paper>
        ))}
      </List>
    );
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {user && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              User Details
            </Typography>
            <Typography variant="body1">
              <strong>ID:</strong> {user._id}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1">
              <strong>Role:</strong> {user.role}
            </Typography>
            <Typography variant="body1">
              <strong>Verified:</strong> {user.verified ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1">
              <strong>Blocked:</strong> {user.isBlocked ? "Yes" : "No"}
            </Typography>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Reservations
          </Typography>
          {reservations.length > 0 ? (
            renderReservations()
          ) : (
            <Typography>No reservations found.</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetail;
