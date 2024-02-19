import { AuthContext } from '@/context/auth.context';
import styled from './styles.module.scss'
import { useContext } from 'react';

export const Menu = () => {

  const { setSelectedMenu } = useContext(AuthContext);

    return (
      <section className={styled.lateralMenuMain}>
        <p className={styled.pMenu} onClick={() => setSelectedMenu('Suporte')}>Suporte</p>
        <p className={styled.pMenu} onClick={() => setSelectedMenu('Programação')}>Programação</p>
        <p className={styled.pMenu} onClick={() => setSelectedMenu('Faturamento')}>Faturamento</p>
        <p className={styled.pMenu} onClick={() => setSelectedMenu('SuporteHosp')}>Suporte Hospital</p>
        <p className={styled.pMenu} onClick={() => setSelectedMenu('Instalação')}>Instalação</p>
      </section>
    );
  };