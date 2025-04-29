import { Button, Stack, Typography } from "@mui/material";
import { useNavigator } from "../AppRouter";

export function Root() {
  const navigate = useNavigator();

  return (
    <Stack>
      <Typography variant="h6">
        This is React template for MUI and TypeScript.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/projects")}>
        Go
      </Button>
    </Stack>
  );
}
