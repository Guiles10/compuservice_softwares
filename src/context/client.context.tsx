'use client'
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext, iUser } from "./auth.context";

export const ClientContext = createContext({} as iProviderValue);
interface iAuthProviderChildren {
  children: React.ReactNode;
}

export interface iClient {
  id: string 
  codigo: string
  companyName: string
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
        const response = await axios.get('https://compuservice-bd.vercel.app/client', {
          headers: { Authorization: `Bearer ${token}`}
        })
        setAllClient(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    useEffect(() => {
      getAllClient()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, userId ]);

    const [modalCriaClient, setModalCriaClient] = useState<boolean>(false)
    const creatClient = async (dataForm: iDataForm, responsibles: iResponsible[]) => {
       try {
        const responseClinet = await axios.post('https://compuservice-bd.vercel.app/client', dataForm, {
            headers: { Authorization: `Bearer ${token}`},
          }
        );

        let createResp: iResponsible[] = []
        for (const responsible of responsibles) {
          try {
            const responseResp = await axios.post(`https://compuservice-bd.vercel.app/responsible/${responseClinet.data.id}`, responsible, {
                headers: { Authorization: `Bearer ${token}`},
              }
            );
            createResp.push(responseResp.data);
          } catch (error) {
            console.error("Erro ao criar responsável:");
          }
        }
        getAllClient()
      } catch (error) {
        console.error(error);
      }
    };


    const editarClient = async (clientId: string, dataForm: iClient, newRespFrom: iResponsible[], respClint:iResponsible[]) => {
      try {
        const responseClient = await axios.patch(`https://compuservice-bd.vercel.app/client/${clientId}`, dataForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error(error);
      }
      let createResp: iResponsible[] = []
      for (const responsible of newRespFrom) {
        try {
          const responseResp = await axios.post(`https://compuservice-bd.vercel.app/responsible/${clientId}`, responsible, {
              headers: { Authorization: `Bearer ${token}`},
            }
          );
          createResp.push(responseResp.data);
        } catch (error) {
          console.error("Erro ao criar responsável:");
        }
      }
      let editResp: iResponsible[] = []
      for (const responsible of respClint) {
        try {
          const responseResp = await axios.patch(`https://compuservice-bd.vercel.app/responsible/${clientId}/${responsible.id}`, responsible, {
              headers: { Authorization: `Bearer ${token}`},
            }
          );
          editResp.push(responseResp.data);
        } catch (error) {
          console.error("Erro ao criar responsável:");
        }
      }
      getAllClient()
    };

  
    const excluirClient = async (clientId: string) => {
      try {
        const response = await axios.delete(`https://compuservice-bd.vercel.app/client/${clientId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getAllClient()
      } catch (error) {
        console.error(error);
      }
    };


    const excluirRespnsible = async (respnsibleId: string) => {
      try {
        const response = await axios.delete(`https://compuservice-bd.vercel.app/responsible/${respnsibleId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        getAllClient()
      } catch (error) {
        console.error(error);
      }
    };

    return (
    <ClientContext.Provider
      value={{
        allClient,
        setAllClient,
      
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