'use client'

import styled from './styles.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { SectionSup } from '@/components/SectionSup';
import { SectionComments } from '@/components/SectionComments';
import { AuthContext } from '@/context/auth.context';
import { CardsContext } from '@/context/cards.context';
import { SectionProg } from '@/components/SectionProg';
import { SectionSupHosp } from '@/components/SectionSupHosp';
import { SectionFatu } from '@/components/SectionFatu';
import { SectionInst } from '@/components/SectionInst';
import { ListClient } from '@/components/ListClient';
import { ClientContext } from '@/context/client.context';
import { ModalCriaCards } from '@/components/ModalCriaCard';
import { SectionCardForUser } from '@/components/SectionCardForUser';
import { CriaUser } from '@/components/CriaUser';
import { EditaUser } from '@/components/EditaUser';

const Dashboard = () => {

  const { allUser, selectedMenu, showCards, setShowCards, infoUser, openRegisterUser, setOpenRegisterUser, selectUser, openEditUser, setOpenEditUser } = useContext(AuthContext);
  const { modalClient, setModalClient } = useContext(ClientContext);
  const { openModal, setOpenModal, userNamesWithCardIds, getAllCardsForUser } = useContext(CardsContext);

  useEffect(() => {
    setShowCards(true);
  }, [infoUser]);
  
  const infoUserName = infoUser?.name || '';
  const userCountForInfoUser = userNamesWithCardIds[infoUserName] || 0;

  const handleGetAllCardsForUser = () => {
    getAllCardsForUser();
    setShowCards(true);
  } 
  
  const [selectedUserId, setSelectedUserId] = useState<string>(''); 
  const handleUserSelect = (userId: any) => {
    setSelectedUserId(userId);
    selectUser(userId)
  };

  const [openMenuEditaUser, setOpenMenuEditaUser] = useState<boolean>(false);
  const userModal = () => {
    setOpenMenuEditaUser(prevState => !prevState);
    setSelectedUserId('')
  };


  const handleBtnRegister = (boolean: boolean) => {
    setOpenRegisterUser(boolean);
    setOpenMenuEditaUser(false);
  };

  const handleBtnEdite = () => {
    setOpenEditUser(true);
    setOpenMenuEditaUser(false);
  };

  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuEditaUser(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); 

  return (
    <main className={styled.main}>
      <div className={styled.divHeaderSec}>
        
        <Header />
        
        <div className={styled.divBtn}>
          <button className={styled.btnCriarTarefa} onClick={() => setOpenModal(true)}>Criar Tarefa</button>
          <button onClick={() => setModalClient(true)} className={styled.btnListClient}>Clientes</button>
         
          <div className={styled.divUser}>
            {infoUser?.isAdmin && (
              <button className={styled.btnListClient} onClick={() => userModal()}>Usuario</button>
            )}

            {openMenuEditaUser && (
              <div className={styled.menuSanduiche} ref={menuRef}>
                <div className={styled.divEditar}>
                  <select onChange={(e) => handleUserSelect(e.target.value)}>
                    <option value=""> - Selecione um usuário - </option>
                    {allUser && allUser.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <button className={styled.btnEdit} onClick={handleBtnEdite} disabled={!selectedUserId}>Editar</button> {/* Desabilita o botão se nenhum usuário estiver selecionado */}
                </div>
                <button className={styled.btnRegister} onClick={() => handleBtnRegister(true)}>Cadastrar</button>
              </div>
            )}
          </div>
          
          <div className={styled.cardsContainer}>
            <p className={styled.number}>{userCountForInfoUser.length}</p>
            <button className={styled.btnCards} onClick={handleGetAllCardsForUser}>Minhas Tarefas</button>
          </div>
        </div>

        {modalClient && <ListClient/>}

        {openModal && <ModalCriaCards />}

        {openRegisterUser && <CriaUser />}

        {openEditUser && <EditaUser />}
        
        {showCards ? (
          <section className={styled.secBody}>
            <SectionCardForUser />
          </section>
        ) : (
          <section className={styled.secBody}>
            {selectedMenu === 'Suporte' && <SectionSup />}
            {selectedMenu === 'Programação' && <SectionProg />}
            {selectedMenu === 'Faturamento' && <SectionFatu />}
            {selectedMenu === 'SuporteHosp' && <SectionSupHosp />}
            {selectedMenu === 'Instalação' && <SectionInst />}
          </section>
        )}
      </div>

      <SectionComments />

    </main>
  );
};

export default Dashboard;
