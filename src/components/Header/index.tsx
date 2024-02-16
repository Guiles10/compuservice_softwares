import styled from './styles.module.scss'
import Logo from '../../assets/Logo Compuservice.png'
import Image from 'next/image';
import { AuthContext } from '@/context/auth.context';
import { useContext } from 'react';
import { Menu } from '../Menu';

export const Header = () => {

    const { infoUser, logout } = useContext(AuthContext);

    return (
        <header className={styled.header} id="header-top">
            <section className={styled.secHeader}>
                <figure className={styled.figureLogo}>
                    <Image src={Logo} width={140} height={80} alt="Logo Compuservice"/>
                </figure>
                <Menu />
                <div className={styled.divInfo}>
                    <div className={styled.divInfoHeader}>
                        <div>
                            <h2 className={styled.name}>{infoUser?.name}</h2>
                            <p className={styled.email}>{infoUser?.email}</p>
                        </div>
                        <button className={styled.btnSair} onClick={() => logout()}>Sair</button>
                    </div>
                        <div className={styled.divCargo}>
                            <p className={styled.cargo}>-{infoUser?.function[0]}</p>
                            <p className={styled.cargo}>-{infoUser?.function[1]}</p>
                            <p className={styled.cargo}>-{infoUser?.function[2]}</p>
                            <p className={styled.cargo}>-{infoUser?.function[3]}</p>
                            <p className={styled.cargo}>-{infoUser?.function[4]}</p>
                            <p className={styled.cargo}>-{infoUser?.function[5]}</p>
                        </div>

                </div>
            </section>
        </header>
    );
};