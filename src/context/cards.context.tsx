'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext, iUser } from "./auth.context";
import { Api } from "@/service/Api";
import { toast } from "react-toastify";

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
  worker?: String[]
}
export interface iFiles {
  cardId: string
  createdAt: string
  fileName: string
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

  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>

  creatCard: (dataForm: iDataForm, tarefas: string[], file: any) => Promise<void>
  editarCard: (item: string, dataForm: iDataForm, tarefas: iTask[]) => Promise<void>
  excluirCard: (infoCard: any) => Promise<void>

  setIsLoadingMove: React.Dispatch<React.SetStateAction<boolean>>
  isLoadingMove: boolean
  moveCard: (item: iCard, idCard: string) => void
  moveCardReves: (item: iCard, idCard: string) => Promise<void>

  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>

  excluirTask: (tasksId: string) => Promise<void>

  uploadFile: (file: any, cardId: string) => Promise<void>
  deleteFile: (nameDoc: string, cardId: string) => Promise<void>

  userNamesWithCardIds: any
  getAllCardsForUser: () => Promise<void>

  allCardsForUser: iCard[]
}

export const CardsProvider = ({ children }: iAuthProviderChildren) => {

  const { userId, token} = useContext(AuthContext);

///////////////////////////////////////////////// GET TODOS OS CARDS /////////////////////////////////////////////////
  const [allCards, setAllCards] = useState<iCard[]>([])

  const [allCardsFatu, setAllCardsFatu] = useState<iCard[]>([])
  const [allCardsProg, setAllCardsProg] = useState<iCard[]>([])
  const [allCardsSup, setAllCardsSup] = useState<iCard[]>([])
  const [allCardsSupHosp, setAllCardsSupHosp] = useState<iCard[]>([])
  const [allCardsInst, setAllCardsInst] = useState<iCard[]>([])
  
    const getAllCards = async () => {
      try {
        const response = await Api.get('/cards');
        const allCards = response.data;

        const atendimentoCards = allCards.filter((card: iCard) => card.type!.includes('Atendimento'));
        const suporteCards = allCards.filter((card: iCard) => card.type!.includes('Suporte'));
        const programacaoCards = allCards.filter((card: iCard)=> card.type!.includes('Programação'));
        const faturamentoCards = allCards.filter((card: iCard)=> card.type!.includes('Faturamento'));
        const suporteHospCards = allCards.filter((card: iCard) => card.type!.includes('Suporte Hospital'));
        const instalacaoCards = allCards.filter((card: iCard) => card.type!.includes('Instalação'));
        
        setAllCards(allCards);

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

///////////////////////////////////////////////// NOTIFICAÇÂO USUARIO /////////////////////////////////////////////////
  const { infoUser } = useContext(AuthContext);

  const userNamesWithCardIds: {[key: string]: string[]} = {};
  const notifiesWork = async () => {
    const worksArrays: any= allCards.map(card => card.worker || [])
    const allUserNames = worksArrays.flat();

    allUserNames.forEach((userName: any) => {
      userNamesWithCardIds[userName] = [];
      allCards.forEach(card => {
        if (card.worker && card.worker.includes(userName)) {
           userNamesWithCardIds[userName].push(card.id);
        }
      });
    });
  };
  
  notifiesWork()

  const infoUserName = infoUser?.name || '';
  const userCountForInfoUser: any = userNamesWithCardIds[infoUserName];

  const [allCardsForUser, setAllCardsForUser] = useState<iCard[]>([])
  const getAllCardsForUser = async () => {
    try {
      let allCards = [];
      for (const IdCardForUser of userCountForInfoUser) {
        const response = await Api.get(`/cards/${IdCardForUser}`);
        allCards.push(response.data);
      }
      setAllCardsForUser(allCards);
    } catch (error) {
        console.error(error);
    }
  };
  useEffect(() => {
    getAllCardsForUser()
  }, []);

///////////////////////////////////////////////// CARDS E TAREFAS /////////////////////////////////////////////////
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const creatCard = async (dataForm: iDataForm, tarefas: string[], file: any) => {
       try {
        const responseCard = await Api.post('/cards', dataForm, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let createTesks: iTask[] = []
        for (const tarefa of tarefas) {
          const responseTask = await Api.post(`/tasks/${responseCard.data.id}`, { task: tarefa }, {
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
            const response = await Api.post(`/file/${responseCard.data.id}`, 
                formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        }

        getAllCards()
        getAllCardsForUser()
        setIsLoading(false);
        setOpenModal(false);

        toast.success("Tarefa criada com sucesso!");
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };

    const editarCard = async (itemId: string, dataForm: iDataForm, tarefas: iTask[]) => {
      try {
        let idTasks: iTask[] = [];
        let semIdTasks: iTask[] = [];
        tarefas.forEach((tarefa) => {
              if (tarefa.id) { idTasks.push(tarefa);
              } else { semIdTasks.push(tarefa)}
        });
        for (const tarefa of semIdTasks) {
          const responseCreateTask = await Api.post(`/tasks/${itemId}`, tarefa,{ 
            headers: { Authorization: `Bearer ${token}` } 
          });
        }
        for (const tarefa of idTasks) {
          const responseEditeTask = await Api.patch(`/tasks/${itemId}/${tarefa.id}`, tarefa,{ 
            headers: { Authorization: `Bearer ${token}` } 
          });
        }
      } catch (error: any) {
        toast.error(error.response.data.message);
      }

      try {
        const responseCard = await Api.patch(`/cards/${itemId}`, dataForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Tarefa editada com sucesso!");
      } catch (error: any) {
        toast.error(error.response.data.message);
      }

      await getAllCardsForUser()
      await getAllCards()
    };

    const excluirCard = async (infoCard: any) => {
      for (const file of infoCard.files) {
        try {
          const response = await Api.delete(`/file/${file.fileName}`, {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error) {
          console.error(error);
        }

        try {
          const response = await Api.delete(`/cards/${infoCard.id}/${file.fileName}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

        } catch (error) {
          console.error(error);
        }
      }

      try {
        const response = await Api.delete(`/cards/${infoCard.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getAllCards()
        getAllCardsForUser()

        toast.success("Tarefa Excluida!");
      } catch (error) {
        console.error(error);
      }
    };

///////////////////////////////////////////////// MOVER CARD /////////////////////////////////////////////////
    const [isLoadingMove, setIsLoadingMove] = useState<boolean>(false);
    const moveCard = async (item: iCard, idCard: string) => {
      setIsLoadingMove(true)
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
          const response = await Api.patch(`/cards/${idCard}`, cardAtualizado, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          getAllCards()
          getAllCardsForUser()
        } catch (error: any) {
          toast.error(error.response.data.message);
        } finally {
          setIsLoadingMove(false);
        }
    }
    const moveCardReves = async (item: iCard, idCard: string) => {
      setIsLoadingMove(true)
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
          const response = await Api.patch(`/cards/${idCard}`, cardAtualizado, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          getAllCards()
          getAllCardsForUser()
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingMove(false);
        }
    }

///////////////////////////////////////////////// TAREFAS /////////////////////////////////////////////////
    const excluirTask = async (tasksId: string) => {
      try {
        const response = await Api.delete(`/tasks/${tasksId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getAllCards()
        getAllCardsForUser()
      } catch (error) {
        console.error(error);
      }
    };

///////////////////////////////////////////////// FILES /////////////////////////////////////////////////
    const uploadFile = async (file: any, cardId: string) => {
      if (!file) {
          toast.error('Nenhum arquivo selecionado');
          return;
      }
      try {
          const formData = new FormData();
          formData.append('file', file);
          const response = await Api.post(`/file/${cardId}`, 
              formData, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'multipart/form-data',
                  }
              }
          );
          getAllCards()
          getAllCardsForUser()
          setIsLoading(false)
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
    };

    const deleteFile = async (nameDoc: string, cardId: string) => {
      try {
        const response = await Api.delete(`/file/${nameDoc}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error(error);
      }

      try {
        const response = await Api.delete(`/cards/${cardId}/${nameDoc}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        getAllCards()
        getAllCardsForUser()
        setIsLoading(false)
      } catch (error: any) {
        toast.error(error.response.data.message);
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

        isLoading,
        setIsLoading,

        creatCard,
        editarCard,
        excluirCard,

        setIsLoadingMove,
        isLoadingMove,
        moveCard,
        moveCardReves,

        openModal,
        setOpenModal,

        excluirTask,

        uploadFile,
        deleteFile,

        userNamesWithCardIds,
        getAllCardsForUser,

        allCardsForUser,
      }}
    >
      {children}
    </CardsContext.Provider>
  );
};