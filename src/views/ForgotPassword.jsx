import { Button, Stack, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email || !email.includes("@") || email.length < 5) {
      alert("Email is invalid");
      return;
    }
    try {
      const response = await axios.post("/users/forgot-password", {
        email,
      });
      const successMessage = response.data.message;
      alert(successMessage);
    } catch (error) {
      console.error("Forgot Password failed:", error);
      alert("An error occurred. Please try again later.");
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
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Forgot Password
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
        <Stack direction="row" spacing={2} sx={{ marginTop: 2, width: "100%" }}>
          <Button
            color="primary"
            variant="outlined"
            fullWidth
            onClick={() => navigate("/login")}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleForgotPassword}
          >
            Forgot Password
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ForgotPassword;
