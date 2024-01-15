import styled from './styles.module.scss'
import { useContext } from 'react';
import { SupContext } from '@/context/sup.context';

import { ModalCriaCards } from '../ModalCriaCard';
import { Cards } from '../Card';

export const SectionSup = () => {

    const { allCardsSup, openModal, setOpenModal} = useContext(SupContext);

    return (
        <section className={styled.secSup}>
            <h1 className={styled.h1Title} >SUPORTE</h1>
            <div className={styled.divSup}>
                <div className={styled.divTarefa}>
                    <h1>A Fazer</h1>
                    <div>
                        {allCardsSup
                        .filter(item => item.status === "A Fazer")
                        .map(item => (
                            <Cards key={item.id} item={item} />
                        ))}
                    </div>
                    <button className={styled.btnCriar} onClick={() => setOpenModal(true)}>Criar Card</button>
                    {openModal && <ModalCriaCards />}
                </div>
                <div className={styled.divTarefa}>
                    <h1>Em Andamento</h1>
                    <div>
                        {allCardsSup
                        .filter(item => item.status === "Em Andamento")
                        .map(item => (
                            <Cards key={item.id} item={item} />
                        ))}
                    </div>
                </div>
                <div className={styled.divTarefa}>
                    <h1>Concluído</h1>
                    <div>
                        {allCardsSup
                        .filter(item => item.status === "Concluido")
                        .map(item => (
                            <Cards key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
      );
};