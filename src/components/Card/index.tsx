
import styled from './styles.module.scss'
import { useContext, useState } from 'react';
import { ModalEditCard } from './ModalCard';
import { SupContext, iCardSup } from '@/context/sup.context';


export const Cards = ({ item }: { item: iCardSup }) => {

    const { moveCardReves, moveCard } = useContext(SupContext);

    const [openModalEdit, setOpenModalEdit] = useState(false);

    return (
        <section className={styled.sectionCard} id="header-top">
            <div  className={styled.divCard}>
                <h2 className={styled.h2Card}>{item.title}</h2>
                <p className={styled.pCard}>{item.description}</p>
                <div className={styled.divBtnCard}>
                    <button type='button' onClick={() => moveCardReves(item, item.id)}>&lt;&lt;</button>
                    <button onClick={() => setOpenModalEdit(true)}>Editar</button>
                    <button type='button' onClick={() => moveCard(item, item.id)} >&gt;&gt;</button>
                </div>
            </div>
            {openModalEdit && <ModalEditCard infoCard={item} setOpenModalEdit={setOpenModalEdit}/>}
        </section>
    );
};
