import { AuthContext } from '@/context/auth.context';
import styled from './styles.module.scss'
import { useContext } from 'react';

export const Menu = () => {

  const { setSelectedMenu, setShowCards} = useContext(AuthContext);
  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
    setShowCards(false);
  };

  return (
    <section className={styled.lateralMenuMain}>
      <p className={styled.pMenu} onClick={() => handleMenuClick('Suporte')}>Suporte</p>
      <p className={styled.pMenu} onClick={() => handleMenuClick('Programação')}>Programação</p>
      <p className={styled.pMenu} onClick={() => handleMenuClick('Faturamento')}>Faturamento</p>
      <p className={styled.pMenu} onClick={() => handleMenuClick('SuporteHosp')}>Suporte Hospital</p>
      <p className={styled.pMenu} onClick={() => handleMenuClick('Instalação')}>Instalação</p>
    </section>
  );
};
