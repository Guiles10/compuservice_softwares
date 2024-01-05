'use client'

import styled from './styles.module.scss'
import { useContext } from 'react';
import { ContextAtividade } from '@/context/context';
import { Cards } from '../Card';

export const Atividades = () => {

    const { cardsFazer, cardsAndamento, cardsConcluido, adicionarCard } = useContext(ContextAtividade);

    return (
        <section className={styled.secAtividade}>
            <div className={styled.divTarefa}>
                <h1>A Fazer</h1>
                <div>
                    {cardsFazer.map((item) => (
                        <Cards key={item.id} item={item}/>
                    ))}
                </div>
                <button onClick={() => adicionarCard()} >+</button>
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
        </section>
      );
};