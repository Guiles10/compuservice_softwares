import React, { useState } from 'react';
import styled from './styles.module.scss';
import { FaPen } from 'react-icons/fa';
import { ModalEditaClient } from '../ModalEditaClient';

export const ClientCard = ({ client }: any) => {

    const [modalEditClient, setModalEditClient] = useState<boolean>(false);
    
    const [expandedClientId, setExpandedClientId] = useState<string | null>(null);
    const handleClientClick = (clientId: string) => {
        if(clientId === expandedClientId){
            setExpandedClientId(null);
        } else {
            setExpandedClientId(clientId);
        }

    };

    return (
        <section className={styled.sectionCard} id="header-top">
            <table className={styled.table}>
                <tbody className={styled.tbody}>
                    <tr className={styled.tr}>
                        <td className={styled.td}>
                            <button className={styled.btnEditar} onClick={() => setModalEditClient(true)}><FaPen /></button>
                        </td>
                        <td className={styled.thSeta} onClick={() => handleClientClick(client.id)}>
                            {expandedClientId === client.id ? '▼' : '►'}
                        </td>
                        <td className={styled.thCod}>{client.codigo}</td>
                        <td className={styled.thName}>{client.companyName}</td>
                        <td className={styled.thFone}>{client.businessPhone}</td>
                        <td className={styled.thCNPJ}>{client.cnpj}</td>
                    </tr>
                    {expandedClientId === client.id && (
                        <tr key={client.id + "_responsible"} className={styled.tr}>
                            <td className={styled.td} colSpan={6}>
                                <div className={styled.divInfoClient}>
                                    <div className={styled.divEmailComment}>
                                        <label className={styled.label}>E-mail: <textarea className={styled.textarea} readOnly value={client.businessEmail}></textarea></label>
                                        <label className={styled.label}>Comentário: <textarea className={styled.textarea} readOnly value={client.comment}></textarea></label>
                                    </div>
                                    <div className={styled.divAddrass}>
                                        <h3 className={styled.h3Addrass}>Endereço:</h3>
                                        <div className={styled.divLabel}>
                                            <label className={styled.label}>Rua: <input className={styled.input} type="text" value={client.street} readOnly /></label>
                                            <label className={styled.label}>Número: <input className={styled.input} type="text" value={client.number} readOnly /></label>
                                            <label className={styled.label}>Bairro: <input className={styled.input} type="text" value={client.neighborhood} readOnly /></label>
                                            <label className={styled.label}>Cidade: <input className={styled.input} type="text" value={client.city} readOnly /></label>
                                            <label className={styled.label}>CEP: <input className={styled.input} type="text" value={client.cep} readOnly /></label>
                                            <label className={styled.label}>UF: <input className={styled.input} type="text" value={client.state} readOnly /></label>
                                        </div>
                                    </div>
                                </div>
                                <div className={styled.responsiblesContainer}>
                                    {client.responsibles.map((responsible: any) => (
                                        <div key={responsible.id} className={styled.responsible}>
                                            <p className={styled.pResp}><strong className={styled.strong}>Nome:</strong> {responsible.name}</p>
                                            <p className={styled.pResp}><strong className={styled.strong}>Função:</strong> {responsible.function}</p>
                                            <p className={styled.pResp}><strong className={styled.strong}>E-mail:</strong> {responsible.email}</p>
                                            <p className={styled.pResp}><strong className={styled.strong}>Telefone:</strong> {responsible.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {modalEditClient && <ModalEditaClient client={client} setModalEditClient={setModalEditClient} />}
        </section>
    );
};
