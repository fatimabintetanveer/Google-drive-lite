import { React, createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BACKEND_URL } from "@/secrets/urls";

const AuthContext = createContext();
export default AuthContext;
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function AuthProvider({ children }) {
  const initialToken =
    typeof window !== "undefined" ? getCookie("authToken") : null;
  let initialUser = null;

  const [loadingUser, setLoadingUser] = useState(null);

  let fetchUser = async () => {
    let response = await fetch(`${BACKEND_URL}:3001/users/${initialToken}`, {
        headers: {
            'user': initialToken
        }
    });
    initialUser = await response.json();
    setLoadingUser(initialUser);
  };

//   if (initialToken != "" && initialToken != null && initialToken != "null") {
//     fetchUser();
//   }

  const [authToken, setAuthtoken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    fetchUser();
  }, [])

  useEffect(() => {
    setUser(loadingUser)
  }, [loadingUser])

  let history = useRouter();

  let logoutUser = () => {
    setAuthtoken(null);
    document.cookie = "authToken=null";
    setUser(null);
    history.push("/cloud/login");
  };

  let loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch(`${BACKEND_URL}:3001/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: e.target.username.value,
            password: e.target.password.value,
        }),
    });
    
    let data = await response.json();

    if (response.status === 200 && data.user.username) {
      setAuthtoken(data.user.username);
      document.cookie = `authToken=${data.user.username}`;
      setUser(data.user);
      history.push("/cloud");
    } else {
      setError("Invalid Credentials Entered.");
      return "fail";
    }
  };

  let registerUser = async (e) => {
    e.preventDefault();
    let errormsg = "";
    let response = await fetch(`${BACKEND_URL}:3001/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'user': user.username
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
        admin: false,
        consumed: 0,
      }),
    });

    console.log(response.body);

    if (response.status === 200) {
      loginUser(e);
    }
    setError(errormsg);
  };

  let contextData = {
    authToken: authToken,
    error: error,
    user: user,
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  return (
    <>
      <AuthContext.Provider value={contextData}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
