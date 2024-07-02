import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GlobalStyles } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            height: "100vh",
            backgroundColor: "#f0f2f5",
            fontFamily: "Roboto, sans-serif",
          },
          "#root": {
            height: "100%",
          },
        }}
      />
      <App />
    </>
  </React.StrictMode>
);
