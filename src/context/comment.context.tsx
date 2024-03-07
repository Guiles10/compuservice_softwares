'use client'

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext, iUser } from "./auth.context";
import { Api } from "@/service/Api";

export const CommentContext = createContext({} as iProviderValue);

interface iAuthProviderChildren {
  children: React.ReactNode;
}
export interface iComment {
  id?: string 
  comment: string
  title: string
  priority?: string | null
  createdAt?: string
  updatedAt?: string | null
  userId?: string
  user?: iUser
}

interface iProviderValue {
  allComments: any
  creatComment: (dataForm: iComment) => Promise<void>
  editarComment: (itemId: string, dataForm: iComment) => Promise<void>
  excluirComment: (itemId: string) => Promise<void>

  isLoadingComm: boolean
  setIsLoadingComm: React.Dispatch<React.SetStateAction<boolean>>
}

export const CommentProvider = ({ children }: iAuthProviderChildren) => {

  const { userId, token} = useContext(AuthContext);

  const [allComments, setAllComments] = useState<iComment[]>([])

    const getAllComments = async () => {
      try {
        const response = await Api.get('/comments');
        setAllComments(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    useEffect(() => {
      getAllComments()
    }, []);

    const [isLoadingComm, setIsLoadingComm] = useState<boolean>(false)
    const creatComment = async (dataForm: iComment ) => {
       try {
        const response = await Api.post(`/comments/${userId}`, dataForm, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingComm(false)
        await getAllComments()
      }
    };

    const editarComment = async (itemId: string, dataForm: iComment ) => {
      try {
        const response = await Api.patch(`/comments/${itemId}`, dataForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingComm(false)
        await getAllComments()
      }
    }

    const excluirComment = async (itemId: string) => {
      try {
        const response = await Api.delete(`/comments/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingComm(false)
        await getAllComments()
      }
    };

    return (
      <CommentContext.Provider
        value={{
          allComments,
          creatComment,
          editarComment,
          excluirComment,

          isLoadingComm,
          setIsLoadingComm,
        }}
      >
        {children}
      </CommentContext.Provider>
  );
};