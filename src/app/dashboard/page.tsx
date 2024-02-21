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

const Dashboard = () => {
  const { allCardsSup, openModal, setOpenModal } = useContext(CardsContext);

  const { selectedMenu, setSelectedMenu, infoUser } = useContext(AuthContext);
  const { modalClient, setModalClient } = useContext(ClientContext);

  useEffect(() => {
    if (infoUser && infoUser.function && Array.isArray(infoUser.function)) {
      const firstMatchingMenu = infoUser.function.find((menuItem: string) =>
        ['Suporte', 'Programação', 'Faturamento', 'SuporteHosp', 'Instalação'].includes(menuItem)
      );

      if (firstMatchingMenu) {
        setSelectedMenu(firstMatchingMenu);
      }
    }
  }, [infoUser]);


  return (
    <main className={styled.main}>
      <div className={styled.divHeaderSec}>
        <Header />
        
        <div className={styled.divBtn}>
          <button className={styled.btnCriarTarefa} onClick={() => setOpenModal(true)}>Criar Tarefa</button>
          <button onClick={() => setModalClient(true)} className={styled.btnListClient} >Lista Clientes</button>
        </div>
          {modalClient && <ListClient/>}

        <section className={styled.secBody}>
          {selectedMenu === 'Suporte' && <SectionSup />}
          {selectedMenu === 'Programação' && <SectionProg />}
          {selectedMenu === 'Faturamento' && <SectionFatu />}
          {selectedMenu === 'SuporteHosp' && <SectionSupHosp />}
          {selectedMenu === 'Instalação' && <SectionInst />}
        </section>
      </div>
      <SectionComments />
    </main>
  );
};

export default Dashboard;
