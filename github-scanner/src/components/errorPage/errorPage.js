import { Alert, Typography } from "@mui/material";
import React from "react";
import HomePage from "../homePage/homePage";

export default function ErrorPage(){
    return(
        <>
            <Alert severity="error">
                <Typography>
                    An error has occured! Entered name may be invalid, please try again
                </Typography>
            </Alert>
            <HomePage/>
        </> 
    )
}