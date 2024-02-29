import React, { useContext, useState } from 'react';
import styled from './styles.module.scss';
import { ClientContext } from '@/context/client.context';
import { ModalCriaClient } from './ModalCriaClient';
import { AuthContext } from '@/context/auth.context';
import { ClientCard } from './ClientCard';

export const ListClient = () => {
    const { allClient, setModalClient, modalCriaClient, setModalCriaClient } = useContext(ClientContext);
    const [searchQuery, setSearchQuery] = useState('');

    const handleInputChange = (event: any) => {
        setSearchQuery(event.target.value.toLowerCase());
    };
    
    const sortedClients = allClient.sort((a: any, b: any) => {
        return a.companyName.localeCompare(b.companyName);
    });

    const filteredClients = sortedClients.filter((client: any) => {
        const lowerCaseSearchQuery = searchQuery.toLowerCase();
        return (
            (client.companyName && client.companyName.toLowerCase().includes(lowerCaseSearchQuery)) ||
            (client.codigo && client.codigo.toLowerCase().includes(lowerCaseSearchQuery)) ||
            (client.cnpj && client.cnpj.toLowerCase().includes(lowerCaseSearchQuery)) ||
            (client.phone && client.phone.toLowerCase().includes(lowerCaseSearchQuery))
        );
    });

    return (
        <section className={styled.modal}>
            <div className={styled.modalClient}>
                <div className={styled.divHeaderModal}>
                    <p className={styled.pTitleModal}>CLIENTES</p>
                    <div className={styled.divShareClient}>
                        <p>Pesquisa:</p>
                        <input type="text" value={searchQuery} onChange={handleInputChange} />
                    </div>
                    <button className={styled.btnCria} onClick={() => setModalCriaClient(true)}>Cadastrar</button>
                    <button className={styled.btnFecha} onClick={() => setModalClient(false)}>Fechar</button>
                    {modalCriaClient && <ModalCriaClient/>}
                </div>
                <table className={styled.tableContainer}>
                    <thead>
                        <tr className={styled.trH} id='tr'>
                            <th className={styled.thSeta}>-</th>
                            <th className={styled.thCod}>Código</th>
                            <th className={styled.thName}>Empresa</th>
                            <th className={styled.thFone}>Telefone</th>
                            <th className={styled.thCNPJ}>CNPJ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map((client: any) => (
                            <ClientCard key={client.id} client={client} />
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
