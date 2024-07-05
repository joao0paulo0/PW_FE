import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Button,
  CardActionArea,
  CardActions,
  Stack,
  TextField,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks(); // Initial fetch on component mount
  }, [page]); // Refetch books when page or limit changes

  const fetchBooks = async () => {
    try {
      const response = await axios.get("/books/", {
        params: {
          ...getSearchParams(),
          page,
        },
      });
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

  const getSearchParams = () => {
    return {
      search: searchQuery,
    };
  };

  const handleSearch = () => {
    setPage(1); // Reset page to 1 when performing a new search
    fetchBooks();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Stack padding={2} gap={4}>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        margin="normal"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        onKeyPress={(ev) => {
          if (ev.key === "Enter") {
            handleSearch();
            ev.preventDefault();
          }
        }}
      />
      <Typography paddingX={1} variant="body1">
        <strong>Limit:</strong> 10 Books
      </Typography>
      {books ? (
        <Stack
          direction="row"
          flexWrap="wrap"
          gap="16px"
          justifyContent="center"
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
                  image={`https://picsum.photos/seed/${book._id}/200`}
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
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    <strong>Author:</strong> {book.author}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
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
        </Stack>
      ) : (
        <></>
      )}
      {/* Pagination controls */}
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </Button>
        <Typography variant="body1">Page {page}</Typography>
        <Button
          disabled={books.length === 0}
          variant="outlined"
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
};

export default BookList;
