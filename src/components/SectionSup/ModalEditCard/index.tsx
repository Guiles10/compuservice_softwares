import styled from './styles.module.scss'
import { useContext, useState } from 'react';
import { SupContext, iCardSup, iDataForm, iTask } from '@/context/sup.context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { supEditCardSchema, supEditCardSchemaType } from '@/schema/supCard.schema';
import { Dispatch, SetStateAction } from 'react';
import { AuthContext } from '@/context/auth.context';


export const ModalEditCard = ({ infoCard, setOpenModalEdit }:{ infoCard: iCardSup, setOpenModalEdit: Dispatch<SetStateAction<boolean>> }) => {

    const { allUser, userId } = useContext(AuthContext);
    const { excluirSupCard, editarCard, excluirTask } = useContext(SupContext);

    const isWorker = infoCard.workers && infoCard.workers.some((worker: any) => worker.id === userId);
    const isOwner = infoCard.userId === userId;
    const authorized = isWorker || isOwner;

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
        if (authorized) {
            excluirSupCard(cardId)
            setOpenModalEdit(false)
        }
    }

    const excluirTarefa = (index: number, id: any | undefined) => {
        const novaListaTarefas = [...tasksDB];
        novaListaTarefas.splice(index, 1);
        if(id){
            excluirTask(id)
        }
        setTasksDB(novaListaTarefas);
    };
    
    const [workersApi, setWorkersApi] = useState<any | []>(infoCard.workers! || []);
    const [selectedUserIds, setSelectedUserIds] = useState<any>([]);
    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = event.target.value;
        if (userId !== '') {
            if (!selectedUserIds.includes(userId)) {
                if (!workersApi.some((user: any) => user.id === userId)) {
                    setSelectedUserIds([...selectedUserIds, userId]);
                }
            }
        }
    };

    const handleRemoveUser = (userIdToRemove: string) => {
        const updatedSelectedUserIds = selectedUserIds.filter((id: any) => id !== userIdToRemove);
        setSelectedUserIds(updatedSelectedUserIds);
    };

    const handleRemoveUserAPI = (userIdToRemove: string) => {
        const updatedWorkersApi: any = workersApi.filter((user: any) => user.id !== userIdToRemove);
        setWorkersApi(updatedWorkersApi);
    }

    const { register, handleSubmit, formState: { errors } } = useForm<supEditCardSchemaType>({
        resolver: zodResolver(supEditCardSchema),
    });

    const onSubmit = (form: iDataForm) => {
        const allIds = workersApi.map((user: any) => user.id);
        const combinedArray = [...allIds, ...selectedUserIds];
        const dataForm = { ...form, workers: combinedArray };
        editarCard(infoCard.id, dataForm, tasksDB);
        setOpenModalEdit(false);
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
                    {!authorized && (
                        <p className={styled.pAuthorized}>Você não é autorizado a fazer edições</p>
                    )}
                    <div className={styled.divSelect}>
                        <div className={styled.divPriority}>
                            <p className={styled.pDesc}>Prioridade: </p>
                            <select className={styled.select} id="opcoes" {...register('priority')} defaultValue={infoCard.priority || 'Normal'} disabled={!authorized}>
                                <option value="Basica">Basica</option>
                                <option value="Normal">Normal</option>
                                <option value="Urgente">Urgente</option>
                                <option value="Muito Urgente">Muito Urgente</option>
                            </select>
                        </div>
    
                        <div className={styled.divWorkes}>
                            <div className={styled.divWorkesUser}>
                                <p>Usuário:</p>
                                <div className={styled.divUserSelect}>
                                    <select className={styled.select} onBlur={handleUserChange} disabled={!authorized}>
                                        <option value=''> - Selecionar - </option>
                                        {allUser && allUser
                                            .filter(user => user.id !== infoCard.userId)
                                            .map(user => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))
                                        }
                                    </select>
                                    <button type='button' disabled={!authorized}>Add</button>
                                </div>
                            </div>
                            <div className={styled.divWorkesUserAPI}>
                                <p>Autorizados:</p>
                                <div key={userId} className={styled.divNameWorkes}>
                                    <p>{infoCard.user.name}</p>
                                </div>
                                {workersApi.map((user: any) => (
                                    <div key={user.id} className={styled.divNameWorkes}>
                                        <p>{user.name}</p>
                                        <button type='button' onClick={() => handleRemoveUserAPI(user.id)} disabled={!authorized}>X</button>
                                    </div>
                                ))}
                                {selectedUserIds.map((userId: any) => (
                                    <div key={userId} className={styled.divNameWorkes}>
                                        {allUser!.find((user: any) => user.id === userId)?.name}
                                        <button type='button' onClick={() => handleRemoveUser(userId)} disabled={!authorized}>X</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
    
                    <div className={styled.divDesc}>
                        <p className={styled.pDesc}>Descrição</p>
                        <textarea className={styled.textarea} id="descriptin" {...register("description")} defaultValue={infoCard.description || ''} readOnly={!authorized}></textarea>
                    </div>
                    <div className={styled.divTarefas}>
                        <div className={styled.divTitleTarefas}>
                            <h2 className={styled.pDesc}>Tarefas</h2>
                        </div>
                        <div className={styled.divInput}>
                            <div className={styled.divAddTarefa}>
                                <input type="text" placeholder="Digite a nova tarefa" value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)} disabled={!authorized}/>
                                <button type="button" onClick={handleCriarTarefa} disabled={!authorized}>Criar</button>
                            </div>
                            <div className={styled.divUl}>
                                <ul className={styled.ul}>
                                    {tasksDB.map((tarefa: iTask, index: number) => (
                                        <li className={styled.li} key={index}>
                                            <div>
                                                <div>
                                                    <input type="checkbox" checked={tarefa.completed} onChange={() => handleCheckboxChange(index)} disabled={!authorized}/> 
                                                    <label className={styled.newLabol} htmlFor={`tarefa-${index}`}>{tarefa.task}</label>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => excluirTarefa(index, tarefa.id)} disabled={!authorized}>X</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={styled.divDesc}>
                        <p className={styled.pDesc}>Solução</p>
                        <textarea className={styled.textarea} id="solution" {...register("solution")} defaultValue={infoCard.solution || ''} readOnly={!authorized}></textarea>
                    </div>
                    {authorized ? (
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
