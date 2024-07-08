import { useEffect, useState } from "react";
import axios from "../api/axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button, CardActions } from "@mui/material";
import { jwtDecode } from "jwt-decode";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decoded = jwtDecode(token);
        const userId = decoded.user.id;

        const response = await axios.get(`/reservations/user/${userId}`);
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  const handleCancelReservation = async (reservationId) => {
    try {
      await axios.put(`/reservations/${reservationId}`, { status: "returned" });
      setReservations((prevReservations) =>
        prevReservations.filter((res) => res._id !== reservationId)
      );
      alert("Reservation Canceled");
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  const filteredReservations = reservations.filter(
    (reservation) => reservation.status === "reserved"
  );

  const calculateDaysLeft = (returnDate) => {
    const today = new Date();
    const dueDate = new Date(returnDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysLeft;
  };

  const formatReturnDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (filteredReservations.length === 0) {
    return <p>No active reservations</p>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      {filteredReservations.map((reservation) => (
        <Card key={reservation._id} sx={{ maxWidth: 345 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {reservation.bookTitle}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Status:</strong> {reservation.status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Reservation Date:</strong>{" "}
              {formatReturnDate(reservation.reservationDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Return By:</strong>{" "}
              {formatReturnDate(reservation.returnByDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Days Left:</strong>{" "}
              {calculateDaysLeft(reservation.returnByDate)}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => handleCancelReservation(reservation._id)}
            >
              Cancel
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
};

export default Reservations;
