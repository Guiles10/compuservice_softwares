'use client'

import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext, iUser } from "./auth.context";

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
  workers?: String[]
}
export interface iDataForm {
  title?: String,
  descriptin?: String,
  solution?: String,
  priority?: String,
  tasks?: String[],
  workers?: String[],
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

  moveCard: (item: iCardSup, idCard: string) => void
  moveCardReves: (item: iCardSup, idCard: string) => Promise<void>

  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>

  editarCard: (item: string, dataForm: iDataForm, tarefas: iTask[]) => Promise<void>
  excluirSupCard: (itemId: string) => Promise<void>

  excluirTask: (tasksId: string) => Promise<void>
}

export const SupProvider = ({ children }: iAuthProviderChildren) => {

  const { userId, token} = useContext(AuthContext);

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
        getAllCardsSup()
      } catch (error) {
        console.error(error);
      }
    };

    const moveCard = async (item: iCardSup, idCard: string) => {
      let novoStatus = ''
      if (item.status === 'A Fazer') {
        novoStatus = 'Em Andamento'
      } else if (item.status === 'Em Andamento') {
        novoStatus = 'Concluido'
      } else if (item.status === 'Concluido') {
        return
      }
      const cardAtualizado = { ...item, status: novoStatus };

        try {
          const response = await axios.patch(`http://localhost:3001/suport_card/${idCard}`, cardAtualizado, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // setAllCardsSup([...allCardsSup, response.data]);
          getAllCardsSup()
        } catch (error) {
          console.error(error)
        }
    }
    const moveCardReves = async (item: iCardSup, idCard: string) => {
      let novoStatus = ''
      if (item.status === 'Concluido') {
        novoStatus = 'Em Andamento'
      } else if (item.status === 'Em Andamento') {
        novoStatus = 'A Fazer'
      } else if (item.status === 'A Fazer') {
        return
      }
      const cardAtualizado = {... item, status: novoStatus }
        try {
          const response = await axios.patch(`http://localhost:3001/suport_card/${idCard}`, cardAtualizado, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // setAllCardsSup([...allCardsSup, response.data]);
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