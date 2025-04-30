import {
  DarkMode as DarkModeIcon,
  ArrowBack as GoBackIcon,
  Home as HomeIcon,
  LightMode as LightModeIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as ProfileIcon,
  BackupTable as ProjectsIcon,
  FormatListBulleted as TasksIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  createTheme,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  SxProps,
  Theme,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { RouterPaths, useNavigator, useRouteMatch } from "../AppRouter";
import { useAuthContext } from "./AuthContext";

const menuItemBtnStyles: SxProps = { borderRadius: "50%", width: "64px", height: "64px" };

type ThemeContextProps = {
  theme: Theme;
  title: string;
  setTitle: (t: string) => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
  theme: {} as Theme,
  title: "",
  setTitle: (t: string) => {},
});

export function AppProvider({ children }: PropsWithChildren) {
  const navigator = useNavigator();
  const routeMatch = useRouteMatch();
  const routeTitle = routeMatch?.title;
  const { user, signOutUser } = useAuthContext();

  const [pageTitle, setPageTitle] = useState("");

  const [dark, setDark] = useState(Boolean(localStorage.getItem("dark")) || false);
  const [lightTheme] = useState(
    createTheme({
      cssVariables: true,
    })
  );
  const [darkTheme] = useState(
    createTheme({
      cssVariables: true,
      palette: {
        mode: "dark",
      },
    })
  );

  const [anchorAvatarEl, setAnchorAvatarEl] = useState<null | HTMLElement>();
  const avatarOpen = Boolean(anchorAvatarEl);
  const [anchorRoutesEl, setAnchorRoutesEl] = useState<null | HTMLElement>();
  const routesOpen = Boolean(anchorRoutesEl);

  const activeTheme = dark ? darkTheme : lightTheme;

  const menuItems: { title: string; icon: any; route: RouterPaths; variant?: "text" | "outlined" | "contained" }[] = [
    {
      title: "Home",
      icon: <HomeIcon />,
      route: "/home",
      variant: "outlined",
    },
    {
      title: "Tasks",
      icon: <TasksIcon />,
      route: "/tasks",
      variant: "outlined",
    },
    {
      title: "Projects",
      icon: <ProjectsIcon />,
      route: "/projects",
      variant: "outlined",
    },
    {
      title: "Profile",
      icon: <ProfileIcon />,
      route: "/profile",
      variant: "outlined",
    },
  ];

  const contextProps: ThemeContextProps = {
    theme: activeTheme,
    title: String(pageTitle || routeTitle || ""),
    setTitle: setPageTitle,
  };

  return (
    <ThemeContext.Provider value={contextProps}>
      <ThemeProvider theme={activeTheme}>
        <Stack bgcolor={activeTheme.palette.background.default}>
          <Stack direction={"row"} padding={3} justifyContent={"space-between"} alignItems={"center"}>
            <Stack direction={"row"} spacing={2}>
              {routeMatch?.showBackBtn && (
                <IconButton onClick={() => navigator(-1)}>
                  <GoBackIcon htmlColor={activeTheme.palette.text.primary} />
                </IconButton>
              )}
              <Typography variant="h3">{pageTitle || routeTitle || <>&nbsp;</>}</Typography>
            </Stack>

            <Stack direction={"row"} spacing={1}>
              {user && (
                <>
                  <Button
                    onClick={(ev) => {
                      setAnchorRoutesEl(ev.currentTarget);
                    }}
                  >
                    <MenuIcon />
                  </Button>
                  <Menu anchorEl={anchorRoutesEl} open={routesOpen} onClose={() => setAnchorRoutesEl(null)}>
                    {menuItems.map((item) => (
                      <MenuItem
                        onClick={() => {
                          setAnchorRoutesEl(null);
                          navigator(item.route);
                        }}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText>{item.title}</ListItemText>
                      </MenuItem>
                    ))}
                    <MenuItem onClick={() => setAnchorRoutesEl(null)}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText>Sign Out</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              )}
              <Paper sx={{ borderRadius: "50%" }} elevation={4}>
                <Tooltip title={dark ? "Dark" : "Light"}>
                  <Button
                    sx={menuItemBtnStyles}
                    onClick={() => {
                      setDark(!dark);
                      localStorage.setItem("dark", String(!dark));
                    }}
                    variant="contained"
                  >
                    {dark ? <DarkModeIcon /> : <LightModeIcon />}
                  </Button>
                </Tooltip>
              </Paper>

              {user ? (
                <>
                  <Paper sx={{ borderRadius: "50%" }} elevation={4}>
                    <Button
                      sx={{ height: 64, width: 64, borderRadius: "50%", padding: 0 }}
                      onClick={(ev) => {
                        setAnchorAvatarEl(ev.currentTarget);
                      }}
                    >
                      <Avatar alt={user.name} src={user?.picture} sx={{ height: 64, width: 64 }} />
                    </Button>
                    <Menu anchorEl={anchorAvatarEl} open={avatarOpen} onClose={() => setAnchorAvatarEl(null)}>
                      <MenuItem
                        onClick={() => {
                          setAnchorAvatarEl(null);
                          signOutUser();
                          window.location.reload();
                        }}
                      >
                        <ListItemIcon>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText>Sign Out</ListItemText>
                      </MenuItem>
                    </Menu>
                  </Paper>
                </>
              ) : (
                <Button variant="outlined" href="http://localhost:4000/auth/google">
                  Sign In
                </Button>
              )}
            </Stack>
          </Stack>
          <Container maxWidth="lg">{children}</Container>
        </Stack>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  return ctx;
}
