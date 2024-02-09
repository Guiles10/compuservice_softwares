import React, { useContext, useState } from 'react';
import styled from './styles.module.scss';
import { CardsContext } from '@/context/cards.context';
import { iUser } from '@/context/auth.context';
import { ModalCriaCards } from '../ModalCriaCard';
import { FatuCards } from './FatuCard';

interface iPropity {
  'Muito Urgente': number;
  'Urgente': number;
  'Normal': number;
  'Basica': number;
}
interface iCardPropity {
  id: string;
  title: string;
  description?: string | null;
  tasks: string[] | null;
  clientes: string[] | null;
  solution?: string | null;
  status?: string;
  priority: keyof iPropity;
  createdAt?: string;
  updatedAt?: string | null;
  user_id?: string;
  user: iUser;
}

export const SectionFatu = () => {

  const { allCardsFatu, openModal, setOpenModal } = useContext(CardsContext);

  const [filter, setFilter] = useState({
    date: '',
    creator: '',
    title: '',
  });

  const sortByPriority = (cards: iCardPropity[]) => {
    const priorityOrder: iPropity = {
      'Muito Urgente': 1,
      'Urgente': 2,
      'Normal': 3,
      'Basica': 4,
    };
    return cards.sort(
      (a: iCardPropity, b: iCardPropity) =>
        priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  };
  const filterCards = (cards: iCardPropity[]) => {
    return cards.filter(
      (item) =>
        item.createdAt?.includes(filter.date) &&
        item.user?.name?.toLowerCase().includes(filter.creator.toLowerCase()) &&
        item.title?.toLowerCase().includes(filter.title.toLowerCase())
    );
  };


  const cardsAfa: any = allCardsFatu.filter((item) => item.status === 'A Fazer');
  const cardsEa: any = allCardsFatu.filter((item) => item.status === 'Em Andamento');
  const cardsConcluido: any = allCardsFatu.filter((item) => item.status === 'Concluido');

  const sortedAfa = sortByPriority(filterCards(cardsAfa));
  const sortedEa = sortByPriority(filterCards(cardsEa));
  const sortedConcluido = sortByPriority(filterCards(cardsConcluido));

  return (
    <section className={styled.secSup}>

      <div className={styled.divTitleHeader}>
        <div className={styled.divTitle}>
            <h1 className={styled.h1Title}>FATURAMENTO</h1>
            <button className={styled.btnCriar} onClick={() => setOpenModal(true)}>Nova Tarefa</button>
        </div>
        <div className={styled.divShare}>
          <p className={styled.pShare}>Filtro: </p>
          <div className={styled.divInputs}>
            <div className={styled.divShareInput}>
              <p>Título:</p>
              <input className={styled.inputShare} placeholder="Digite um Título" value={filter.title} onChange={(e) => setFilter({ ...filter, title: e.target.value })}/>
            </div>
            <div className={styled.divShareInput}>
              <p>Criador:</p>
              <input className={styled.inputShare} placeholder="Digite um Nome" value={filter.creator} onChange={(e) => setFilter({ ...filter, creator: e.target.value })}/>
            </div>
            <div className={styled.divShareInput}>
              <p>Data:</p>
              <input className={styled.inputShare} placeholder="Digite uma Data" value={filter.date} onChange={(e) => setFilter({ ...filter, date: e.target.value })}/>
            </div>
           
          </div>
        </div>
      </div>
      {openModal && <ModalCriaCards />}
      <div className={styled.divSup}>
        <div className={styled.divTarefa}>
          <h1>A Fazer</h1>
          <div>{sortedAfa.map((item) => <FatuCards key={item.id} item={item} />)}</div>
        </div>
        <div className={styled.divTarefa}>
          <h1>Em Andamento</h1>
          <div>{sortedEa.map((item) => <FatuCards key={item.id} item={item} />)}</div>
        </div>
        <div className={styled.divTarefa}>
          <h1>Concluído</h1>
          <div>{sortedConcluido.map((item) => <FatuCards key={item.id} item={item} />)}</div>
        </div>
      </div>
    </section>
  );
};
