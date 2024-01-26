'use client'

import axios from "axios";
import { parseCookies } from "nookies";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext, iUser } from "./auth.context";

export const CommentContext = createContext({} as iProviderValue);
interface iAuthProviderChildren {
  children: React.ReactNode;
}

export interface iComment {
  id?: string 
  comment: string
  priority?: string | null
  createdAt?: string
  updatedAt?: string | null
  userId?: string
  user?: iUser
}

interface iProviderValue {
  allCommentsSup: any
  creatComment: (dataForm: iComment) => Promise<void>
  editarComment: (itemId: string, dataForm: iComment) => Promise<void>
  excluirComment: (itemId: string) => Promise<void>
}

export const CommentProvider = ({ children }: iAuthProviderChildren) => {

  const { userId, token} = useContext(AuthContext);

  const [allCommentsSup, setAllCommentsSup] = useState<iComment[]>([])

    const getAllComments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/comments');
        setAllCommentsSup(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    useEffect(() => {
      getAllComments()
    }, []);

    const creatComment = async (dataForm: iComment ) => {
       try {
        const response = await axios.post(`http://localhost:3001/comments/${userId}`, dataForm, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getAllComments()
      } catch (error) {
        console.error(error);
      }
    };

    const editarComment = async (itemId: string, dataForm: iComment ) => {
      try {
        const response = await axios.patch(`http://localhost:3001/comments/${itemId}`, dataForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error(error);
      }
      getAllComments()
    }

    const excluirComment = async (itemId: string) => {
      try {
        const response = await axios.delete(`http://localhost:3001/comments/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getAllComments()
      } catch (error) {
        console.error(error);
      }
    };


    return (
      <CommentContext.Provider
        value={{
          allCommentsSup,
          creatComment,
          editarComment,
          excluirComment,
        }}
      >
        {children}
      </CommentContext.Provider>
  );
};