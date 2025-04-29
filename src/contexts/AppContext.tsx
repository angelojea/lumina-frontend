import {
  DarkMode,
  ArrowBack as GoBackIcon,
  Home,
  LightMode,
  Logout as LogoutIcon,
  MoreHoriz as MoreIcon,
  BackupTable as ProjectsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  createTheme,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Theme,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { RouterPaths, useNavigator, useRouteMatch } from '../AppRouter';
import { User } from '../schemas/User';

type AppContextProps = {
  theme: Theme;
  title: string;
  setTitle: (t: string) => void;
  user?: AppContextUserProps;
  signInUser: (u: User) => void;
  signOutUser: () => void;
  getSignedInUser: () => User | undefined;
};

type AppContextUserProps = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

function getSignedInUser() {
  const storage = localStorage.getItem('logged-in');
  return storage
    ? (JSON.parse(localStorage.getItem('logged-in') || '{}') as User)
    : undefined;
}

export const AppContext = createContext<AppContextProps>({
  theme: {} as Theme,
  title: '',
  setTitle: (t: string) => {},
  getSignedInUser,
  signInUser: () => {},
  signOutUser: () => {},
});

export function AppProvider({ children }: PropsWithChildren) {
  const routeMatch = useRouteMatch();
  const navigator = useNavigator();

  const routeTitle = routeMatch?.title;

  const [pageTitle, setPageTitle] = useState('');
  const [dark, setDark] = useState(
    Boolean(localStorage.getItem('dark')) || false,
  );
  const [lightTheme] = useState(
    createTheme({
      cssVariables: true,
    }),
  );
  const [darkTheme] = useState(
    createTheme({
      cssVariables: true,
      palette: {
        mode: 'dark',
      },
    }),
  );
  const [user, setUser] = useState<User | undefined>(getSignedInUser());

  const [anchorAvatarEl, setAnchorAvatarEl] = useState<null | HTMLElement>();
  const avatarOpen = Boolean(anchorAvatarEl);
  const [anchorRoutesEl, setAnchorRoutesEl] = useState<null | HTMLElement>();
  const routesOpen = Boolean(anchorRoutesEl);

  const activeTheme = dark ? darkTheme : lightTheme;

  const menuItems: { title: string; icon: any; route: RouterPaths }[] = [
    { title: 'Home', icon: <Home />, route: '/home' },
    { title: 'Projects', icon: <ProjectsIcon />, route: '/projects' },
    { title: 'Tasks', icon: <ProjectsIcon />, route: '/tasks' },
  ];

  const contextProps: AppContextProps = {
    theme: activeTheme,
    title: String(pageTitle || routeTitle || ''),
    setTitle: setPageTitle,
    user,
    getSignedInUser: () => {
      const storage = localStorage.getItem('logged-in');
      return storage
        ? (JSON.parse(localStorage.getItem('logged-in') || '{}') as User)
        : undefined;
    },
    signInUser: (user) => {
      localStorage.setItem('logged-in', JSON.stringify(user));
      setUser(user);
    },
    signOutUser: () => {
      localStorage.removeItem('logged-in');
      setUser(undefined);
    },
  };

  return (
    <AppContext.Provider value={contextProps}>
      <Stack bgcolor={activeTheme.palette.background.default}>
        <Stack
          direction={'row'}
          padding={3}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Stack direction={'row'} spacing={2}>
            {routeMatch?.showBackBtn && (
              <IconButton onClick={() => navigator(-1)}>
                <GoBackIcon htmlColor={activeTheme.palette.text.primary} />
              </IconButton>
            )}
            <Typography variant="h3">
              {pageTitle || routeTitle || <>&nbsp;</>}
            </Typography>
          </Stack>

          <Stack direction={'row'} spacing={2}>
            {user && (
              <>
                <IconButton
                  onClick={(ev) => {
                    setAnchorRoutesEl(ev.currentTarget);
                  }}
                >
                  <MoreIcon htmlColor={activeTheme.palette.text.primary} />
                </IconButton>
                <Menu
                  anchorEl={anchorRoutesEl}
                  open={routesOpen}
                  onClose={() => setAnchorRoutesEl(null)}
                >
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.route}
                      onClick={() => {
                        navigator(item.route);
                        setAnchorRoutesEl(null);
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText>{item.title}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
            <IconButton
              onClick={() => {
                setDark(!dark);
                localStorage.setItem('dark', String(!dark));
              }}
            >
              {dark ? (
                <DarkMode htmlColor={activeTheme.palette.text.primary} />
              ) : (
                <LightMode />
              )}
            </IconButton>
            {user ? (
              <>
                <Button
                  onClick={(ev) => {
                    setAnchorAvatarEl(ev.currentTarget);
                  }}
                >
                  <Avatar alt={user.name} src={user?.picture} />
                </Button>
                <Menu
                  anchorEl={anchorAvatarEl}
                  open={avatarOpen}
                  onClose={() => setAnchorAvatarEl(null)}
                >
                  <MenuItem
                    onClick={() => {
                      setAnchorAvatarEl(null);
                      navigator('/profile');
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon />{' '}
                      {/* Ícone provisório, podemos trocar depois */}
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAnchorAvatarEl(null);
                      contextProps.signOutUser();
                      navigator('/');
                    }}
                  >
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText>Sign Out</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                href="http://localhost:4000/auth/google"
              >
                Sign In
              </Button>
            )}
          </Stack>
        </Stack>
        <ThemeProvider theme={activeTheme}>
          <Box width={'fit-content'} padding={3}>
            {children}
          </Box>
        </ThemeProvider>
      </Stack>
      {/* <SpeedDial
        ariaLabel="SpeedDial"
        sx={{ position: "absolute", bottom: 32, right: 32 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction icon={<Home />} title="test" />
        <SpeedDialAction icon={<Home />} />
      </SpeedDial> */}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  return ctx;
}
