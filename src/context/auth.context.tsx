"use client";

import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { NextRouter } from "next/router";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import axios from "axios";

export const AuthContext = createContext({} as iProviderValue);

interface iAuthProviderChildren {
  children: React.ReactNode;
}
export interface iUser {
  email: string
  function: string
  id: string
  isAdmin: boolean
  name: string
}
interface iInfoUserToken {
  user: iUser;
  token: string;
}
export interface iInfoLogin {
  email: string;
  password: string;
}

interface iProviderValue {
  allUser: iUser[] | null
  token: string;
  userId: string;
  loginFunction(infoLogin: iInfoLogin): Promise<void>;
  logout: () => void
  infoUser: iUser | null
  protectRoutes: () => void
}

export const AuthProvider = ({ children}: iAuthProviderChildren & { router: NextRouter }) => {
  const router = useRouter();

  const [infoUser, setInfoUser] = useState<iUser | null>(null);

  const loginFunction = async (infoLogin: iInfoLogin) => {
    try {
      const response = await axios.post('http://localhost:3001/login', infoLogin);

      setCookie(null, "@token", response.data.token, {
        maxAge: 60 * 610,
        path: "/",
      });
  
      setCookie(null, "@id", response.data.user.id, {
        maxAge: 60 * 610,
        path: "/",
      });
      
      setInfoUser(response.data.user)
      toast.success("Login realizado com Sucesso!");
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("E-mail ou senha incorreto!");
    }
  }

  const cookies = parseCookies();
  const token = cookies['@token'];
  const userId = cookies['@id'];

  const logout = () => {
    destroyCookie(null, '@token');
    destroyCookie(null, '@id');

    router.push("/");
    window.location.reload();
  };

  const [allUser, setAllUser] = useState<iUser[]| null>(null);
  const userAll = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/`);
      setAllUser(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    userAll()
  }, [token]);


  useEffect(() => {
    const findUser = async (id: string) => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInfoUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    if (userId) {
      findUser(userId);
    }
  }, [token]);


  const protectRoutes = () => {
    if (!token) {
      router.push("/");
    } else {
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  };
    protectRoutes()

  return (
    <AuthContext.Provider
      value={{
        allUser,
        token,
        userId,
        loginFunction,
        logout,
        infoUser,
        protectRoutes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};