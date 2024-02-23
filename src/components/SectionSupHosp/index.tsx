import React, { useContext, useState } from 'react';
import styled from './styles.module.scss';
import { CardsContext } from '@/context/cards.context';
import { iUser } from '@/context/auth.context';
import { SupHospCards } from './SupHospCard';

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
  solution?: string | null;
  status?: string;
  priority: keyof iPropity;
  createdAt?: string;
  updatedAt?: string | null;
  user_id?: string;
  user: iUser;
}

export const SectionSupHosp = () => {

  const { allCardsSupHosp } = useContext(CardsContext);

  const [searchQuery, setSearchQuery] = useState('');
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

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
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return cards.filter((item) => (
      item.createdAt?.toLowerCase().includes(lowerCaseSearchQuery) ||
      item.user.name.toLowerCase().includes(lowerCaseSearchQuery) ||
      item.title.toLowerCase().includes(lowerCaseSearchQuery)
    ));
  };

  const cardsByStatus = (status: string) => {
    const cards: any = allCardsSupHosp.filter((item) => item.status === status);
    return sortByPriority(filterCards(cards));
  };

  return (
    <section className={styled.secSup}>

      <div className={styled.divTitleHeader}>
        <div className={styled.divTitle}>
            <h1 className={styled.h1Title}>SUPORTE HOSPITAL</h1>
        </div>
        <div className={styled.divShare}>
        <p className={styled.pShare}>Pesquisa: </p>
          <div className={styled.divShareInput}>
            <input className={styled.inputShare} placeholder="Título, Criador ou Data" value={searchQuery} onChange={handleInputChange}/>
          </div>
        </div>
      </div>

      <div className={styled.divSup}> 
        <div className={styled.divTarefa}>
          <h1>A Fazer</h1>
          <div>{cardsByStatus('A Fazer').map((item) => <SupHospCards key={item.id} item={item} />)}</div>
        </div>
        <div className={styled.divTarefa}>
          <h1>Em Andamento</h1>
          <div>{cardsByStatus('Em Andamento').map((item) => <SupHospCards key={item.id} item={item} />)}</div>
        </div>
        <div className={styled.divTarefa}>
          <h1>Concluído</h1>
          <div>{cardsByStatus('Concluido').map((item) => <SupHospCards key={item.id} item={item} />)}</div>
        </div>
      </div>
    </section>
  );
};
