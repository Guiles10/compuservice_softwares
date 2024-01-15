'use client'

import axios from "axios";
import { parseCookies } from "nookies";
import React, { createContext, useEffect, useState } from "react";
// import { NextRouter } from "next/router";
// import { useRouter } from "next/navigation";

export const SupContext = createContext({} as iProviderValue);
interface iAuthProviderChildren {
  children: React.ReactNode;
}

export interface iCardSup {
  id: string 
  title: string
  description?: string | null
  tasks: string[] | null
  solution?: string | null
  status?: string
  priority?: string | null
  createdAt?: string
  updatedAt?: string | null
  user_id?: string

}
export interface iDataForm {
  title?: String,
  descriptin?: String,
  solution?: String,
  priority?: String,
  tasks?: String[]
}

interface iProviderValue {
  allCardsSup: iCardSup[]
  setAllCardsSup: React.Dispatch<React.SetStateAction<iCardSup[]>>

  creatCardSup: (dataForm: iDataForm) => void
  getAllCardsSup: () => Promise<void>

  moveCard: (card: iCardSup, idCard: string) => void
  moveCardReves: (card: iCardSup, idCard: string) => Promise<void>

  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>

  editarCard: (card: iCardSup, dataForm: any) => Promise<void>
  excluirSupCard: (itemId: string) => Promise<void>

}

export const SupProvider = ({ children }: iAuthProviderChildren) => {

  const cookies = parseCookies();
  const token = cookies['@token'];
  const userId = cookies['@id'];

  const [allCardsSup, setAllCardsSup] = useState<iCardSup[]>([])

    const getAllCardsSup = async () => {
      try {
        const response = await axios.get('http://localhost:3001/suport_card');
        setAllCardsSup(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    useEffect(() => {
      getAllCardsSup()
    }, []);
    
    const [openModal, setOpenModal] = useState<boolean>(false)
    const creatCardSup = async (dataForm: iDataForm) => {
      try {
        const response = await axios.post('http://localhost:3001/suport_card', dataForm, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllCardsSup([...allCardsSup, response.data]);
      } catch (error) {
        console.error(error);
      }
    };

    const moveCard = async (card: iCardSup, idCard: string) => {
      let novoStatus = ''
      if (card.status === 'A Fazer') {
        novoStatus = 'Em Andamento'
      } else if (card.status === 'Em Andamento') {
        novoStatus = 'Concluido'
      } else if (card.status === 'Concluido') {
        return
      }
      const cardAtualizado = { ...card, status: novoStatus }
        try {
          const response = await axios.patch(`http://localhost:3001/suport_card/${idCard}`, cardAtualizado, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAllCardsSup([...allCardsSup, response.data]);
          getAllCardsSup()
        } catch (error) {
          console.error(error)
        }
    }
    const moveCardReves = async (card: iCardSup, idCard: string) => {
      let novoStatus = ''
      if (card.status === 'Concluido') {
        novoStatus = 'Em Andamento'
      } else if (card.status === 'Em Andamento') {
        novoStatus = 'A Fazer'
      } else if (card.status === 'A Fazer') {
        return
      }
      const cardAtualizado = { ...card, status: novoStatus };
        try {
          const response = await axios.patch(`http://localhost:3001/suport_card/${idCard}`, cardAtualizado, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAllCardsSup([...allCardsSup, response.data]);
          getAllCardsSup()
        } catch (error) {
          console.error(error);
        }
    }


    const editarCard = async (item: iCardSup, dataForm: iDataForm) => {
      console.log(item)
      console.log(dataForm)
      try {
        const response = await axios.patch(`http://localhost:3001/suport_card/${item.id}`, dataForm, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAllCardsSup([...allCardsSup, response.data]);
        getAllCardsSup()
      } catch (error) {
        console.error(error);
      }
    };





    const excluirSupCard = async (itemId: string) => {
      try {
        const response = await axios.delete(`http://localhost:3001/suport_card/${itemId}`);
        console.log(response)
      } catch (error) {
        console.error(error);
      }
    };

    return (
    <SupContext.Provider
      value={{
        allCardsSup,
        setAllCardsSup,

        creatCardSup,
        getAllCardsSup,

        moveCard,
        moveCardReves,

        openModal,
        setOpenModal,

        editarCard,
        excluirSupCard,

      }}
    >
      {children}
    </SupContext.Provider>
  );
};