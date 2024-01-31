
import styled from './styles.module.scss'
import { useContext, useState } from 'react';
import { CardsContext, iCard } from '@/context/cards.context';
import { AuthContext } from '@/context/auth.context';
import { ModalEditCardProg } from '../ModalEditCardProg';


export const ProgCards = ({ item }: { item: iCard }) => {

    const { moveCardReves, moveCard } = useContext(CardsContext);

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
        if (user.function && user.function.includes('Programação')) {
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
                        <button className={styled.btnMov} type='button' onClick={() => moveCardReves(item, item.id)}>&lt;&lt;</button>
                        <button className={styled.btnMov} onClick={() => setOpenModalEdit(true)}>Visualizar</button>
                        <button className={styled.btnMov} type='button' onClick={() => moveCard(item, item.id)} >&gt;&gt;</button>
                    </div>
                )}
            </div>
            {openModalEdit && <ModalEditCardProg infoCard={item} setOpenModalEdit={setOpenModalEdit}/>}
        </section>
    );
};
