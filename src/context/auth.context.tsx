"use client";

import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { Api } from "../service/Api";
import Error from "next/error";


export const AuthContext = createContext({} as iProviderValue);

interface iAuthProviderChildren {
  children: React.ReactNode;
}
export interface iUser {
  email: string
  function: string[]
  id: string
  isAdmin: boolean
  name: string
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

  selectedMenu: string
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>

  showCards: boolean
  setShowCards: React.Dispatch<React.SetStateAction<boolean>>

  openRegisterUser: boolean
  setOpenRegisterUser: React.Dispatch<React.SetStateAction<boolean>>
  registerUser: (formData: any) => Promise<void>

  setUserSelect: React.Dispatch<React.SetStateAction<any>>
  userSelect: any
  selectUser: (formData: any) => Promise<void>

  openEditUser: boolean
  setOpenEditUser: React.Dispatch<React.SetStateAction<boolean>>
  editeUser: (formData: iUser, idUser: any) => Promise<void>

  excluirUser: (idUser: string) => Promise<void>

}

export const AuthProvider = ({ children }: iAuthProviderChildren) => {

  const router = useRouter();

  const [infoUser, setInfoUser] = useState<iUser | null>(null);

  const loginFunction = async (infoLogin: iInfoLogin) => {
    try {
      const response = await Api.post('/login', infoLogin);

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
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
    router.push("/");
  };

  const [allUser, setAllUser] = useState<iUser[]| null>(null);
  const userAll = async () => {
    try {
      const response = await Api.get(`/users`);
      setAllUser(response.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    userAll()
  }, [token]);


    const findUser = async (id: string) => {
      try {
        const response = await Api.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInfoUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  useEffect(() => {
    if (userId) {
      findUser(userId);
    }
  }, [token, userId]);


  const protectRoutes = (router: any, token: string) => {
    if (typeof window !== 'undefined') {
      if (!token) {
        router.push("/");
      } else {
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    }
  };
  protectRoutes(router, token)
////////////////////////////////////// MENUS //////////////////////////////////////

  const [selectedMenu, setSelectedMenu] = useState<string>('');
  const [showCards, setShowCards] = useState(false);

  const [ openRegisterUser, setOpenRegisterUser] = useState(false);

////////////////////////////////////// USUARIO //////////////////////////////////////
  const registerUser = async (formData: any) => {
    try {
      const response = await Api.post(`/users`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      userAll()
      toast.success("Usuario cadastrado!");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  const [ userSelect, setUserSelect] = useState<iUser | null>(null);
  const selectUser = async (idUser: string) => {
    try {
      const resp = await Api.get(`/users/${idUser}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserSelect(resp.data)
    } catch (error) {

    }
  }
  
  const [ openEditUser, setOpenEditUser] = useState(false);
  const editeUser = async (formData: iUser, idUser: string) => {
    try {
      const response = await Api.patch(`/users/${idUser}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      findUser(userId)
      userAll()
      toast.success("Usuario editado!");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  const excluirUser = async (idUser: string) => {
    try {
      const response = await Api.delete(`/users/${idUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      userAll()
      toast.success("Usuario excluido!");
    } catch (error) {
      toast.error("Erro ao excluir!");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        allUser,
        token,
        userId,
        loginFunction,
        logout,
        infoUser,

        selectedMenu,
        setSelectedMenu,

        showCards,
        setShowCards,

        openRegisterUser,
        setOpenRegisterUser,
        registerUser,

        setUserSelect,
        userSelect,
        selectUser,

        openEditUser,
        setOpenEditUser,
        editeUser,

        excluirUser,

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};