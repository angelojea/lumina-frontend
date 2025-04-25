import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigator } from "../AppRouter";
import { AppContext } from "../contexts/AppContext";
import { User } from "../schemas/User";

let alreadyRunning = false;

export function GoogleCallback() {
  const navigate = useNavigator();
  const { signInUser } = useContext(AppContext);

  useEffect(() => {
    (async () => {
      if (alreadyRunning) return;
      alreadyRunning = true;
      const { data } = await axios.get(
        `http://localhost:4000/auth/google/callback${window.location.search}`,
        {}
      );
      const user: User = data;

      signInUser(user);

      navigate("/home");
    })();
  }, []);

  return <></>;
}
