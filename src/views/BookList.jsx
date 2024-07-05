import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  TextField,
  Typography,
  TablePagination,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import CreateBookDialog from "./CreateBookDialog"; // Import the dialog component
import { Add } from "@mui/icons-material";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false); // State for dialog
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.user.role === "admin");
    }
  }, [token]);

  useEffect(() => {
    fetchBooks();
  }, [page, rowsPerPage, searchQuery]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("/books/", {
        params: {
          ...getSearchParams(),
          page: page + 1,
          limit: rowsPerPage,
        },
      });
      setBooks(response.data.books);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleBookClick = (bookId) => {
    navigate(`/app/book/${bookId}`);
  };

  const handleBooking = async (bookId) => {
    try {
      await axios.post("/reservations/create", {
        userId: getUserIdFromToken(),
        bookId,
      });
      alert("Booked successfully");
      fetchBooks();
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error booking book:", error);
    }
  };

  const handleCreateNewBook = () => {
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCreateBook = () => {
    fetchBooks(); // Refresh book list after creation
  };

  const getSearchParams = () => {
    return {
      search: searchQuery,
    };
  };

  const getUserIdFromToken = () => {
    const decoded = jwtDecode(token);
    return decoded.user.id;
  };

  const handleSearch = () => {
    setPage(0);
    fetchBooks();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack padding={2} gap={4}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
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
        {isAdmin && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNewBook}
            startIcon={<Add />}
          >
            Book
          </Button>
        )}
      </Stack>
      {books.length > 0 ? (
        <Stack direction="row" flexWrap="wrap" gap="16px">
          {books.map((book) => (
            <Card
              key={book._id}
              sx={{
                maxWidth: 345,
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
                  <Typography gutterBottom variant="h5" component="div">
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
              {!isAdmin && (
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
              )}
            </Card>
          ))}
        </Stack>
      ) : (
        <Typography variant="body1">No books found</Typography>
      )}
      <TablePagination
        component="div"
        count={totalItems}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <CreateBookDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        onCreate={handleCreateBook} // Pass handleCreateBook function to dialog
      />
    </Stack>
  );
};

export default BookList;
