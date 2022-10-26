import { Box } from "@mui/system";
import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ErrorPage from "./components/errorPage/errorPage";
import HomePage from "./components/homePage/homePage";
import ResumePage from "./components/resumePage/resumePage";

function App() {
  return (
    <Box
      sx={{
        backgroundColor: "#424549",
        minHeight: "100vh",
        padding: "50px 0px",
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path=":id" element={<ResumePage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Box>
  );
}

export default App;
