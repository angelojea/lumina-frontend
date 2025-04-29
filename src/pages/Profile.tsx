import { Button, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import axios from 'axios';

export function Profile() {
  const { user, signInUser } = useAppContext();
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPicture(user.picture || '');
    }
  }, [user]);

  async function handleSave() {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');

    try {
      const response = await axios.patch(
        'http://localhost:4000/auth/me',
        { name, picture },
        { withCredentials: true },
      );

      alert('Perfil atualizado com sucesso!');
      signInUser(response.data);
    } catch (error) {
      console.error('Erro ao atualizar perfil', error);
      alert('Erro ao atualizar perfil');
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Profile</Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!error}
        helperText={error}
        fullWidth
      />

      <TextField
        label="Picture URL"
        value={picture}
        onChange={(e) => setPicture(e.target.value)}
        fullWidth
      />

      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </Stack>
  );
}
