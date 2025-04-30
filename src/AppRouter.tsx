import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { useAuthContext } from "./contexts/AuthContext";
import { GoogleCallback } from "./pages/GoogleCallback";
import { Home } from "./pages/Home";
import { ProjectDetail } from "./pages/ProjectDetail";
import { ProjectList } from "./pages/ProjectList";
import { TaskDetail } from "./pages/TaskDetail";
import { TaskList } from "./pages/TaskList";
import { Root } from "./pages/Welcome";

export type RouterPaths =
  | "/home"
  | "/projects/:id"
  | "/projects/new"
  | "/projects"
  | "/tasks"
  | "/tasks/new"
  | "/tasks/:id"
  | "/profile"
  | "/"
  | "/google/callback"
  | "/new"
  | ":id";

type AppRouterConfigMatch = {
  path: RouterPaths;
  element: any;
  public: boolean;
  title?: string;
  showBackBtn?: boolean;
  children?: AppRouterConfigMatch[];
  loader?: (...args: any[]) => any;
};

export const AppRouterConfig: { [key: string]: AppRouterConfigMatch } = {
  Home: {
    path: "/home",
    element: <Home />,
    title: "Home",
    public: false,
  },
  Root: {
    path: "/",
    element: <Root />,
    title: "Welcome!",
    public: true,
  },
  ProjectList: {
    path: "/projects",
    element: <ProjectList />,
    showBackBtn: true,
    title: "All Projects",
    public: false,
    children: [
      {
        path: ":id",
        element: <ProjectDetail />,
        showBackBtn: true,
        title: "All Projects",
        public: false,
        loader: ({ request }) =>
          fetch("/api/dashboard.json", {
            signal: request.signal,
          }),
      },
    ],
  },
  TaskDetail: {
    path: "/tasks/:id",
    element: <TaskDetail />,
    public: false,
  },
  TaskList: {
    path: "/tasks",
    element: <TaskList />,
    showBackBtn: true,
    title: "All Tasks",
    public: false,
  },
  GoogleCallback: {
    path: "/google/callback",
    element: <GoogleCallback />,
    public: true,
  },
};

export function useNavigator() {
  const navRouter = useNavigate();
  return (route: RouterPaths | -1) => {
    navRouter(route as any);
  };
}

export function useRouteMatch() {
  const location = useLocation();

  const getCurrentRouteMatch = () => {
    let found: AppRouterConfigMatch | undefined = undefined;
    const iterateConfigs = (configs: AppRouterConfigMatch[], parentsRoute: string) => {
      for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        const route = `${parentsRoute}/${config.path}`.replace("//", "/");

        const fragsPath = route.split("/");
        const fragsLocation = location.pathname.split("/");

        if (
          fragsPath.length === fragsLocation.length &&
          fragsPath.every((frag, i) => frag.startsWith(":") || fragsLocation[i] === frag)
        ) {
          found = config;
          return;
        }

        if (config.children) {
          iterateConfigs(config.children, route);
        }
      }
    };
    iterateConfigs(Object.values(AppRouterConfig), "");
    return found || AppRouterConfig.Root;
  };
  const currRoute = getCurrentRouteMatch();

  const [match, setMatch] = useState<AppRouterConfigMatch>(currRoute);
  useEffect(() => {
    setMatch(currRoute);
  }, [location]);

  return match;
}

function mapRoute(route: AppRouterConfigMatch, key: string) {
  return (
    <Route key={key} path={route.path} element={route.element} loader={route.loader}>
      {route.children && route.children.map((inner, i) => mapRoute(inner, key + i))}
    </Route>
  );
}

function RoutesMapper() {
  const { isUserSignedIn } = useAuthContext();
  const routeMatch = useRouteMatch();

  // User trying to access a forbidden route
  if (!isUserSignedIn && !routeMatch.public) {
    return (
      <Routes>
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    );
  }

  if (!isUserSignedIn && routeMatch.public) {
    return (
      <Routes>
        {Object.values(AppRouterConfig)
          .filter((x) => x.public)
          .map((route, i) => (
            <Route key={i} path={route.path} element={route.element}>
              {route.children && route.children.length > 0 ? (
                <>
                  {route.children.map((inner, j) => (
                    <Route key={j} path={inner.path} element={inner.element} />
                  ))}
                </>
              ) : (
                <></>
              )}
            </Route>
          ))}
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {Object.values(AppRouterConfig)
        .filter((x) => x.path != "/")
        .map((route, i) => mapRoute(route, String(i)))}
      <Route path="*" element={<Navigate replace to="/home" />} />
    </Routes>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppProvider>
        <RoutesMapper />
      </AppProvider>
    </BrowserRouter>
  );
}
