'use client'

import styled from './styles.module.scss'
import { useContext } from 'react';
import { SupContext } from '@/context/sup.context';
import { Cards } from '../Card';

export const SectionProg = () => {

    const { cardsFazer, cardsAndamento, cardsConcluido, adicionarCard } = useContext(SupContext);

    return (
        <section className={styled.secSup}>
            <h1 className={styled.h1Title} >PROGRAMAÇÃO</h1>
            <div className={styled.divSup}>
                <div className={styled.divTarefa}>
                    <h1>A Fazer</h1>
                    <div>
                        {cardsFazer.map((item) => (
                            <Cards key={item.id} item={item}/>
                        ))}
                    </div>
                    <button className={styled.btnCriar} onClick={() => adicionarCard()} >Criar Card</button>
                </div>
                <div className={styled.divTarefa}>
                <h1>Em Andamento</h1>
                <div>
                        {cardsAndamento.map((item) => (
                            <Cards key={item.id} item={item}/>
                        ))}
                    </div>
                </div>
                <div className={styled.divTarefa}>
                <h1>Concluído</h1>
                <div>
                        {cardsConcluido.map((item) => (
                            <Cards key={item.id} item={item}/>
                        ))}
                    </div>
                </div>
            </div>
        </section>
      );
};