import { Button, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigator } from "../AppRouter";
import { AppContext } from "../contexts/AppContext";

export function Public() {
  const navigate = useNavigator();
  const { user } = useContext(AppContext);

  if (user) {
    navigate("/home");
    return <></>;
  } else {
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
}
