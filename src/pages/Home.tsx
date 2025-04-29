import { Box, Grid2 as Grid, Paper, Stack } from "@mui/material";
import { PropsWithChildren } from "react";
import { useNavigator } from "../AppRouter";

const TopBtn = ({ children }: PropsWithChildren) => (
  <Paper
    elevation={4}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box p={10}>{children}</Box>
  </Paper>
);

const BottomBtn = ({ children }: PropsWithChildren) => (
  <Paper
    variant="outlined"
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box p={10}>{children}</Box>
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
          <BottomBtn>Birl</BottomBtn>
        </Grid>
        <Grid size={4}>
          <BottomBtn>Birl</BottomBtn>
        </Grid>
        <Grid size={4}>
          <BottomBtn>Birl</BottomBtn>
        </Grid>
      </Grid>
    </Stack>
  );
}
