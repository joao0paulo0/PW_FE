import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, TextField, Stack } from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const BookDetails = () => {
  const { bookId } = useParams(); // Fetch the bookId parameter from the URL
  const [book, setBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.user.role === "admin");
    }
  }, [token]);
  // Define fetchBookDetails function
  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`/books/${bookId}`);
      setBook(response.data); // Assuming API returns a single book object
      setEditedBook({
        title: response.data.title,
        author: response.data.author,
        category: response.data.category,
        description: response.data.description,
        totalCopies: response.data.totalCopies,
        availableCopies: response.data.availableCopies,
      });
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };

  useEffect(() => {
    fetchBookDetails(); // Initial fetch on component mount
  }, [bookId]); // Refetch book details when bookId changes

  const handleEdit = async () => {
    try {
      await axios.put(`/books/${bookId}`, editedBook);
      setIsEditing(false);
      fetchBookDetails(); // Refresh book details after edit
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error editing book:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`/books/${bookId}`);
        navigate("/app/book-list"); // Redirect to home page or book list after deletion
      } catch (error) {
        alert(error.response.data.message);
        console.error("Error deleting book:", error);
      }
    }
  };

  const handleChange = (e) => {
    setEditedBook({
      ...editedBook,
      [e.target.name]: e.target.value,
    });
  };

  if (!book) {
    return <Typography variant="body1">Loading...</Typography>; // Add loading state if book details are fetching
  }

  return (
    <Card>
      <CardMedia
        component="img"
        height="300"
        image={`https://picsum.photos/seed/${book._id}/200`} // Placeholder image if no image is available
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
          <strong>Category: </strong>{" "}
          {isEditing ? (
            <TextField
              name="category"
              value={editedBook.category}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          ) : (
            book.category
          )}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Total Copies: </strong>
          {isEditing ? (
            <TextField
              name="totalCopies"
              value={editedBook.totalCopies}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          ) : (
            book.totalCopies
          )}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Available Copies: </strong> {book.availableCopies}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <strong>Description: </strong>{" "}
          {isEditing ? (
            <TextField
              name="description"
              value={editedBook.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              margin="normal"
            />
          ) : (
            book.description
          )}
        </Typography>
        {isAdmin && (
          <Stack direction="row" spacing={2} marginTop={2}>
            {!isEditing ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                >
                  Save
                </Button>
                <Button variant="contained" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default BookDetails;
