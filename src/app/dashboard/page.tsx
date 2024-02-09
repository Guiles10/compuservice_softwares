'use client'

import styled from './styles.module.scss';
import { useContext } from 'react';
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

  const { selectedMenu } = useContext(AuthContext);
  const { setOpenModal } = useContext(CardsContext);
  const { modalClient, setModalClient } = useContext(ClientContext);
 
  return (
    <main className={styled.main}>
      <div className={styled.divHeaderSec}>
        <Header />
      <button onClick={() => setModalClient(true)} className={styled.btnListClient} >Lista Clientes</button>
      {modalClient && <ListClient/>}

        <section className={styled.secBody}>
          {selectedMenu === 'Suporte' && <SectionSup />}
          {selectedMenu === 'Programação' && <SectionProg />}
          {selectedMenu === 'Faturamento' && <SectionFatu />}
          {selectedMenu === 'SupporteHosp' && <SectionSupHosp />}
          {selectedMenu === 'Instalação' && <SectionInst />}
        </section>
      </div>
      <SectionComments />
    </main>
  );
};

export default Dashboard;
