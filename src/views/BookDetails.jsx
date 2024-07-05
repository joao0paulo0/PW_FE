import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import axios from "../api/axios";

const BookDetails = () => {
  const { bookId } = useParams(); // Fetch the bookId parameter from the URL
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`/books/${bookId}`);
        setBook(response.data); // Assuming API returns a single book object
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (!book) {
    return <Typography variant="body1">Loading...</Typography>; // Add loading state if book details are fetching
  }

  return (
    <Card>
      <CardMedia
        component="img"
        height="300"
        image={book.image || "https://via.placeholder.com/300"} // Placeholder image if no image is available
        alt={book.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
          {book.title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Author: </strong> {book.author}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Category: </strong> {book.category}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Available Copies: </strong> {book.availableCopies}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Description: </strong> {book.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BookDetails;
