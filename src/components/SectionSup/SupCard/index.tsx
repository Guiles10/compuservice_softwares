
import styled from './styles.module.scss'
import { useContext, useEffect, useState } from 'react';
import { ModalEditCard } from '../ModalEditCard';
import { SupContext, iCardSup } from '@/context/sup.context';
import { AuthContext } from '@/context/auth.context';

export const SupCards = ({ item }: { item: iCardSup }) => {

    const { moveCardReves, moveCard } = useContext(SupContext);
    const { userId } = useContext(AuthContext);

    const [openModalEdit, setOpenModalEdit] = useState(false); 

    const getPriorityColor = () => {
        switch (item.priority) {
            case 'Muito Urgente':
                return 'black';
            case 'Urgente':
                return 'red';
            case 'Normal':
                return 'yellow';
            case 'Basica':
                return 'green';
        }
    }; 

    const isWorker = item.workers && item.workers.some((worker: any) => worker.id === userId);
    const isOwner = item.userId === userId;
    const authorized = isWorker || isOwner;

    const idsDosTrabalhadores = item.workers!.map((worker: any) => worker.id);
    const AjusteItem = {...item, workers: idsDosTrabalhadores}
    
    return (
        <section className={styled.sectionCard} id="header-top">
            <div  className={styled.divCard}>
                <div className={styled.divTitle}>
                    <h2 className={styled.h2Card}>{item.title && item.title.length > 25 ? `${item.title.substring(0, 25)}...` : item.title} </h2>
                    <div>
                        <div className={styled.priority} style={{ backgroundColor: getPriorityColor() }}></div>
                    </div>
                </div>
                <div className={styled.divNomeData}>
                    <h3 className={styled.h3Name}>{item.user?.name}</h3>
                    <h3 className={styled.h3Data}>Criado: {item.createdAt!.slice(0, 10)} - {item.createdAt!.slice(10, -3)}</h3>
                    <h3 className={styled.h3Data}>Editado: {item.updatedAt!.slice(0, 10)} - {item.updatedAt!.slice(10, -3)}</h3>
                </div>
                <p className={styled.pCard}>
                    {item.description && item.description.length > 110 ? `${item.description.substring(0, 110)}...` : item.description}
                </p>
                {!authorized ? (
                    <div className={styled.divBtnCard}>
                        <button className={styled.btnEdit} onClick={() => setOpenModalEdit(true)}>Visualizar</button>
                    </div>
                ): (
                    <div className={styled.divBtnCard}>
                        <button className={styled.btnMov} type='button' onClick={() => moveCardReves(AjusteItem, item.id)}>&lt;&lt;</button>
                        <button className={styled.btnEdit} onClick={() => setOpenModalEdit(true)}>Visualizar/Editar</button>
                        <button className={styled.btnMov} type='button' onClick={() => moveCard(AjusteItem, item.id)} >&gt;&gt;</button>
                    </div>
                )}
            </div>
            {openModalEdit && <ModalEditCard infoCard={item} setOpenModalEdit={setOpenModalEdit}/>}
        </section>
    );
};
