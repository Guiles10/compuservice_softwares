'use client'
import axios from "axios";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContext, iUser } from "./auth.context";

export const CardsContext = createContext({} as iProviderValue);
interface iAuthProviderChildren {
  children: React.ReactNode;
}

export interface iCard {
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
  type?: String[]
  files: iFiles[] | []
  clients?: String[]
}
export interface iFiles {
  cardId: string
  createdAt: string
  filename: string
  id: string
  updatedAt: string
  url: string
}

export interface iDataForm {
  title?: String,
  descriptin?: String,
  solution?: String,
  priority?: String,
  tasks?: String[],
  type?: String[],
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
  allCardsFatu:iCard[]
  setAllCardsFatu: React.Dispatch<React.SetStateAction<iCard[]>>
  
  allCardsProg:iCard[]
  setAllCardsProg: React.Dispatch<React.SetStateAction<iCard[]>>

  allCardsSup: iCard[]
  setAllCardsSup: React.Dispatch<React.SetStateAction<iCard[]>>

  allCardsSupHosp:iCard[]
  setAllCardsSupHosp: React.Dispatch<React.SetStateAction<iCard[]>>

  allCardsInst: iCard[]
  setAllCardsInst: React.Dispatch<React.SetStateAction<iCard[]>>

  creatCard: (dataForm: iDataForm, tarefas: string[], file: any) => Promise<void>

  moveCard: (item: iCard, idCard: string) => void
  moveCardReves: (item: iCard, idCard: string) => Promise<void>

  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>

  editarCard: (item: string, dataForm: iDataForm, tarefas: iTask[]) => Promise<void>
  excluirCard: (infoCard: any) => Promise<void>

  excluirTask: (tasksId: string) => Promise<void>

  uploadFile: (file: any, cardId: string) => Promise<void>
  deleteFile: (nameDoc: string, cardId: string) => Promise<void>
}

export const CardsProvider = ({ children }: iAuthProviderChildren) => {

  const { userId, token} = useContext(AuthContext);

///////////////////////////////////////////////// GET TODOS OS CARDS /////////////////////////////////////////////////
  const [allCardsFatu, setAllCardsFatu] = useState<iCard[]>([])
  const [allCardsProg, setAllCardsProg] = useState<iCard[]>([])
  const [allCardsSup, setAllCardsSup] = useState<iCard[]>([])
  const [allCardsSupHosp, setAllCardsSupHosp] = useState<iCard[]>([])
  const [allCardsInst, setAllCardsInst] = useState<iCard[]>([])
  
    const getAllCards = async () => {
      try {
        const response = await axios.get('https://compuservice-bd.vercel.app/cards');
        const allCards = response.data;

        const atendimentoCards = allCards.filter((card: iCard) => card.type!.includes('Atendimento'));
        const suporteCards = allCards.filter((card: iCard) => card.type!.includes('Suporte'));
        const programacaoCards = allCards.filter((card: iCard)=> card.type!.includes('Programação'));
        const faturamentoCards = allCards.filter((card: iCard)=> card.type!.includes('Faturamento'));
        const suporteHospCards = allCards.filter((card: iCard) => card.type!.includes('Suporte Hospital'));
        const instalacaoCards = allCards.filter((card: iCard) => card.type!.includes('Instalação'));

        setAllCardsSup(suporteCards);
        setAllCardsFatu(faturamentoCards);
        setAllCardsProg(programacaoCards);
        setAllCardsSupHosp(suporteHospCards);
        setAllCardsInst(instalacaoCards);

      } catch (error) {
        console.error(error);
      }
    };
    useEffect(() => {
      getAllCards()
    }, []);

///////////////////////////////////////////////// CARDS E TAREFAS /////////////////////////////////////////////////
    const [openModal, setOpenModal] = useState<boolean>(false)
    const creatCard = async (dataForm: iDataForm, tarefas: string[], file: any) => {
      console.log(file)
       try {
        const responseCard = await axios.post('https://compuservice-bd.vercel.app/cards', dataForm, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        let createTesks: iTask[] = []
        for (const tarefa of tarefas) {
          const responseTask = await axios.post(`https://compuservice-bd.vercel.app/tasks/${responseCard.data.id}`, { task: tarefa }, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          createTesks.push(responseTask.data)
        }   

        for (const fileItem of file) {
          const formData = new FormData();
          formData.append('file', fileItem);
          try {
            const response = await axios.post(`https://compuservice-bd.vercel.app/file/${responseCard.data.id}`, 
                formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            console.log('File uploaded successfully:', response.data);
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        }

        getAllCards()
      } catch (error) {
        console.error(error);
      }
  
    };

    const editarCard = async (itemId: string, dataForm: iDataForm, tarefas: iTask[]) => {
      try {
        const responseCard = await axios.patch(`https://compuservice-bd.vercel.app/cards/${itemId}`, dataForm, {
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
          const responseCreateTask = await axios.post(`https://compuservice-bd.vercel.app/tasks/${itemId}`, tarefa,{ 
            headers: { Authorization: `Bearer ${token}` } 
          });
        }
      }catch (error) {
        console.error(error);
      }

      try {
        for (const tarefa of idTasks) {
          const responseEditeTask = await axios.patch(`https://compuservice-bd.vercel.app/tasks/${itemId}/${tarefa.id}`, tarefa,{ 
            headers: { Authorization: `Bearer ${token}` } 
          });
        }
      }catch (error) {
        console.error(error);
      }
      getAllCards()
    };

    const excluirCard = async (infoCard: any) => {

      for (const file of infoCard.files) {
        try {
          const response = await axios.delete(`https://compuservice-bd.vercel.app/file/${file.filename}`, {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error) {
          console.error(error);
        }

        try {
          const response = await axios.delete(`https://compuservice-bd.vercel.app/cards/${infoCard.id}/${file.filename}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error(error);
        }
      }

      try {
        const response = await axios.delete(`https://compuservice-bd.vercel.app/cards/${infoCard.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        getAllCards()
        alert('Card excluido com Sucesso')

      } catch (error) {
        console.error(error);
      }
    };

///////////////////////////////////////////////// MOVER CARD /////////////////////////////////////////////////
    const moveCard = async (item: iCard, idCard: string) => {
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
          const response = await axios.patch(`https://compuservice-bd.vercel.app/cards/${idCard}`, cardAtualizado, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          getAllCards()
        } catch (error) {
          console.error(error)
        }
    }
    const moveCardReves = async (item: iCard, idCard: string) => {
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
          const response = await axios.patch(`https://compuservice-bd.vercel.app/cards/${idCard}`, cardAtualizado, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          getAllCards()
        } catch (error) {
          console.error(error);
        }
    }

///////////////////////////////////////////////// TAREFAS /////////////////////////////////////////////////
    const excluirTask = async (tasksId: string) => {
      try {
        const response = await axios.delete(`https://compuservice-bd.vercel.app/tasks/${tasksId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getAllCards()
      } catch (error) {
        console.error(error);
      }
    };

///////////////////////////////////////////////// FILES /////////////////////////////////////////////////
    const uploadFile = async (file: any, cardId: string) => {
      if (!file) {
          console.error('Nenhum arquivo selecionado.');
          return;
      }
      try {
          const formData = new FormData();
          formData.append('file', file);
          const response = await axios.post(`https://compuservice-bd.vercel.app/file/${cardId}`, 
              formData, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'multipart/form-data',
                  }
              }
          );
          getAllCards()
      } catch (error) {
          console.error('Erro ao enviar arquivo:', error);
      }
    };

    const deleteFile = async (nameDoc: string, cardId: string) => {
      try {
        const response = await axios.delete(`https://compuservice-bd.vercel.app/file/${nameDoc}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await axios.delete(`https://compuservice-bd.vercel.app/cards/${cardId}/${nameDoc}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        getAllCards()
      } catch (error) {
        console.error(error);
      }

    };


    return (
    <CardsContext.Provider
      value={{
        allCardsFatu,
        setAllCardsFatu,
        
        allCardsProg,
        setAllCardsProg,

        allCardsSup,
        setAllCardsSup,

        allCardsSupHosp,
        setAllCardsSupHosp,

        allCardsInst,
        setAllCardsInst,

        creatCard,

        moveCard,
        moveCardReves,

        openModal,
        setOpenModal,

        editarCard,
        excluirCard,

        excluirTask,

        uploadFile,
        deleteFile,

      }}
    >
      {children}
    </CardsContext.Provider>
  );
};