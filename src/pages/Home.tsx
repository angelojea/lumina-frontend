import { Button, Stack } from "@mui/material";
import { useNavigator } from "../AppRouter";

export function Home() {
  const navigator = useNavigator();
  return (
    <Stack>
      <Button variant="contained" onClick={() => navigator("/projects")}>
        See your projects
      </Button>
    </Stack>
  );
}
