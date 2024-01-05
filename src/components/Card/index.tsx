import { ContextAtividade, iCard } from '@/context/context';
import styled from './styles.module.scss'
import { useContext } from 'react';
import { ModalCards } from './ModalCard';


export const Cards = ({ item }: { item: iCard }) => {

    const { selectedCardId, editarCard, openModal, moverParaAndamento, moverParaFazer, moverParaConcluido, moverConcluidoParaAndamento } = useContext(ContextAtividade);

    const moverParaAndamentoEConcluido = (card: iCard) => {
        moverParaAndamento(card);
        moverParaConcluido(card);
      };

    const moverParaAndamentoEConcluidoReves = (card: iCard) => {
        moverParaFazer(card);
        moverConcluidoParaAndamento(card);
    };
      
    return (
        <section className={styled.sectionCard} id="header-top">
            <div  className={styled.divCard}>
                <h2 className={styled.h2Card}>{item.title}</h2>
                <p className={styled.pCard}>{item.description}</p>
                <div className={styled.divBtnCard}>
                    <button onClick={() => moverParaAndamentoEConcluidoReves(item)}>&lt;&lt;</button>
                    <button onClick={() => editarCard(item)} >Editar</button>
                    <button onClick={() => moverParaAndamentoEConcluido(item)} >&gt;&gt;</button>
                </div>
            </div>
            {item.id === selectedCardId && (
                <div>
                    {openModal && <ModalCards item={item}/>}
                </div>
            )}
        </section>
    );
};