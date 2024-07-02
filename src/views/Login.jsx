import { useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("/users/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token); // Store the token in local storage
      console.log("Login successful:", response.data);
      // Redirect or perform any post-login actions here
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(error.response.data.message);
      setOpen(true);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post("/users/register", {
        email,
        password,
      });
      console.log("Registration successful:", response.data);
      setSuccessMessage(
        "Registration successful. Please check your email for verification."
      );
      setOpen(true);
      // Optionally, you can redirect or show a success message
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage(error.response.data.message || "Registration failed.");
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Stack
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100%",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          PW Library
        </Typography>
        <TextField
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Stack direction="row" spacing={2} sx={{ marginTop: 2, width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleRegister}
          >
            Register
          </Button>
        </Stack>
      </Paper>

      {/* Snackbar for displaying success or error message */}
      <Snackbar
        open={open}
        autoHideDuration={6000} // Adjust as needed
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={successMessage ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default Login;
