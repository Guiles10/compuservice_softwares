'use client'

import styled from './styles.module.scss';
import { useContext, useState } from 'react';
import { Header } from '@/components/Header';
import { Menu } from '@/components/Menu';
import { SectionSup } from '@/components/SectionSup';
// import { SectionProg } from '@/components/SectionProg';
// import { SectionFatu } from '@/components/SectionFatu';
import { SectionComments } from '@/components/SectionComments';
import { AuthContext } from '@/context/auth.context';
import { CardsContext } from '@/context/cards.context';

const Dashboard = () => {

  const { selectedMenu } = useContext(AuthContext);
  const { setOpenModal } = useContext(CardsContext);

 
  return (
    <main className={styled.main}>
      <div className={styled.divHeaderSec}>
        <Header />
        <section className={styled.secBody}>
          {selectedMenu === 'Supporte' && <SectionSup />}
          {/* {selectedMenu === 'Programação' && <SectionProg />}
          {selectedMenu === 'Faturamento' && <SectionFatu />} */}
        </section>
      </div>
      <SectionComments />
    </main>
  );
};

export default Dashboard;
