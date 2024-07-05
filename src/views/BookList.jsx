import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks(); // Initial fetch on component mount
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("/books/");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/app/book/${bookId}`);
  };

  const handleBooking = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const decoded = jwtDecode(token);
      const userId = decoded.user.id;

      const response = await axios.post("/reservations/create", {
        userId,
        bookId,
      });

      alert("Booked successfully");
      console.log("Booking successful:", response.data);

      // Call fetchBooks again to update the book list after booking
      fetchBooks();
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error booking book:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "center",
      }}
    >
      {books.map((book) => (
        <Card
          key={book._id}
          sx={{
            maxWidth: 345,
            // Apply grayscale effect and pointer-events none if availableCopies === 0
            filter: book.availableCopies === 0 ? "grayscale(100%)" : "none",
            pointerEvents: book.availableCopies === 0 ? "none" : "auto",
          }}
        >
          <CardActionArea
            onClick={() => handleBookClick(book._id)}
            disabled={book.availableCopies === 0}
          >
            <CardMedia
              component="img"
              height="200"
              width="auto"
              image={
                book.image ||
                "https://edit.org/images/cat/book-covers-big-2019101610.jpg"
              }
              alt={book.title}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ color: "text.primary" }}
              >
                {book.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Author:</strong> {book.author}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Category:</strong> {book.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Copies:</strong> {book.availableCopies}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => handleBooking(book._id)}
              disabled={book.availableCopies === 0}
            >
              Book
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
};

export default BookList;
