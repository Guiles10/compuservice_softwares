
import styled from './styles.module.scss'
import { useContext, useState } from 'react';
import { CardsContext } from '@/context/cards.context';
import { AuthContext } from '@/context/auth.context';
import { ModalEditCard } from '@/components/ModalEditCard';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { TbReload } from "react-icons/tb";

export const InstCards = ({ item }: any) => {

    const { moveCardReves, moveCard, isLoadingMove } = useContext(CardsContext);

    const { userId, allUser } = useContext(AuthContext);

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

    const userAuthorized = allUser!.map(user => {
        if (user.function && user.function.includes('Instalação')) {
            return user;
        }
        return null;
    }).filter(user => user !== null);

    const isAuthorized = userAuthorized.some((user: any) => user.id === userId);

    return (
        <section className={styled.sectionCard} id="header-top">
            <div  className={styled.divCard}>
                <div className={styled.divTitle}>
                    <h2 className={styled.h2Card}>{item.title && item.title.length > 23 ? `${item.title.substring(0, 23)}...` : item.title} </h2>
                    <div>
                        <div className={styled.priority} style={{ backgroundColor: getPriorityColor() }}></div>
                    </div>
                </div>
                <div className={styled.divNomeData}>
                    <h3 className={styled.h3Name}>{item.user?.name}</h3>
                    <h3 className={styled.h3Data}>{item.createdAt!.slice(0, 10)} - {item.createdAt!.slice(10, -3)}</h3>
                </div>

                {!isAuthorized ? (
                    <div className={styled.divBtnCard}>
                        <button className={styled.btnMov} onClick={() => setOpenModalEdit(true)}>Visualizar</button>
                    </div>
                ) : (
                    <div className={styled.divBtnCard}>
                        <button className={styled.btnMov} type='button' onClick={() => moveCardReves(item, item.id)} disabled={isLoadingMove}>{isLoadingMove ? <TbReload /> : <MdKeyboardDoubleArrowLeft />}</button>
                        <button className={styled.btnMov} onClick={() => setOpenModalEdit(true)} disabled={isLoadingMove}>{isLoadingMove ? <TbReload /> : 'Visualizar'}</button>
                        <button className={styled.btnMov} type='button' onClick={() => moveCard(item, item.id)} disabled={isLoadingMove}>{isLoadingMove ? <TbReload /> : <MdKeyboardDoubleArrowRight />}</button>
                    </div>
                )}
            </div>
            {openModalEdit && <ModalEditCard infoCard={item} setOpenModalEdit={setOpenModalEdit} isAuthorized={isAuthorized}/>}
        </section>
    );
};
