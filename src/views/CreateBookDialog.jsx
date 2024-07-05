import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import axios from "../api/axios";

const CreateBookDialog = ({ open, onClose, onCreate }) => {
  const [newBookData, setNewBookData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    totalCopies: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/books/", {
        ...newBookData,
        availableCopies: newBookData.totalCopies,
      });
      onCreate(); // Notify parent component that book was created successfully
      onClose(); // Close dialog
    } catch (error) {
      alert("Failed to create book: " + error.message);
    }
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Create New Book</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            label="Title"
            name="title"
            value={newBookData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Author"
            name="author"
            value={newBookData.author}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Category"
            name="category"
            value={newBookData.category}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={newBookData.description}
            onChange={handleChange}
            multiline
            fullWidth
            required
          />
          <TextField
            label="Total Copies"
            name="totalCopies"
            type="number"
            value={newBookData.totalCopies}
            onChange={handleChange}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CreateBookDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateBookDialog;
