import { observable } from 'mobx';
import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { GoogleCallback } from './pages/GoogleCallback';
import { Home } from './pages/Home';
import { ProjectDetail } from './pages/ProjectDetail';
import { ProjectList } from './pages/ProjectList';
import { Public } from './pages/Welcome';
import { TaskList } from './pages/TaskList';

export type RouterPaths =
  | '/home'
  | '/projects/:id'
  | '/projects'
  | '/'
  | '/google/callback'
  | '/tasks'
  | '/tasks/:id';

type AppRouterConfigMatch = {
  path: RouterPaths;
  element: any;
  title?: string;
  showBackBtn?: boolean;
};

export const AppRouterConfig: { [key: string]: AppRouterConfigMatch } = {
  Home: {
    path: '/home',
    element: <Home />,
    title: 'Home',
  },
  ProjectDetail: {
    path: '/projects/:id',
    element: <ProjectDetail />,
  },
  ProjectList: {
    path: '/projects',
    element: <ProjectList />,
    showBackBtn: true,
    title: 'All Projects',
  },
  Public: {
    path: '/',
    element: <Public />,
    title: 'Welcome!',
  },
  GoogleCallback: {
    path: '/google/callback',
    element: <GoogleCallback />,
  },
  TaskList: {
    path: '/tasks',
    element: <TaskList />,
    showBackBtn: true,
    title: 'All Tasks',
  },
};

export function useNavigator() {
  const navRouter = useNavigate();
  LocationObservable.showBackBtn = !LocationObservable.showBackBtn;
  return (route: RouterPaths | -1) => {
    navRouter(route as any);
  };
}

export function useRouteMatch() {
  const location = useLocation();
  const [match, setMatch] = useState<AppRouterConfigMatch | undefined>(
    Object.values(AppRouterConfig).find((x) => x.path === location.pathname),
  );
  useEffect(() => {
    setMatch(
      Object.values(AppRouterConfig).find((x) => x.path === location.pathname),
    );
  }, [location]);

  return match;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {Object.values(AppRouterConfig).map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
              action={() => {
                console.log('testtt');

                return true;
              }}
            />
          ))}
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
export const LocationObservable = observable({
  showBackBtn: false,
});
