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
                    <Image src={Logo} width={200} height={120} alt="Logo Compuservice"/>
                </figure>
                <div className={styled.divInfo}>
                    <div>
                        <h2 className={styled.name}>{infoUser?.name}</h2>
                        <p className={styled.email}>{infoUser?.email}</p>
                        <p className={styled.cargo}>{infoUser?.function}</p>
                    </div>
                    <button className={styled.btnSair} onClick={() => logout()}>Sair</button>

                </div>
            </section>
        </header>
    );
};