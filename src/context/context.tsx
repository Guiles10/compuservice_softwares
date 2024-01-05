'use client'

import React, { createContext, useEffect, useState } from "react";
// import { Api } from "../services/Api";
// import { NextRouter } from "next/router";
// import { useRouter } from "next/navigation";

export const ContextAtividade = createContext({} as iProviderValue);

interface iAuthProviderChildren {
  children: React.ReactNode;
}

interface iProviderValue {
  cardsFazer: iCard[]
  setCardsFazer: React.Dispatch<React.SetStateAction<any>>
  adicionarCard: () => void

  editarCard: (item: iCard) => void
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  
  cardsAndamento: iCard[]
  setCardsAndamento: React.Dispatch<React.SetStateAction<iCard[]>>

  cardsConcluido: iCard[]
  setCardsConcluido: React.Dispatch<React.SetStateAction<iCard[]>>

  moverParaAndamento: (card: iCard) => void
  moverParaFazer: (card: iCard) => void
  moverParaConcluido: (card: iCard) => void
  moverConcluidoParaAndamento: (card: iCard) => void

  selectedCardId: number | null

  excluirCard: (item: iCard) => void
}

export interface iCard {
  id: number
  title: string,
  description: string,
}

export const ProviderAtividade = ({ children }: iAuthProviderChildren) => {

    const [cardsFazer, setCardsFazer] = useState<iCard[]>([])
    const [cardsAndamento, setCardsAndamento] = useState<iCard[]>([])
    const [cardsConcluido, setCardsConcluido] = useState<iCard[]>([])

    const adicionarCard = () => {
      const novoCard: iCard = {
        id: cardsFazer.length + 1,
        title: `TESTANDO CARD ${cardsFazer.length + 1}`,
        description: "testando a descrição"
      }
      setCardsFazer([...cardsFazer, novoCard]);
    };

    const [openModal, setOpenModal] = useState<boolean>(false)
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const editarCard = (item: iCard) => {
      setSelectedCardId(item.id);
      setOpenModal(true)
    };

    const excluirCard = (item: iCard) => {
      setCardsFazer(cardsFazer.filter(card => card.id !== item.id));
      setCardsAndamento(cardsAndamento.filter(card => card.id !== item.id));
      setCardsConcluido(cardsConcluido.filter(card => card.id !== item.id));

    };

    const moverParaAndamento = (card: iCard) => {
      if (!cardsFazer.some(c => c.id === card.id)) {
        return;
      }
      const novosCardsFazer = cardsFazer.filter(c => c.id !== card.id);
      setCardsFazer(novosCardsFazer);
      setCardsAndamento([...cardsAndamento, card]);
    };

    const moverParaFazer = (card: iCard) => {
      if (!cardsAndamento.some(c => c.id === card.id)) {
        return;
      }
      const novosCardsAndamento = cardsAndamento.filter(c => c.id !== card.id);
      setCardsAndamento(novosCardsAndamento);
      setCardsFazer([...cardsFazer, card]);
    };

    const moverParaConcluido = (card: iCard) => {
      if (!cardsAndamento.some(c => c.id === card.id)) {
        return;
      }
      const novosCardsAndamento = cardsAndamento.filter(c => c.id !== card.id);
      setCardsAndamento(novosCardsAndamento);
      setCardsConcluido([...cardsConcluido, card]);
    };

    const moverConcluidoParaAndamento = (card: iCard) => {
      if (!cardsConcluido.some(c => c.id === card.id)) {
        return;
      }
      const novosCardsConcluido = cardsConcluido.filter(c => c.id !== card.id);
      setCardsConcluido(novosCardsConcluido);
      setCardsAndamento([...cardsAndamento, card]);
    };
    

    return (
    <ContextAtividade.Provider
      value={{
        cardsFazer,
        setCardsFazer,
        adicionarCard,

        editarCard,
        openModal,
        setOpenModal,

        cardsAndamento,
        setCardsAndamento,

        cardsConcluido,
        setCardsConcluido,

        moverParaAndamento,
        moverParaFazer,
        moverParaConcluido,
        moverConcluidoParaAndamento,

        selectedCardId,

        excluirCard,
      }}
    >
      {children}
    </ContextAtividade.Provider>
  );
};