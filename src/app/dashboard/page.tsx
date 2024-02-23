'use client'

import styled from './styles.module.scss';
import { useContext, useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { SectionSup } from '@/components/SectionSup';
import { SectionComments } from '@/components/SectionComments';
import { AuthContext } from '@/context/auth.context';
import { CardsContext } from '@/context/cards.context';
import { SectionProg } from '@/components/SectionProg';
import { SectionSupHosp } from '@/components/SectionSupHosp';
import { SectionFatu } from '@/components/SectionFatu';
import { SectionInst } from '@/components/SectionInst';
import { ListClient } from '@/components/ListClient';
import { ClientContext } from '@/context/client.context';
import { ModalCriaCards } from '@/components/ModalCriaCard';
import { SectionCardForUser } from '@/components/SectionCardForUser';

const Dashboard = () => {
  const { openModal, setOpenModal } = useContext(CardsContext);

  const { selectedMenu, setSelectedMenu, showCards, setShowCards, infoUser } = useContext(AuthContext);
  const { modalClient, setModalClient } = useContext(ClientContext);

  useEffect(() => {
    setShowCards(true);
  }, [infoUser]);

  const { userNamesWithCardIds, getAllCardsForUser } = useContext(CardsContext);
  
  const infoUserName = infoUser?.name || '';
  const userCountForInfoUser = userNamesWithCardIds[infoUserName] || 0;

  const handleGetAllCardsForUser = () => {
    getAllCardsForUser();
    setShowCards(true);
  }

  return (
    <main className={styled.main}>
      <div className={styled.divHeaderSec}>
        
        <Header />
        
        <div className={styled.divBtn}>
          <button className={styled.btnCriarTarefa} onClick={() => setOpenModal(true)}>Criar Tarefa</button>
          <button onClick={() => setModalClient(true)} className={styled.btnListClient}>Lista Clientes</button>
          <div className={styled.cardsContainer}>
            <p className={styled.number}>{userCountForInfoUser.length}</p>
            <button className={styled.btnCards} onClick={handleGetAllCardsForUser}>Minhas Tarefas</button>
          </div>
        </div>
        {modalClient && <ListClient/>}
        {openModal && <ModalCriaCards />}
        
        {showCards ? (
          <section className={styled.secBody}>
            <SectionCardForUser />
          </section>
        ) : (
          <section className={styled.secBody}>
            {selectedMenu === 'Suporte' && <SectionSup />}
            {selectedMenu === 'Programação' && <SectionProg />}
            {selectedMenu === 'Faturamento' && <SectionFatu />}
            {selectedMenu === 'SuporteHosp' && <SectionSupHosp />}
            {selectedMenu === 'Instalação' && <SectionInst />}
          </section>
        )}
      </div>

      <SectionComments />

    </main>
  );
};

export default Dashboard;
