import styled from './styles.module.scss'
import { CardsContext } from '@/context/cards.context';
import { useContext, useRef, useState } from 'react';
import { cardSchema, cardSchemaType } from '@/schema/cards.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClientContext } from '@/context/client.context';
import { AuthContext } from '@/context/auth.context';

import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";




export const ModalCriaCards = () => {

    const { allUser } = useContext(AuthContext);
    const { allClient } = useContext(ClientContext);
    const { setOpenModal, creatCard, isLoading, setIsLoading } = useContext(CardsContext);

/////////////////////////////////////////////////// TASK ///////////////////////////////////////////////////
    const [novaTarefa, setNovaTarefa] = useState('');
    const [tarefas, setTarefas] = useState<{ id: string, texto: string }[]>([]);
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);

    const adicionarTarefa = () => {
        if (novaTarefa.trim()) {
            const novaTarefaObj = { id: Date.now().toString(), texto: novaTarefa };
            setTarefas((prevTarefas) => [...prevTarefas, novaTarefaObj]);
            setNovaTarefa('');
        }
    };

    const excluirTarefa = (id: string) => {
        setTarefas((prevTarefas) => prevTarefas.filter(tarefa => tarefa.id !== id));
        setConfirmacaoExclusao(false);
    };

    const moverTarefaParaCima = (id: string) => {
        const index = tarefas.findIndex(tarefa => tarefa.id === id);
        if (index > 0) {
            const novaLista = [...tarefas];
            [novaLista[index - 1], novaLista[index]] = [novaLista[index], novaLista[index - 1]];
            setTarefas(novaLista);
        }
    };

    const moverTarefaParaBaixo = (id: string) => {
        const index = tarefas.findIndex(tarefa => tarefa.id === id);
        if (index < tarefas.length - 1) {
            const novaLista = [...tarefas];
            [novaLista[index], novaLista[index + 1]] = [novaLista[index + 1], novaLista[index]];
            setTarefas(novaLista);
        }
    };

/////////////////////////////////////////////////// SETOR ///////////////////////////////////////////////////
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const handleCheckboxChange = (event: any) => {
        const optionValue = event.target.value;
        if (selectedOptions.includes(optionValue)) {
            setSelectedOptions(selectedOptions.filter(option => option !== optionValue));
        } else {
            setSelectedOptions([...selectedOptions, optionValue]);
        }
    }

/////////////////////////////////////////////////// CLIENTES ///////////////////////////////////////////////////
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

/////////////////////////////////////////////////// USUÁRIOS ///////////////////////////////////////////////////
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedUserNames, setSelectedUserNames] = useState<string[]>([]);
    const handleSaveUser = () => {
    if (selectedUser && !selectedUserNames.includes(selectedUser)) {
        setSelectedUserNames(prevSelectedUserNames => [...prevSelectedUserNames, selectedUser]);
    }
    };
    const handleRemoveUserName = (nameToRemove: string) => {
    setSelectedUserNames(prevSelectedUserNames => prevSelectedUserNames.filter(name => name !== nameToRemove));
    };

/////////////////////////////////////////////////// FILE ///////////////////////////////////////////////////
    const [selectedFileName, setSelectedFileName] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = () => {
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
            const file = fileInputRef.current.files[0];
            const isExisting = selectedFiles.some((f: any) => f.name === file.name);

            if (!isExisting) {
                setSelectedFileName(file.name);
            } else {
                alert("Já existe um arquivo com esse nome.");
                setSelectedFileName('');
            }
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleSaveFile = () => {
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
            const file = fileInputRef.current.files[0];

            const isExisting = selectedFiles.some((f: any) => f.name === file.name);
            if (!isExisting) {
                setSelectedFiles(prevFiles => [...prevFiles, file]);
            } else {
                alert("Já existe um arquivo com esse nome.");
            }
        }
        if (fileInputRef.current) {
            setSelectedFileName('');
            fileInputRef.current.value = '';
        }
    };

    const handleDeleteFile = (fileNameToDelete: string) => {
        setSelectedFiles(prevFiles => prevFiles.filter((file: any) => file.name !== fileNameToDelete));
    };

/////////////////////////////////////////////////// FORM ///////////////////////////////////////////////////
    const { register, handleSubmit, formState: { errors } } = useForm<cardSchemaType>({
        resolver: zodResolver(cardSchema),
    });

    const onSubmit = (data: any) => {
        setIsLoading(true); 
        const taskRequest = tarefas.map(tarefa => tarefa.texto);
        if(selectedOptions.length > 0){
            const dataForm = { ...data, type: selectedOptions, clients: selectedNames, worker: selectedUserNames};
            creatCard(dataForm, taskRequest, selectedFiles);
        }
    };

    return (
        <section className={styled.modal}>
            <div className={styled.modalCard}>
                <form className={styled.form} onSubmit={handleSubmit(onSubmit)}>

                    <div className={styled.divHeader}>
                        <div className={styled.divInputTitle}>
                            <input className={styled.inputTitle} id="title" type="text" disabled={isLoading} {...register("title")} placeholder="Digite o Titulo"/>
                            {errors.title?.message && ( <p className={styled.pError}>{errors.title.message}</p> )}
                        </div>
                        <button className={styled.btnFecha} onClick={() => setOpenModal(false)} disabled={isLoading}>Fechar</button>
                    </div>

                    <div className={styled.divUserSelect}>
                        <div className={styled.divSelectClient}>
                            <p className={styled.pDesc}>Usuário: </p>
                            <div>
                                <select className={styled.selectClient} disabled={isLoading} onChange={(event) => setSelectedUser(event.target.value)}>
                                    <option value=''> - Selecione - </option>
                                    {allUser!.map((user: any, index: any) => (
                                        <option key={index} value={user.name}>{user.name}</option>
                                    ))}
                                </select>
                                <button className={styled.btnSlavar} onClick={handleSaveUser} type='button' disabled={isLoading}>Adicionar</button>
                            </div>
                        </div>
                        {selectedUserNames.length > 0 && (
                            <div className={styled.divClient} >
                            {selectedUserNames.map((userName, index) => (
                                <div className={styled.divNameBtn} key={index}>
                                <p className={styled.pName}>{userName}</p>
                                <button className={styled.btnExcluir} type='button' onDoubleClick={() => handleRemoveUserName(userName)}>X</button>
                                </div>
                            ))}
                            </div>
                        )}
                    </div>

                    <div  className={styled.divTypePrioryt}>
                        <div className={styled.divSelect}>
                            <p className={styled.pDesc}>Prioridade: </p>
                            <select className={styled.select} disabled={isLoading} id="opcoes" {...register('priority')}>
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
                                    <input type="checkbox" disabled={isLoading} {...register('type')} value="Suporte" checked={selectedOptions.includes('Suporte')} onChange={handleCheckboxChange}/>Suporte
                                </label>
                                <label>
                                    <input type="checkbox" disabled={isLoading} {...register('type')} value="Programação" checked={selectedOptions.includes('Programação')} onChange={handleCheckboxChange}/>Programação
                                </label>
                                <label>
                                    <input type="checkbox" disabled={isLoading} {...register('type')} value="Faturamento" checked={selectedOptions.includes('Faturamento')} onChange={handleCheckboxChange}/>Faturamento
                                </label>
                                <label>
                                    <input type="checkbox" disabled={isLoading} {...register('type')} value="Suporte Hospital" checked={selectedOptions.includes('Suporte Hospital')} onChange={handleCheckboxChange}/>Suporte Hospital
                                </label>
                                <label>
                                    <input type="checkbox" disabled={isLoading} {...register('type')} value="Instalação" checked={selectedOptions.includes('Instalação')} onChange={handleCheckboxChange}/>Instalação
                                </label>
                                {selectedOptions.length === 0 && (
                                    <p className={styled.pError}>Escolha ao menos um Setor</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styled.divClientSelect}>
                        <div className={styled.divSelectClient}>
                            <p className={styled.pDesc}>Cliente: </p>
                            <div>
                                <select className={styled.selectClient} disabled={isLoading} onChange={(event) => setSelectedClient(event.target.value)}>
                                    <option value=''> - Selecione - </option>
                                    {allClient.map((cliente, index) => (
                                        <option key={index} value={cliente.companyName}>{cliente.companyName}</option>
                                        ))}
                                </select>
                                <button className={styled.btnSlavar} onClick={handleSave} type='button' disabled={isLoading}>Adicionar</button>
                            </div>
                        </div>
                        {selectedNames.length > 0 && (
                            <div className={styled.divClient} >
                            {selectedNames.map((nome, index) => (
                                <div className={styled.divNameBtn}key={index}>
                                    <p className={styled.pName}>{nome}</p>
                                    <button className={styled.btnExcluir} type='button' onDoubleClick={() => handleRemoveName(nome)}>X</button>
                                </div>
                            ))}
                            </div>
                        )}
                    </div>

                    <div className={styled.divDesc}>
                        <p className={styled.pDesc}>Descrição:</p>
                        <div>
                            <textarea className={styled.textarea} disabled={isLoading} id="descriptin" {...register("description")} placeholder="Digite a descrição"/>
                        </div>
                    </div>

                    <div className={styled.divTarefas}>
                        <div className={styled.divTitleTarefas}>
                            <h2 className={styled.pDesc}>Tarefas:</h2>
                        </div>
                        <div className={styled.divInput}>
                            <div className={styled.divAddTarefa}>
                                <input type="text" value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)} placeholder="Digite a nova tarefa"/>
                                <button type="button" onClick={adicionarTarefa} className={styled.btnSalveFile}>Adicionar</button>
                            </div>
                            <div className={styled.divUl}>
                                <ul className={styled.ul}>
                                    {tarefas.map((tarefa) => (
                                        <li className={styled.li} key={tarefa.id}>
                                            <div>
                                                <label htmlFor={`tarefa-${tarefa.id}`}>{tarefa.texto}</label>
                                            </div>
                                            <div className={styled.dibBtnTask}>
                                                <FaArrowAltCircleUp className={styled.moveTask} onClick={() => moverTarefaParaCima(tarefa.id)}/>
                                                <FaArrowAltCircleDown className={styled.moveTask} onClick={() => moverTarefaParaBaixo(tarefa.id)}/>
                                                <FaTrashCan className={styled.excluiTask} onDoubleClick={() => excluirTarefa(tarefa.id)}/>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <section className={styled.secFile}>
                        <p className={styled.pDesc}>Selecionar Arquivo:</p>
                        <div className={styled.divAddFile}>
                            <input className={styled.inputFile} type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
                            <button className={styled.btnSelectFile} type="button" onClick={handleButtonClick} disabled={isLoading}>Selecionar Arquivo</button>
                                <div className={styled.divSpan}>
                                    <span className={styled.span}>Arquivo:</span>
                                    <span className={styled.spanFile}> - {selectedFileName}</span>  
                                </div>
                            <button className={styled.btnSalveFile} type='button' onClick={handleSaveFile}>Adicionar</button>
                        </div>

                        <div className={styled.divAllFile}>
                            {selectedFiles.map((file: any, index: number) => (
                                <div className={styled.divFile} key={index}>
                                    <p className={styled.fileName}>{file.name}</p>
                                    <button className={styled.fileExcluir} type='button' onDoubleClick={() => handleDeleteFile(file.name)} disabled={isLoading}>Excluir</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className={styled.divSalvar}>
                        <button type='submit' className={isLoading ? styled.salvarLoading : styled.salvar} disabled={isLoading || selectedOptions.length === 0}>
                            {isLoading ? 'Criando Card ...' : 'Criar Card'}
                        </button>
                    </div>

                </form>
            </div>
        </section>
    );    
};