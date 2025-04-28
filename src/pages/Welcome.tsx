import { Button, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import { useNavigator } from '../AppRouter';
import { AppContext } from '../contexts/AppContext';
import { useEffect } from 'react';

export function Public() {
  const navigate = useNavigator();
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  return (
    <Stack>
      <Typography variant="h6">
        This is React template for MUI and TypeScript.
      </Typography>
    </Stack>
  );
}
