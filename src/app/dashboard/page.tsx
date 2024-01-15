'use client'
import styled from './styles.module.scss';
import { useContext, useEffect, useState } from 'react';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { LateralMenu } from '@/components/LateralMenu';
import { SectionSup } from '@/components/SectionSup';
import { SectionProg } from '@/components/SectionProg';
import { SectionFatu } from '@/components/SectionFatu';
import { AuthContext } from '@/context/auth.context';



const Dashboard = () => {

  const { } = useContext(AuthContext);

  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuClick = (menu: any) => {
    setSelectedMenu(menu);
  };


  return (
    <main className={styled.main}>
      <Header />
      <section className={styled.secBody}>
        <LateralMenu selectMenu={handleMenuClick} />
        {selectedMenu === 'Supporte' && <SectionSup />}
        {selectedMenu === 'Programação' && <SectionProg />}
        {selectedMenu === 'Faturamento' && <SectionFatu />}
      </section>
      {/* <Footer /> */}
    </main>
  );
};

export default Dashboard;
