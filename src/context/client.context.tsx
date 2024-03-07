'use client'

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./auth.context";
import { Api } from "@/service/Api";
import { toast } from "react-toastify";

export const ClientContext = createContext({} as iProviderValue);
interface iAuthProviderChildren {
  children: React.ReactNode;
}

export interface iClient {
  id: string 
  codigo: string
  companyName: string
  socialName: string
  cnpj: string
  businessPhone: string | null
  businessEmail: string | null
  comment?: string | null
  cep?: string | null
  state?: string | null
  street?: string | null
  city?: string | null
  neighborhood: string | null
  number?: string | null
  responsibles: iResponsible[] | []
}
export interface iResponsible{
  id?: string
  name?: string
  function?: string | null
  email?: string | null
  phone?: string | null
  clientId?: string | null
}

export interface iDataForm {
  codigo:         string;
  companyName:    string;
  socialName:    string;
  cnpj:           string;
  businessPhone:  string;
  businessEmail:  string;
  comment?:        string | null;
  cep?:            string | null;
  state?:          string | null;
  city?:           string | null;
  street?:         string | null;
  neighborhood?:   string | null;
  number?:         string | null;
  responsibles?:   iResponsible[];
}

interface iProviderValue {
  allClient: iClient[]
  setAllClient: React.Dispatch<React.SetStateAction<iClient[]>>

  setIsLoadingCriaClient: React.Dispatch<React.SetStateAction<boolean>>
  isLoadingCriaClient: boolean

  modalClient: boolean
  setModalClient: React.Dispatch<React.SetStateAction<boolean>>

  modalCriaClient: boolean
  setModalCriaClient: React.Dispatch<React.SetStateAction<boolean>>

  creatClient: (dataForm: iDataForm, responsibles: iResponsible[]) => Promise<void>
  editarClient: (clientId: string, dataForm: iClient, newRespFrom: iResponsible[], respClint: iResponsible[]) => Promise<void>
  excluirClient: (clientId: string) => Promise<void>

  excluirRespnsible: (respnsibleId: string) => Promise<void>
}

export const ClientProvider = ({ children }: iAuthProviderChildren) => {
  const { userId, token} = useContext(AuthContext);

  const [modalClient, setModalClient] = useState<boolean>(false)

  const [allClient, setAllClient] = useState<iClient[]>([])

    const getAllClient = async () => {
      try {
        const response = await Api.get('/client', {
          headers: { Authorization: `Bearer ${token}`}
        })
        setAllClient(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    useEffect(() => {
      getAllClient()
    }, [token, userId ]);

    const [modalCriaClient, setModalCriaClient] = useState<boolean>(false)
    const [isLoadingCriaClient, setIsLoadingCriaClient] = useState<boolean>(false)
    const creatClient = async (dataForm: iDataForm, responsibles: iResponsible[]) => {
       try {
        const responseClinet = await Api.post('/client', dataForm, {
            headers: { Authorization: `Bearer ${token}`},
          }
        );

        let createResp: iResponsible[] = []
        for (const responsible of responsibles) {
          try {
            const responseResp = await Api.post(`/responsible/${responseClinet.data.id}`, responsible, {
                headers: { Authorization: `Bearer ${token}`},
              }
            );
            createResp.push(responseResp.data);
          } catch (error: any) {
            toast.error(error.response.data.message);
          }
        }
        await getAllClient()
        toast.success("Cliente cadastrado!");
        setModalCriaClient(false);
        setIsLoadingCriaClient(false)
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };

    const editarClient = async (clientId: string, dataForm: iClient, newRespFrom: iResponsible[], respClint:iResponsible[]) => {
      try {
        const responseClient = await Api.patch(`/client/${clientId}`, dataForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error(error);
      }
      let createResp: iResponsible[] = []
      for (const responsible of newRespFrom) {
        try {
          const responseResp = await Api.post(`/responsible/${clientId}`, responsible, {
              headers: { Authorization: `Bearer ${token}`},
            }
          );
          createResp.push(responseResp.data);
        } catch (error) {
          toast.error("Erro ao criar responsável!");
        }
      }
      let editResp: iResponsible[] = []
      for (const responsible of respClint) {
        try {
          const responseResp = await Api.patch(`/responsible/${clientId}/${responsible.id}`, responsible, {
              headers: { Authorization: `Bearer ${token}`},
            }
          );
          editResp.push(responseResp.data);
        } catch (error) {
          toast.error("Erro ao editar responsável!");
        }
      }
      toast.success("Cliente editado!");
      await getAllClient()
      setIsLoadingCriaClient(false)
    };

    const excluirClient = async (clientId: string) => {
      setIsLoadingCriaClient(true)
      try {
        const response = await Api.delete(`/client/${clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await getAllClient()
        toast.success("Cliente excluido!");
        setIsLoadingCriaClient(false)
      } catch (error) {
        console.error(error);
      }
    };

    const excluirRespnsible = async (respnsibleId: string) => {
      setIsLoadingCriaClient(true)
      try {
        const response = await Api.delete(`/responsible/${respnsibleId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await getAllClient()
        setIsLoadingCriaClient(false)
      } catch (error) {
        console.error(error);
      }
    };

    return (
    <ClientContext.Provider
      value={{
        allClient,
        setAllClient,
      
        setIsLoadingCriaClient,
        isLoadingCriaClient,

        modalCriaClient,
        setModalCriaClient,

        modalClient,
        setModalClient,
      
        creatClient,
        editarClient,
        excluirClient,
      
        excluirRespnsible,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};