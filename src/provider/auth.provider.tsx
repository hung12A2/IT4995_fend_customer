"use client";
import { createContext, use, useContext, useEffect, useReducer } from "react";

import axios from "../module/AxiosCustom/custome_Axios";

const initialState = {
  isAuthenticated: false,
  user: {},
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setUser": {
      return {
        ...state,
        user: action.payload,
      };
    }
    case "setIsAuthenticated": {
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    }
  }
};

export const AuthContext = createContext<any>({});

export const useAuthContext = () => {
  return useContext<any>(AuthContext);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializer = () => {
    return {};
  };

  const [state, dispatch] = useReducer(reducer, initialState, initializer);

  const login = (user: any) => {
    dispatch({ type: "setUser", payload: user });
    dispatch({ type: "setIsAuthenticated", payload: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "setUser", payload: {} });
    dispatch({ type: "setIsAuthenticated", payload: false });
  };

  useEffect(() => {
    async function fetchData() {
      let token: any = ''
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }
      token = JSON.parse(token);
      token = token?.token;
      if (token) {
        const dataUser = await axios
          .get("whoAmI")
          .then((res) => res)
          .catch((e) => console.log(e));
        login(dataUser);
      } else {
        return {
          isAuthenticated: false,
          user: {},
        };
      }
    }

    fetchData();
  }, []);

  const value = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
