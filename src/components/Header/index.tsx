import styled from './styles.module.scss'
import Logo from '../../assets/Logo Compuservice.png'
import Image from 'next/image';
import { AuthContext } from '@/context/auth.context';
import { useContext } from 'react';

export const Header = () => {

    const { infoUser, logout } = useContext(AuthContext);

    return (
        <header className={styled.header} id="header-top">
            <section className={styled.secHeader}>
                <figure className={styled.figureLogo}>
                    <Image src={Logo} width={180} height={100} alt="Logo Compuservice"/>
                </figure>
                <button onClick={() => logout()}>Sair</button>
                <div className={styled.divInfo}>
                    <h2 className={styled.name}>{infoUser?.name}</h2>
                    <p className={styled.cargo}>{infoUser?.function}</p>
                    <p className={styled.email}>{infoUser?.email}</p>
                </div>
            </section>
        </header>
    );
};