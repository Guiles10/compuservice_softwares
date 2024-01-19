import styled from './styles.module.scss'
import { useContext } from 'react';
import { SupContext } from '@/context/sup.context';

import { ModalCriaCards } from '../ModalCriaCard';
import { Cards } from '../Card';
import { iUser } from '@/context/auth.context';

interface iPropity {
    'Muito Urgente': number,
    'Urgente': number,
    'Normal': number,
    'Basica': number,
}
interface iCardSupPropity {
    id: string 
    title: string
    description?: string | null
    tasks: string[] | null
    solution?: string | null
    status?: string
    priority: keyof iPropity;
    createdAt?: string
    updatedAt?: string | null
    user_id?: string
    user: iUser
}

export const SectionSup = () => {

    const { allCardsSup, openModal, setOpenModal} = useContext(SupContext);

    const sortByPriority = (cards: iCardSupPropity[]) => {
        const priorityOrder: iPropity = {
          'Muito Urgente': 1,
          'Urgente': 2,
          'Normal': 3,
          'Basica': 4,
        };
        return cards.sort((a: iCardSupPropity, b: iCardSupPropity) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      };
      const cardsAfa: any = allCardsSup.filter((item) => item.status === 'A Fazer');
      const cardsEa: any = allCardsSup.filter((item) => item.status === 'Em Andamento');
      const cardsConcluido: any = allCardsSup.filter((item) => item.status === 'Concluido');

      const sortedAfa = sortByPriority(cardsAfa);
      const sortedEa = sortByPriority(cardsEa);
      const sortedConcluido = sortByPriority(cardsConcluido);
    
    return (
        <section className={styled.secSup}>
            <div className={styled.divTitle}>
                <h1 className={styled.h1Title} >SUPORTE</h1>
                <button className={styled.btnCriar} onClick={() => setOpenModal(true)}>Criar Card</button>
            </div>
            {openModal && <ModalCriaCards />}
            <div className={styled.divSup}>
                <div className={styled.divTarefa}>
                    <h1>A Fazer</h1>
                    <div>
                        {sortedAfa.map(item => (
                            <Cards key={item.id} item={item} />
                        ))}
                    </div>
                </div>
                <div className={styled.divTarefa}>
                    <h1>Em Andamento</h1>
                    <div>
                        {sortedEa.map(item => (
                            <Cards key={item.id} item={item} />
                        ))}
                    </div>
                </div>
                <div className={styled.divTarefa}>
                    <h1>Concluído</h1>
                    <div>
                        {sortedConcluido.map(item => (
                            <Cards key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
      );
};