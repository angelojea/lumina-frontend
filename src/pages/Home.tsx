import {
  Person as ProfileIcon,
  BackupTable as ProjectsIcon,
  FormatListBulleted as TasksIcon,
} from "@mui/icons-material";
import { Grid2 as Grid, Paper, Stack, SxProps, Typography } from "@mui/material";
import { PropsWithChildren } from "react";
import { useNavigator } from "../AppRouter";

const btnStyles: SxProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const TopBtn = ({ children }: PropsWithChildren) => (
  <Paper
    elevation={6}
    sx={{
      ...btnStyles,
      "&:hover": { boxShadow: 12 },
    }}
  >
    <Stack spacing={1} p={10}>
      {children}
    </Stack>
  </Paper>
);

const BottomBtn = ({ children }: PropsWithChildren) => (
  <Paper
    variant="outlined"
    elevation={2}
    sx={{
      ...btnStyles,
      "&:hover": { boxShadow: 4 },
    }}
  >
    <Stack spacing={1} p={6} alignItems={"center"} justifyContent={"center"}>
      {children}
    </Stack>
  </Paper>
);

export function Home() {
  const navigator = useNavigator();
  return (
    <Stack spacing={3}>
      <Grid container spacing={5}>
        <Grid size={6}>
          <TopBtn>X / Y Completed</TopBtn>
        </Grid>
        <Grid size={6}>
          <TopBtn>X in the last 24h</TopBtn>
        </Grid>
      </Grid>
      <Grid container spacing={5}>
        <Grid size={4}>
          <BottomBtn>
            <TasksIcon sx={{ fontSize: 80 }} />
            <Typography>My Tasks</Typography>
          </BottomBtn>
        </Grid>
        <Grid size={4}>
          <BottomBtn>
            <ProjectsIcon sx={{ fontSize: 80 }} />
            <Typography>Projects</Typography>
          </BottomBtn>
        </Grid>
        <Grid size={4}>
          <BottomBtn>
            <ProfileIcon sx={{ fontSize: 80 }} />
            <Typography>Profile</Typography>
          </BottomBtn>
        </Grid>
      </Grid>
    </Stack>
  );
}
