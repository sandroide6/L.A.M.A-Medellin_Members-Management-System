import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export default function TokenViewer() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      user.getIdToken().then((t) => setToken(t));
    }
  }, []);

  return (
    <div>
      <h2>Token de Firebase:</h2>
      <textarea style={{ width: "100%", height: "150px" }} value={token} readOnly />
    </div>
  );
}
