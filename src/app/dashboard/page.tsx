'use client'

import styled from './styles.module.scss';
import { useState } from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { LateralMenu } from '@/components/LateralMenu';
import { SectionSup } from '@/components/SectionSup';
// import { SectionProg } from '@/components/SectionProg';
// import { SectionFatu } from '@/components/SectionFatu';
import { SectionComments } from '@/components/SectionComments';

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState<string>('Chat');

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  return (
    <main className={styled.main}>
      <Header />
      <section className={styled.secBody}>
        <LateralMenu selectMenu={handleMenuClick} />
        {selectedMenu === 'Chat' && <SectionComments />}
        {selectedMenu === 'Supporte' && <SectionSup />}
        {/* {selectedMenu === 'Programação' && <SectionProg />}
        {selectedMenu === 'Faturamento' && <SectionFatu />} */}
      </section>
      {/* <Footer /> */}
    </main>
  );
};

export default Dashboard;
