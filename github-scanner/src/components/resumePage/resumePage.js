import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useMemo, useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import useFetch from "../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";

export default function ResumePage() {
  //const [langsDataArr, setLangsDataArr] = useState([]);
  const [langsPercentMap, setLangsPercentMap] = useState(new Map());
  /*const [totalLangsUsageAmountMap, setTotalLangsUsageAmountMap] = useState(
    new Map()
  );*/

  const { id } = useParams();
  const [userData, userDataError, userDataLoading] = useFetch(
    `https://api.github.com/users/${id}`,
    { username: id }
  );
  const [userReposData, userReposDataError, userReposDataLoading] = useFetch(
    `https://api.github.com/users/${id}/repos`,
    { username: id }
  );
  const navigate = useNavigate();

  const sortedReposArr = useMemo(() => {
    if (userReposDataLoading || userReposDataError) {
      return [];
    }
    let sortedList = userReposData;
    sortedList.sort((firstDate, secondDate) => {
      for (let i = 0; i < firstDate.created_at.length; i++) {
        if (firstDate.created_at[i] === secondDate.created_at[i]) {
          continue;
        }
        return secondDate.created_at[i] - firstDate.created_at[i];
      }
    });
    return sortedList;
  }, [userReposData]);

  useEffect(() => {
    let langsArr = [];
    let promiseArr = [];
    let langsPercMap = new Map();
    let totalLangsMap = new Map();
    let total = 0;

    if (userReposData && userReposData.length > 0) {
      userReposData.forEach((element) => {
        promiseArr.push(
          fetch(element.languages_url)
            .then((result) => result.json())
            .then((result) => {
              for (let [key, val] of Object.entries(result)) {
                langsArr.push([key, val]);
              }
            })
            .catch((error) => {
              throw error;
            })
        );
      });
      Promise.all(promiseArr).then(() => {
        langsArr.forEach(([key, val]) => {
          total += val;
          if (totalLangsMap.has(key)) {
            const langValue = val + totalLangsMap.get(key);
            totalLangsMap.set(key, langValue);
          } else {
            totalLangsMap.set(key, val);
          }
        });
        for (let [key] of totalLangsMap) {
          const langValue = ((totalLangsMap.get(key) / total) * 100).toFixed(2);
          langsPercMap.set(key, langValue);
        }
        4;
        //setTotalLangsUsageAmountMap(totalLangsMap);
        setLangsPercentMap(langsPercMap);
        //setLangsDataArr(langsArr);
      });
    }
  }, [userReposData]);

  if (userDataError || userDataLoading) {
    if (userDataLoading) {
      return <p>Loading!</p>;
    } else if (userDataError) {
      navigate("/error");
    }
  } else {
    return (
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        maxWidth="md"
      >
        <Paper
          sx={{
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            "& > :not(style) + :not(style)": {
              marginTop: "30px",
            },
          }}
        >
          <Typography sx={{ alignSelf: "center" }} variant="h2">
            {userData.name}
          </Typography>
          <Typography variant="h5">
            Member since: {userData.created_at.slice(0, 10)}
          </Typography>
          <Typography variant="h5">
            Number of active repositories: {userData.public_repos}
          </Typography>
          <Divider />
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Used languages</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {langsPercentMap ? (
                  Array.from(langsPercentMap, ([key, val]) => {
                    var randomColor = Math.floor(
                      Math.random() * 16777215
                    ).toString(16);
                    return (
                      <Grid key={key} item md={3} xs={6}>
                        <Paper
                          sx={{
                            padding: "5px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            backgroundColor: "#CAC7D1",
                          }}
                        >
                          <FiberManualRecordIcon
                            sx={{
                              color: "#" + randomColor,
                            }}
                          />
                          <Typography>
                            {key}:{val}%
                          </Typography>
                        </Paper>
                      </Grid>
                    );
                  })
                ) : (
                  <Typography>Loading!</Typography>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
          {
            <Stack spacing={2}>
              {sortedReposArr.slice(0, 10).map((elem) => {
                return (
                  <Paper
                    key={elem.node_id}
                    sx={{
                      padding: "15px",
                      "& > :not(style) + :not(style)": {
                        marginTop: "10px",
                      },
                    }}
                  >
                    <Typography variant="h5">
                      Project name: {elem.name}
                    </Typography>
                    <Typography>
                      Created at: {elem.created_at.slice(0, 10)}
                    </Typography>
                    <Button href={elem.html_url} variant="contained">
                      Link to the project
                    </Button>
                  </Paper>
                );
              })}
            </Stack>
          }
        </Paper>
      </Container>
    );
  }
}
