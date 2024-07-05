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
  TablePagination,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0); // Change initial page to 0 for zero-indexing
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set default rows per page
  const [totalItems, setTotalItems] = useState(0); // State to store total number of items
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks(); // Initial fetch on component mount
  }, [page, rowsPerPage, searchQuery]); // Refetch books when page, rowsPerPage or searchQuery changes

  const fetchBooks = async () => {
    try {
      const response = await axios.get("/books/", {
        params: {
          ...getSearchParams(),
          page: page + 1, // Adjust page number for server pagination
          limit: rowsPerPage, // Add limit for server pagination
        },
      });
      setBooks(response.data.books); // Set books array from the response
      setTotalItems(response.data.totalItems); // Set totalItems from the response
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
    setPage(0); // Reset page to 0 when performing a new search
    fetchBooks();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when changing rows per page
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
      {books.length > 0 ? (
        <Stack
          direction="row"
          flexWrap="wrap"
          gap="16px"
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
        <Typography variant="body1">No books found</Typography>
      )}
      {/* Pagination using TablePagination */}
      <TablePagination
        component="div"
        count={totalItems} // Use totalItems for the count
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Stack>
  );
};

export default BookList;
