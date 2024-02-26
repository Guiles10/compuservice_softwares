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
import { CriaUser } from '@/components/CriaUser';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Dashboard = () => {
  const { selectedMenu, showCards, setShowCards, infoUser, openRegisterUser, setOpenRegisterUser } = useContext(AuthContext);
  const { modalClient, setModalClient } = useContext(ClientContext);
  const { openModal, setOpenModal, userNamesWithCardIds, getAllCardsForUser } = useContext(CardsContext);

  useEffect(() => {
    setShowCards(true);
  }, [infoUser]);
  
  const infoUserName = infoUser?.name || '';
  const userCountForInfoUser = userNamesWithCardIds[infoUserName] || 0;

  const handleGetAllCardsForUser = () => {
    getAllCardsForUser();
    setShowCards(true);
  }

  return (
    <>
    <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    /><ToastContainer />
    <main className={styled.main}>
      <div className={styled.divHeaderSec}>
        
        <Header />
        
        <div className={styled.divBtn}>
          <button className={styled.btnCriarTarefa} onClick={() => setOpenModal(true)}>Criar Tarefa</button>
          <button onClick={() => setModalClient(true)} className={styled.btnListClient}>Lista Clientes</button>
         
          {infoUser?.isAdmin ? 
            <button className={styled.btnListClient} onClick={() => setOpenRegisterUser(true)}>Cadastrar Usuario</button>
          :
            null
          }
          
          <div className={styled.cardsContainer}>
            <p className={styled.number}>{userCountForInfoUser.length}</p>
            <button className={styled.btnCards} onClick={handleGetAllCardsForUser}>Minhas Tarefas</button>
          </div>
        </div>
        {modalClient && <ListClient/>}
        {openModal && <ModalCriaCards />}
        {openRegisterUser && <CriaUser />}
        
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
    </>
  );
};

export default Dashboard;
