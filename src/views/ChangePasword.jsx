import { Button, Stack, TextField, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Use useParams from react-router-dom
import axios from "../api/axios";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { resetToken } = useParams(); // Extract resetToken using useParams
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!newPassword) {
      alert("Password is required");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    try {
      const response = await axios.post(`/users/reset-password/${resetToken}`, {
        newPassword,
      });
      const successMessage = response.data.message;
      alert(successMessage);
      navigate("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Invalid or expired token.") {
          alert("Invalid or expired token. Please try again.");
        } else {
          alert(errorMessage);
        }
      } else {
        console.error("Change Password failed:", error);
        alert("An error occurred. Please try again later.");
      }
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
          Change Password
        </Typography>
        <TextField
          id="password"
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ChangePassword;
