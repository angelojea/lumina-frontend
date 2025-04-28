import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigator } from '../AppRouter';
import { AppContext } from '../contexts/AppContext';
import { User } from '../schemas/User';

export function GoogleCallback() {
  const navigate = useNavigator();
  const { signInUser } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:4000/auth/me', {
          withCredentials: true,
        });
        const user: User = data;

        signInUser(user);
        navigate('/home');
      } catch (error) {
        console.error('Erro ao buscar usuário', error);
        navigate('/');
      }
    })();
  }, []);

  return <></>;
}
