import { useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  Paper,
  Link,
  CircularProgress,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false); // State for login button loading
  const [loadingRegister, setLoadingRegister] = useState(false); // State for register button loading

  const handleLogin = async () => {
    try {
      setLoadingLogin(true); // Start loading state
      const response = await axios.post("/users/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token); // Store the token in local storage
      console.log("Login successful:", response.data);
      navigate("/app/book-list");
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response.data.message);
    } finally {
      setLoadingLogin(false); // End loading state
    }
  };

  const handleRegister = async () => {
    try {
      setLoadingRegister(true); // Start loading state
      const response = await axios.post("/users/register", {
        email,
        password,
      });
      console.log("Registration successful:", response.data);
      alert(
        "Registration successful. Please check your email for verification."
      );
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.response.data.message || "Registration failed.");
    } finally {
      setLoadingRegister(false); // End loading state
    }
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
          onKeyPress={(ev) => {
            if (ev.key === "Enter") {
              handleLogin();
              ev.preventDefault();
            }
          }}
        />
        <Link alignSelf="end" href="/forgot-password">
          Forgot Password
        </Link>
        <Stack direction="row" spacing={2} sx={{ marginTop: 2, width: "100%" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            disabled={loadingLogin} // Disable button when loading
          >
            {loadingLogin ? <CircularProgress size={24} /> : "Login"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleRegister}
            disabled={loadingRegister} // Disable button when loading
          >
            {loadingRegister ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Login;
