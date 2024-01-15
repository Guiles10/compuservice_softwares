import styled from './styles.module.scss'
import { useContext, useState } from 'react';
import { SupContext, iCardSup, iDataForm } from '@/context/sup.context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { supEditCardSchema, supEditCardSchemaType } from '@/schema/supCard.schema';
import { Dispatch, SetStateAction } from 'react';


export const ModalEditCard = ({ infoCard, setOpenModalEdit }:{ infoCard: iCardSup, setOpenModalEdit: Dispatch<SetStateAction<boolean>> }) => {

    const { excluirSupCard, editarCard } = useContext(SupContext);
    
    const tasksinfoCard: string[] = infoCard.tasks!
    const [tarefas, setTarefas] = useState<string[]>(tasksinfoCard);
    const [novaTarefa, setNovaTarefa] = useState('');
    const handleCriarTarefa = () => {
        if (novaTarefa.trim() !== '') {
        const tarefasAtualizadas: any = [...tarefas, novaTarefa];
        setTarefas(tarefasAtualizadas);
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


    const { register, handleSubmit, formState: { errors } } = useForm<supEditCardSchemaType>({
        resolver: zodResolver(supEditCardSchema),
    });
    const onSubmit = (dataForm: iDataForm) => {
        dataForm.tasks = tarefas
        editarCard(infoCard, dataForm)
        setOpenModalEdit(false)
    };


    return (
        <section className={styled.modal}>
            <form className={styled.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styled.modalCard}>
                     <div className={styled.divHeader}>
                        <h1>{infoCard.title}</h1>
                        <button type='button' onClick={() => setOpenModalEdit(false)}>Fechar</button>
                    </div>
                   <div className={styled.divDesc}>
                        <textarea className={styled.textarea} id="descriptin" {...register("description")} defaultValue={infoCard.description || ''}></textarea>
                    </div>
                    <div className={styled.divTarefas}>
                        <div className={styled.divTitleTarefas}>
                            <h2 className={styled.h2Tarefas}>Tarefas</h2>
                        </div>
                        <div className={styled.divInput}>
                            <div className={styled.divAddTarefa}>
                                <input type="text" placeholder="Digite a nova tarefa" value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)}/>
                                <button type="button" onClick={handleCriarTarefa}>Criar</button>
                            </div>
                            <div className={styled.divUl}>
                                <ul className={styled.ul}>
                                    {tarefas.map((tarefa, index) => (
                                        <li className={styled.li} key={tarefa}>
                                            <div>
                                                <input type="checkbox" id={`tarefa-${index}`}/>
                                                <label className={styled.newLabol} htmlFor={`tarefa-${index}`}>{tarefa}</label>
                                            </div>
                                            <button type='button' onClick={() => excluirTarefa(index)}>X</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={styled.divDesc}>
                        <p className={styled.pDesc}>Solução</p>
                        <div>
                            <textarea className={styled.textarea} id="solution" {...register("solution")} defaultValue={infoCard.solution || ''}></textarea>
                        </div>
                    </div>
                    <div>
                        <select id="opcoes" {...register('priority')} defaultValue={infoCard.priority || 'Normal'}>
                            <option value="Muito Urgente">Muito Urgente</option>
                            <option value="Urgente">Urgente</option>
                            <option value="Normal">Normal</option>
                            <option value="Basica">Basica</option>
                        </select>
                    </div>
                    <div className={styled.divExcluir}>
                        <button type='submit' className={styled.salvar}>Salvar</button>
                        <button type='button' onClick={() => setConfirmacaoExclusao(true)} className={styled.excluir}>Excluir</button>
                        {confirmacaoExclusao && (
                            <span className={styled.spanExcluir}>
                                Tem certeza que deseja Excluir?
                                <div>
                                    <button type='button' onClick={() => excluirSupCard(infoCard.id)}>Sim</button>
                                    <button type='button' onClick={() => setConfirmacaoExclusao(false)}>Não</button>
                                </div>
                            </span>
                        )}
                    </div>
                </div>
            </form>
        </section>
    );
};