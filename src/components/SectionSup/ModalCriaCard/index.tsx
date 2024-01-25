import styled from './styles.module.scss'
import { SupContext, iDataForm } from '@/context/sup.context';
import { useContext, useState } from 'react';
import { supCardSchema, supCardSchemaType } from '@/schema/supCard.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const ModalCriaCards = () => {

    const { setOpenModal, creatCardSup } = useContext(SupContext);

    const [novaTarefa, setNovaTarefa] = useState('');
    const [tarefas, setTarefas] = useState<string[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<supCardSchemaType>({
        resolver: zodResolver(supCardSchema),
      });
    
    const onSubmit = (dataForm: iDataForm) => {
        creatCardSup(dataForm, tarefas)
        setOpenModal(false)
    };

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
                    <div className={styled.divSelect}>
                        <p className={styled.pDesc}>Urgencia: </p>
                        <select className={styled.select} id="opcoes" {...register('priority')}>
                            <option value="Basica">Basica</option>
                            <option value="Normal">Normal</option>
                            <option value="Urgente">Urgente</option>
                            <option value="Muito Urgente">Muito Urgente</option>
                        </select>
                    </div>
                    <div className={styled.divDesc}>
                        <p className={styled.pDesc}>Descrição</p>
                        <div>
                            <textarea className={styled.textarea} id="descriptin" {...register("description")} placeholder="Digite a descrição"/>
                        </div>
                    </div>
                    <div className={styled.divTarefas}>
                        <div className={styled.divTitleTarefas}>
                            <h2 className={styled.pDesc}>Tarefas</h2>
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
                    <div className={styled.divDesc}>
                        <p className={styled.pDesc}>Solução</p>
                        <div>
                            <textarea className={styled.textarea} id="solution" {...register("solution")} placeholder="Digite a solução"/>
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