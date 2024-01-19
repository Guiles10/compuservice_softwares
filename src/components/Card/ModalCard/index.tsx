import styled from './styles.module.scss'
import { useContext, useState } from 'react';
import { SupContext, iCardSup, iDataForm, iTask } from '@/context/sup.context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { supEditCardSchema, supEditCardSchemaType } from '@/schema/supCard.schema';
import { Dispatch, SetStateAction } from 'react';


export const ModalEditCard = ({ infoCard, setOpenModalEdit }:{ infoCard: iCardSup, setOpenModalEdit: Dispatch<SetStateAction<boolean>> }) => {

    const { excluirSupCard, editarCard, excluirTask } = useContext(SupContext);

    
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

    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);
    const confirmaExcluir = (cardId: string)=> {
        excluirSupCard(cardId)
        setOpenModalEdit(false)
    }

    const excluirTarefa = (index: number, id: any | undefined) => {
        const novaListaTarefas = [...tasksDB];
        novaListaTarefas.splice(index, 1);
        if(id){
            excluirTask(id)
        }
        setTasksDB(novaListaTarefas);
    };

    const { register, handleSubmit, formState: { errors } } = useForm<supEditCardSchemaType>({
        resolver: zodResolver(supEditCardSchema),
    });
    const onSubmit = (dataForm: iDataForm) => {
        editarCard(infoCard.id, dataForm, tasksDB)
        setOpenModalEdit(false)
    };

    return (
        <section className={styled.modal}>
            <div className={styled.modalCard}>
                <form className={styled.form} onSubmit={handleSubmit(onSubmit)}>
                     <div className={styled.divHeader}>
                        <h1 className={styled.title}>{infoCard.title}</h1>
                        <button className={styled.btnFecha} type='button' onClick={() => setOpenModalEdit(false)}>Fechar</button>
                    </div>
                    <div className={styled.divNomeData}>
                        <h3 className={styled.h3Name}>{infoCard.user?.name}</h3>
                        <h3 className={styled.h3Data}>{infoCard.createdAt}</h3>
                    </div>
                    <div className={styled.divSelect}>
                        <p className={styled.pDesc}>Urgencia: </p>
                        <select className={styled.select} id="opcoes" {...register('priority')} defaultValue={infoCard.priority || 'Normal'}>
                            <option value="Basica">Basica</option>
                            <option value="Normal">Normal</option>
                            <option value="Urgente">Urgente</option>
                            <option value="Muito Urgente">Muito Urgente</option>
                        </select>
                    </div>
                    <div className={styled.divDesc}>
                        <p className={styled.pDesc}>Descrição</p>
                        <textarea className={styled.textarea} id="descriptin" {...register("description")} defaultValue={infoCard.description || ''}></textarea>
                    </div>
                    <div className={styled.divTarefas}>
                        <div className={styled.divTitleTarefas}>
                            <h2 className={styled.pDesc}>Tarefas</h2>
                        </div>
                        <div className={styled.divInput}>
                            <div className={styled.divAddTarefa}>
                                <input type="text" placeholder="Digite a nova tarefa" value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)}/>
                                <button type="button" onClick={handleCriarTarefa}>Criar</button>
                            </div>
                            <div className={styled.divUl}>
                                <ul className={styled.ul}>
                                    {tasksDB.map((tarefa: iTask, index: number) => (
                                        <li className={styled.li} key={index}>
                                            <div>
                                                <div>
                                                <input type="checkbox" checked={tarefa.completed} onChange={() => handleCheckboxChange(index)}/> 
                                                 <label className={styled.newLabol} htmlFor={`tarefa-${index}`}>{tarefa.task}</label>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => excluirTarefa(index, tarefa.id)}>X</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={styled.divDesc}>
                        <p className={styled.pDesc}>Solução</p>
                        <textarea className={styled.textarea} id="solution" {...register("solution")} defaultValue={infoCard.solution || ''}></textarea>
                    </div>
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
                </form>
            </div>
        </section>
    );
};
