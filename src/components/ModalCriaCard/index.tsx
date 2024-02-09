import styled from './styles.module.scss'
import { CardsContext, iDataForm } from '@/context/cards.context';
import { useContext, useRef, useState } from 'react';
import { cardSchema, cardSchemaType } from '@/schema/cards.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientContext } from '@/context/client.context';

export const ModalCriaCards = () => {

    const { allClient} = useContext(ClientContext);
    const { setOpenModal, creatCardSup } = useContext(CardsContext);

    const [novaTarefa, setNovaTarefa] = useState('');
    const [tarefas, setTarefas] = useState<string[]>([]);

    const adicionarTarefa = () => {
        if (novaTarefa.trim()) {
            setTarefas((prevTarefas) => [...prevTarefas, novaTarefa]);
            setNovaTarefa('');
        }
    };
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);
    const excluirTarefa = (index: number) => {
        setTarefas((prevTarefas) => {
          const novasTarefas = [...prevTarefas];
          novasTarefas.splice(index, 1);
          return novasTarefas;
        });
        setConfirmacaoExclusao(false);
    };

    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const handleCheckboxChange = (event: any) => {
        const optionValue = event.target.value;
        if (selectedOptions.includes(optionValue)) {
            setSelectedOptions(selectedOptions.filter(option => option !== optionValue));
        } else {
            setSelectedOptions([...selectedOptions, optionValue]);
        }
    }

    const [selectedClient, setSelectedClient] = useState<string>('');
    const [selectedNames, setSelectedNames] = useState<string[]>([]);
    const handleSave = () => {
      if (selectedClient && !selectedNames.includes(selectedClient)) {
        setSelectedNames(prevSelectedNames => [...prevSelectedNames, selectedClient]);
      }
    };
    const handleRemoveName = (nameToRemove: string) => {
      setSelectedNames(prevSelectedNames => prevSelectedNames.filter(name => name !== nameToRemove));
    };

    const { register, handleSubmit, formState: { errors } } = useForm<cardSchemaType>({
        resolver: zodResolver(cardSchema),
      });
    const onSubmit = (data: any) => {
        if(selectedOptions.length > 0){
            const dataForm = { ...data, type: selectedOptions, clients: selectedNames };
            creatCardSup(dataForm, tarefas)
            setOpenModal(false)
        }
    };


    return (
        <section className={styled.modal}>
            <div className={styled.modalCard}>
                <form className={styled.form} onSubmit={handleSubmit(onSubmit)}>

                    <div className={styled.divHeader}>
                        <div className={styled.divInputTitle}>
                            <input className={styled.inputTitle} id="title" type="text" {...register("title")} placeholder="Digite o Titulo"/>
                            {errors.title?.message && ( <p className={styled.pError}>{errors.title.message}</p> )}
                        </div>
                        <button className={styled.btnFecha} onClick={() => setOpenModal(false)}>Fechar</button>
                    </div>

                    <div  className={styled.divTypePrioryt}>
                        <div className={styled.divSelect}>
                            <p className={styled.pDesc}>Prioridade: </p>
                            <select className={styled.select} id="opcoes" {...register('priority')}>
                                <option value="Basica">Basica</option>
                                <option value="Normal">Normal</option>
                                <option value="Urgente">Urgente</option>
                                <option value="Muito Urgente">Muito Urgente</option>
                            </select>
                            {errors.priority && <p className={styled.pError}>Por favor, selecione uma opção de urgência</p>}
                        </div>
                        <div className={styled.divType}>
                            <p className={styled.pDesc}>Setor: </p>
                            <div className={styled.checkboxContainer}>
                                <label>
                                    <input type="checkbox" {...register('type')} value="Suporte" checked={selectedOptions.includes('Suporte')} onChange={handleCheckboxChange}/>Suporte
                                </label>
                                <label>
                                    <input type="checkbox" {...register('type')} value="Programação" checked={selectedOptions.includes('Programação')} onChange={handleCheckboxChange}/>Programação
                                </label>
                                <label>
                                    <input type="checkbox" {...register('type')} value="Faturamento" checked={selectedOptions.includes('Faturamento')} onChange={handleCheckboxChange}/>Faturamento
                                </label>
                                <label>
                                    <input type="checkbox" {...register('type')} value="Suporte Hospital" checked={selectedOptions.includes('Suporte Hospital')} onChange={handleCheckboxChange}/>Suporte Hospital
                                </label>
                                <label>
                                    <input type="checkbox" {...register('type')} value="Instalação" checked={selectedOptions.includes('Instalação')} onChange={handleCheckboxChange}/>Instalação
                                </label>
                                {selectedOptions.length === 0 && (
                                    <p className={styled.pError}>Escolha ao menos um Setor</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <select onChange={(event) => setSelectedClient(event.target.value)}>
                            <option value=''> - Selecione - </option>
                            {allClient.map((cliente, index) => (
                                <option key={index} value={cliente.companyName}>{cliente.companyName}</option>
                            ))}
                        </select>
                        <button onClick={handleSave} type='button'>Salvar</button>
                        {selectedNames.length > 0 && (
                            <div>
                            {selectedNames.map((nome, index) => (
                                <div key={index}>
                                    <p>{nome}</p>
                                    <button type='button' onClick={() => handleRemoveName(nome)}>X</button>
                                </div>
                            ))}
                            </div>
                        )}
                    </div>

                    <div className={styled.divDesc}>
                        <p className={styled.pDesc}>Descrição:</p>
                        <div>
                            <textarea className={styled.textarea} id="descriptin" {...register("description")} placeholder="Digite a descrição"/>
                        </div>
                    </div>

                    <div className={styled.divTarefas}>
                        <div className={styled.divTitleTarefas}>
                            <h2 className={styled.pDesc}>Tarefas:</h2>
                        </div>
                        <div className={styled.divInput}>
                            <div className={styled.divAddTarefa}>
                                <input type="text" value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)} placeholder="Digite a nova tarefa"/>
                                <button type="button" onClick={adicionarTarefa}>Criar</button>
                            </div>
                            <div className={styled.divUl}>
                                <ul className={styled.ul}>
                                    {tarefas.map((tarefa, index) => (
                                        <li className={styled.li} key={index}>
                                            <div>
                                                <label htmlFor={`tarefa-${index}`}>{tarefa}</label>
                                            </div>
                                            <button onClick={() => excluirTarefa(index)}>X</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className={styled.divSalvar}>
                        <button type='submit' className={styled.salvar}>Salvar</button>
                    </div>

                </form>
            </div>
        </section>
    );    
};