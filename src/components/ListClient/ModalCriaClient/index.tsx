'use client'
import React from 'react';
import styled from './styles.module.scss'
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientContext, iDataForm, iResponsible } from '@/context/client.context';
import { clientSchema, clientSchemaType } from '@/schema/client.schema';


export const ModalCriaClient = () => {

    const { setModalCriaClient, creatClient } = useContext(ClientContext);

    const [showResponsibleForms, setShowResponsibleForms] = useState<number[]>([]);

    const handleAddResponsibleClick = () => {
        const newFormId = Date.now();
        setShowResponsibleForms([...showResponsibleForms, newFormId]);
    };

    const handleCloseResponsibleForm = (formId: number) => {
        setShowResponsibleForms(showResponsibleForms.filter(id => id !== formId));
    };

    const { register, handleSubmit, formState: { errors } } = useForm<clientSchemaType>({
        resolver: zodResolver(clientSchema),
    });
    
    const onSubmit = (dataForm: iDataForm) => {
        const responsibleData = showResponsibleForms.map(formId => {
            return {
                name: (document.getElementById(`name-${formId}`) as HTMLInputElement).value,
                function: (document.getElementById(`function-${formId}`) as HTMLInputElement).value,
                email: (document.getElementById(`email-${formId}`) as HTMLInputElement).value,
                phone: (document.getElementById(`phone-${formId}`) as HTMLInputElement).value,
            };
        });

        creatClient(dataForm, responsibleData);
        setModalCriaClient(false);
    };

    return (
        <section className={styled.modal}>
            <form className={styled.form} onSubmit={handleSubmit(onSubmit)}>

                <div className={styled.divHeaderModal}>
                    <p className={styled.pTitleModal}>CADASTRAR CLIENTE</p>
                    <button className={styled.btnFecha} onClick={() => setModalCriaClient(false)}>Fechar</button>
                </div>

                <section className={styled.secForm}>
                    <div className={styled.formGroup}>
                        <label htmlFor="codigo">Código:</label>
                        <input type="text" id="codigo" {...register('codigo')} />
                        {errors.codigo && <span className={styled.errorMsg}>{errors.codigo.message}</span>}
                    </div>
                    <div className={styled.formGroup}>
                        <label htmlFor="companyName">Nome da Empresa:</label>
                        <input type="text" id="companyName" {...register('companyName')} />
                        {errors.companyName && <span className={styled.errorMsg}>{errors.companyName.message}</span>}
                    </div>
                    <div className={styled.formGroup}>
                        <label htmlFor="cnpj">CNPJ:</label>
                        <input type="text" id="cnpj" {...register('cnpj')} />
                        {errors.cnpj && <span className={styled.errorMsg}>{errors.cnpj.message}</span>}
                    </div>
                    <div className={styled.formGroup}>
                        <label htmlFor="businessPhone">Telefone Comercial:</label>
                        <input type="text" id="businessPhone" {...register('businessPhone')} />
                        {errors.businessPhone && <span className={styled.errorMsg}>{errors.businessPhone.message}</span>}
                    </div>
                    <div className={styled.formGroup}>
                        <label htmlFor="businessEmail">E-mail Comercial:</label>
                        <input type="text" id="businessEmail" {...register('businessEmail')} />
                        {errors.businessEmail && <span className={styled.errorMsg}>{errors.businessEmail.message}</span>}
                    </div>
                    <div className={styled.address}>
                        <div className={styled.formGroup}>
                            <label htmlFor="cep">CEP:</label>
                            <input type="text" id="cep" {...register('cep')} />
                            {errors.cep && <span className={styled.errorMsg}>{errors.cep.message}</span>}
                        </div>
                        <div className={styled.formGroup}>
                            <label htmlFor="state">Estado:</label>
                            <select id="state" {...register('state')}>
                                <option value="">Selecione o estado</option>
                                <option value="Acre">Acre</option>
                                <option value="Alagoas">Alagoas</option>
                                <option value="Amapá">Amapá</option>
                                <option value="Amazonas">Amazonas</option>
                                <option value="Bahia">Bahia</option>
                                <option value="Ceará">Ceará</option>
                                <option value="Distrito Federal">Distrito Federal</option>
                                <option value="Espírito Santo">Espírito Santo</option>
                                <option value="Goiás">Goiás</option>
                                <option value="Maranhão">Maranhão</option>
                                <option value="Mato Grosso">Mato Grosso</option>
                                <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
                                <option value="Minas Gerais">Minas Gerais</option>
                                <option value="Pará">Pará</option>
                                <option value="Paraíba">Paraíba</option>
                                <option value="Paraná">Paraná</option>
                                <option value="Pernambuco">Pernambuco</option>
                                <option value="Piauí">Piauí</option>
                                <option value="Rio de Janeiro">Rio de Janeiro</option>
                                <option value="Rio Grande do Norte">Rio Grande do Norte</option>
                                <option value="Rio Grande do Sul">Rio Grande do Sul</option>
                                <option value="Rondônia">Rondônia</option>
                                <option value="Roraima">Roraima</option>
                                <option value="Santa Catarina">Santa Catarina</option>
                                <option value="São Paulo">São Paulo</option>
                                <option value="Sergipe">Sergipe</option>
                                <option value="Tocantins">Tocantins</option>
                            </select>
                            {errors.state && <span className={styled.errorMsg}>{errors.state.message}</span>}
                        </div>
                        <div className={styled.formGroup}>
                            <label htmlFor="city">Cidade:</label>
                            <input type="text" id="city" {...register('city')} />
                            {errors.city && <span className={styled.errorMsg}>{errors.city.message}</span>}
                        </div>
                        <div className={styled.formGroup}>
                            <label htmlFor="street">Rua:</label>
                            <input type="text" id="street" {...register('street')} />
                            {errors.street && <span className={styled.errorMsg}>{errors.street.message}</span>}
                        </div>
                        <div className={styled.formGroup}>
                            <label htmlFor="neighborhood">Bairro:</label>
                            <input type="text" id="neighborhood" {...register('neighborhood')} />
                            {errors.neighborhood && <span className={styled.errorMsg}>{errors.neighborhood.message}</span>}
                        </div>
                        <div className={styled.formGroup}>
                            <label htmlFor="number">Número:</label>
                            <input type="text" id="number" {...register('number')} />
                            {errors.number && <span className={styled.errorMsg}>{errors.number.message}</span>}
                        </div>
                    </div>
                    <div className={styled.formGroup}>
                        <label htmlFor="comment">Comentário:</label>
                        <textarea id="comment" {...register('comment')} />
                        {errors.comment && <span className={styled.errorMsg}>{errors.comment.message}</span>}
                    </div>
                </section>

                <button className={styled.addRespBtn} type='button' onClick={handleAddResponsibleClick}>Add Responsável</button>
                <section className={styled.secResponsible}>
                    {showResponsibleForms.map(formId => (
                        <div key={formId} className={styled.responsibleForm}>
                            <button className={styled.btnClose} onClick={() => handleCloseResponsibleForm(formId)}>X</button>
                            <div className={styled.formGroup}>
                                <label htmlFor={`name-${formId}`}>Nome:</label>
                                <input type="text" id={`name-${formId}`} name={`name-${formId}`} />
                            </div>
                            <div className={styled.formGroup}>
                                <label htmlFor="function">Função:</label>
                                <input type="text" id={`function-${formId}`} name={`function-${formId}`} />
                            </div>
                            <div className={styled.formGroup}>
                                <label htmlFor="email">E-mail:</label>
                                <input type="text" id={`email-${formId}`} name={`email-${formId}`} />
                            </div>
                            <div className={styled.formGroup}>
                                <label htmlFor="phone">Telefone:</label>
                                <input type="text" id={`phone-${formId}`} name={`phone-${formId}`} />
                            </div>
                        </div>
                    ))}
                </section>

                <div className={styled.divSalvar}>
                    <button type='submit' className={styled.salvar}>Salvar</button>
                </div>

            </form>
        </section>
    );
};

