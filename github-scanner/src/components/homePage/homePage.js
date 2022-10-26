import React, { useState } from "react";
import Container from "@mui/material/Container";
import { Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  function onButtonClick() {
    navigate(`/${name}`);
  }

  return (
    <Container
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      maxWidth="sm"
    >
      <Paper
        sx={{
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ alignSelf: "center" }} variant="h3">
          Github Spy
        </Typography>
        <br />
        <TextField
          value={name}
          onChange={(event) => setName(event.target.value)}
          variant="outlined"
          label="Github name"
        ></TextField>
        <br />
        <Button onClick={onButtonClick} variant="contained">
          Submit
        </Button>
      </Paper>
    </Container>
  );
}
