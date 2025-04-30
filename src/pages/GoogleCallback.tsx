import axios from "axios";
import { useEffect } from "react";
import { useNavigator } from "../AppRouter";
import { useAuthContext } from "../contexts/AuthContext";
import { User } from "../schemas/User";

let alreadyRunning = false;

export function GoogleCallback() {
  const navigate = useNavigator();
  const { signInUser } = useAuthContext();

  useEffect(() => {
    (async () => {
      if (alreadyRunning) return;
      alreadyRunning = true;
      const { data } = await axios.get(`http://localhost:4000/auth/google/callback${window.location.search}`, {
        withCredentials: true,
      });

      const user: User = data;

      signInUser(user);

      navigate("/home");
    })();
  }, []);

  return <></>;
}
