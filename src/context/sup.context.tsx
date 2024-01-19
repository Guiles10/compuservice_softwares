'use client'

import axios from "axios";
import { parseCookies } from "nookies";
import React, { createContext, useEffect, useState } from "react";
import { iUser } from "./auth.context";

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
  userId?: string
  user: iUser
}
export interface iDataForm {
  title?: String,
  descriptin?: String,
  solution?: String,
  priority?: String,
  tasks?: String[]
}
export interface iTask{
  id: string
	task: string
	completed: boolean
	createdAt: string
	updatedAt: string
	suportCardId: string
}

interface iProviderValue {
  allCardsSup: iCardSup[]
  setAllCardsSup: React.Dispatch<React.SetStateAction<iCardSup[]>>

  creatCardSup: (dataForm: iDataForm, tarefas: string[]) => Promise<void>
  getAllCardsSup: () => Promise<void>

  moveCard: (card: iCardSup, idCard: string) => void
  moveCardReves: (card: iCardSup, idCard: string) => Promise<void>

  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>

  editarCard: (item: string, dataForm: iDataForm, tarefas: iTask[]) => Promise<void>
  excluirSupCard: (itemId: string) => Promise<void>

  excluirTask: (tasksId: string) => Promise<void>
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
    const creatCardSup = async (dataForm: iDataForm, tarefas: string[]) => {
       try {
        const responseCard = await axios.post('http://localhost:3001/suport_card', dataForm, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let createTesks: iTask[] = []
        for (const tarefa of tarefas) {
          const responseTask = await axios.post(`http://localhost:3001/tasks/${responseCard.data.id}`, { task: tarefa }, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          createTesks.push(responseTask.data)
        }
        responseCard.data.tasks = createTesks
        setAllCardsSup([...allCardsSup, responseCard.data]);
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

    const editarCard = async (itemId: string, dataForm: iDataForm, tarefas: iTask[]) => {
      try {
        const responseCard = await axios.patch(`http://localhost:3001/suport_card/${itemId}`, dataForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error(error);
      }

      let idTasks: iTask[] = [];
      let semIdTasks: iTask[] = [];
      tarefas.forEach((tarefa) => {
            if (tarefa.id) {
                idTasks.push(tarefa);
            } else {
                semIdTasks.push(tarefa);
            }
      });

      try {
        for (const tarefa of semIdTasks) {
          const responseCreateTask = await axios.post(`http://localhost:3001/tasks/${itemId}`, tarefa,{ 
            headers: { Authorization: `Bearer ${token}` } 
          });
        }
      }catch (error) {
        console.error(error);
      }

      try {
        for (const tarefa of idTasks) {
          const responseEditeTask = await axios.patch(`http://localhost:3001/tasks/${itemId}/${tarefa.id}`, tarefa,{ 
            headers: { Authorization: `Bearer ${token}` } 
          });
        }
      }catch (error) {
        console.error(error);
      }
      getAllCardsSup()
    };

    const excluirSupCard = async (itemId: string) => {
      try {
        const response = await axios.delete(`http://localhost:3001/suport_card/${itemId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getAllCardsSup()
      } catch (error) {
        console.error(error);
      }
    };

    const excluirTask = async (tasksId: string) => {
      try {
        const response = await axios.delete(`http://localhost:3001/tasks/${tasksId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getAllCardsSup()
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

        excluirTask,

      }}
    >
      {children}
    </SupContext.Provider>
  );
};