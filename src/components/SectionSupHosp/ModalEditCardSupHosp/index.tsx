import styled from './styles.module.scss'
import { useContext, useState } from 'react';
import { CardsContext, iCard, iDataForm, iTask } from '@/context/cards.context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { editCardSchema, editCardSchemaType } from '@/schema/cards.schema';
import { Dispatch, SetStateAction } from 'react';
import { AuthContext } from '@/context/auth.context';
import { FaPen } from 'react-icons/fa';


export const ModalEditCardSupHosp = ({ infoCard, setOpenModalEdit }:{ infoCard: iCard, setOpenModalEdit: Dispatch<SetStateAction<boolean>> }) => {

    const { allUser, userId } = useContext(AuthContext);
    const { excluirSupCard, editarCard, excluirTask } = useContext(CardsContext);


    const userAuthorized = allUser!.map(user => {
        if (user.function && user.function.includes('Suporte Hospital')) {
            return user;
        }
        return null;
    }).filter(user => user !== null);

    const isAuthorized = userAuthorized.some((user: any) => user.id === userId);



    const tasksinfoCard: any = infoCard.tasks!
    const [tasksDB, setTasksDB] = useState<any>(tasksinfoCard);
    const [novaTarefa, setNovaTarefa] = useState('');

    const handleCheckboxChange = (index: number) => {
        const updatedTasks = [...tasksDB];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasksDB(updatedTasks);
    };

    const handleCriarTarefa = () => {
    if (novaTarefa.trim() !== '') {
        const novaTarefaObj = { task: novaTarefa, completed: false };
        setTasksDB((prevTasks: any) => [...prevTasks, novaTarefaObj]);
        setNovaTarefa('');
    }
    };

    const excluirTarefa = (index: number, id: any | undefined) => {
        const novaListaTarefas = [...tasksDB];
        novaListaTarefas.splice(index, 1);
        if(id){
            excluirTask(id)
        }
        setTasksDB(novaListaTarefas);
    };
    
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);
    const confirmaExcluir = (cardId: string)=> {
        if (isAuthorized) {
            excluirSupCard(cardId)
            setOpenModalEdit(false)
        }
    }


    const [selectedOptions, setSelectedOptions] = useState(infoCard.type || []);
    const handleCheckboxChangeType = (e: any) => {
        const { value } = e.target;
        if (selectedOptions.includes(value)) {
            setSelectedOptions(selectedOptions.filter(option => option !== value));
        } else {
            setSelectedOptions([...selectedOptions, value]);
        }
    };

    const { register, handleSubmit, formState: { errors } } = useForm<editCardSchemaType>({
        resolver: zodResolver(editCardSchema),
    });

    const onSubmit = (form: iDataForm) => {
        if(selectedOptions.length > 0){
            const dataForm = { ...form, type: selectedOptions };
            editarCard(infoCard.id, dataForm, tasksDB);
            setOpenModalEdit(false);
        }
    };

    const [editingTitle, setEditingTitle] = useState(false);
    const handleEditTitle = () => {
        setEditingTitle(!editingTitle);
    };

    return (
        <section className={styled.modal}>
            <div className={styled.modalCard}>
                <form className={styled.form} onSubmit={handleSubmit(onSubmit)}>

                    <div className={styled.divHeader}>
                        {editingTitle ? (
                            <div className={styled.divInputTitle}>
                                {isAuthorized && <FaPen className={styled.editar} onClick={handleEditTitle} />}
                                <input className={styled.inputTitle} id="title" type="text" {...register("title")} placeholder="Digite o Título" defaultValue={infoCard.title}/>
                                {errors.title?.message && (<p className={styled.pError}>{errors.title.message}</p>)}
                            </div>
                        ) : (
                            <div className={styled.divInputTitle}>
                                {isAuthorized && <FaPen className={styled.editar} onClick={handleEditTitle} />}
                                <h1 className={styled.title}>{infoCard.title}</h1>
                            </div>
                        )}
                        <div className={styled.divCreateBtn}>
                            <div className={styled.divNomeData}>|
                                <div>
                                    <h3 className={styled.h3Data}>C: {infoCard.createdAt!.slice(0, 16)}</h3>
                                    <h3 className={styled.h3Data}>E: {infoCard.updatedAt!.slice(0, 16)}</h3>
                                </div>|
                            </div>
                            <button className={styled.btnFecha} type='button' onClick={() => setOpenModalEdit(false)}>Fechar</button>
                        </div>
                    </div>
                    {!isAuthorized && (
                        <p className={styled.pAuthorized}>Você não é autorizado a fazer edições</p>
                    )}

                    <div className={styled.divSelect}>
                        <div className={styled.divPriority}>
                            <p className={styled.pDesc}>Prioridade: </p>
                            <select className={styled.select} id="opcoes" {...register('priority')} defaultValue={infoCard.priority || 'Normal'} disabled={!isAuthorized}>
                                <option value="Basica">Basica</option>
                                <option value="Normal">Normal</option>
                                <option value="Urgente">Urgente</option>
                                <option value="Muito Urgente">Muito Urgente</option>
                            </select>
                        </div>
                        <div className={styled.divType}>
                            <p className={styled.pDesc}>Setor: </p>
                            <div className={styled.checkboxContainer}>
                                <div className={styled.divLabel}>
                                    {['Suporte', 'Programação', 'Faturamento', 'Suporte Hospital', 'Instalação'].map((type, index) => (
                                        <label className={styled.labelType} key={index}>
                                            <input type="checkbox" value={type} checked={selectedOptions.includes(type)} onChange={handleCheckboxChangeType} disabled={!isAuthorized}/>{type}
                                        </label>
                                    ))}
                                </div>
                                {selectedOptions.length === 0 && (
                                    <p className={styled.pError}>Escolha ao menos um Setor</p>
                                )}
                            </div>
                        </div>
                    </div> 
    
                    <div className={styled.divDesc}>
                        <p className={styled.pDesc}>Descrição:</p>
                        <textarea className={styled.textarea} id="descriptin" {...register("description")} defaultValue={infoCard.description || ''} readOnly={!isAuthorized}></textarea>
                    </div>
                    <div className={styled.divTarefas}>
                        <div className={styled.divTitleTarefas}>
                            <h2 className={styled.pDesc}>Tarefas</h2>
                        </div>
                        <div className={styled.divInput}>
                            <div className={styled.divAddTarefa}>
                                <input type="text" placeholder="Digite a nova tarefa" value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)} disabled={!isAuthorized}/>
                                <button type="button" onClick={handleCriarTarefa} disabled={!isAuthorized}>Criar</button>
                            </div>
                            <div className={styled.divUl}>
                                <ul className={styled.ul}>
                                    {tasksDB.map((tarefa: iTask, index: number) => (
                                        <li className={styled.li} key={index}>
                                            <div>
                                                <div>
                                                    <input type="checkbox" checked={tarefa.completed} onChange={() => handleCheckboxChange(index)} disabled={!isAuthorized}/> 
                                                    <label className={styled.newLabol} htmlFor={`tarefa-${index}`}>{tarefa.task}</label>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => excluirTarefa(index, tarefa.id)} disabled={!isAuthorized}>X</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={styled.divDesc}>
                        <p className={styled.pDesc}>Solução:</p>
                        <textarea className={styled.textarea} id="solution" {...register("solution")} defaultValue={infoCard.solution || ''} readOnly={!isAuthorized}></textarea>
                    </div>
                    {isAuthorized ? (
                        <div className={styled.divExcluir}>
                            <button type='submit' className={styled.salvar}>Salvar</button>
                            <button type='button' onClick={() => setConfirmacaoExclusao(true)} className={styled.excluir}>Excluir</button>
                            {confirmacaoExclusao && (
                                <span className={styled.spanExcluir}>
                                    <p className={styled.pExcluir}>Tem certeza que deseja Excluir?</p>
                                    <div className={styled.divSimNao}>
                                        <button className={styled.btnSim} type='button' onClick={() => confirmaExcluir(infoCard.id)}>Excluir</button>
                                        <button className={styled.btnNao} type='button' onClick={() => setConfirmacaoExclusao(false)}>Não Excluir</button>
                                    </div>
                                </span>
                            )}
                        </div>
                    ) : null }
                </form>
            </div>
        </section>
    );
    
};
