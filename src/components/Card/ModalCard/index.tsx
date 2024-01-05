import { ContextAtividade, iCard } from '@/context/context';
import styled from './styles.module.scss'
import { useContext, useState } from 'react';

export const ModalCards = ({ item }: { item: iCard }) => {

    const { setOpenModal, excluirCard } = useContext(ContextAtividade);

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
        setConfirmacaoExclusao(false); // Resetar a confirmação após a exclusão
      };

    
    return (
        <section className={styled.modal}>
            <div  className={styled.modalCard}>
                <div className={styled.divHeader}>
                    <h1>{item.title}</h1>
                    <button onClick={() => setOpenModal(false)}>Fechar</button>
                </div>
                <div className={styled.divDesc}>
                    <textarea className={styled.textarea}>{item.description}</textarea>
                </div>
                <div className={styled.divTarefas}>
                    <div className={styled.divTitleTarefas}>
                        <h2 className={styled.h2Tarefas}>Tarefas</h2>
                    </div>
                    <div className={styled.divInput}>
                        <div className={styled.divAddTarefa}>
                            <input type="text" value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)} placeholder="Digite a nova tarefa"/>
                            <button onClick={adicionarTarefa}>criar</button>
                        </div>
                        <div className={styled.divUl}>
                            <ul className={styled.ul}>
                                {tarefas.map((tarefa, index) => (
                                    <li className={styled.li} key={index}>
                                        <div>
                                            <input type="checkbox" id={`tarefa-${index}`}/>
                                            <label htmlFor={`tarefa-${index}`}>{tarefa}</label>
                                        </div>
                                        <button onClick={() => excluirTarefa(index)}>X</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styled.divExcluir}>
                    <button onClick={() => setConfirmacaoExclusao(true)} className={styled.excluir}>Excluir</button>
                    {confirmacaoExclusao && (
                        <span className={styled.spanExcluir}>
                            Tem certeza que deseja Excluir?
                            <div>
                                <button onClick={() => excluirCard(item)}>Sim</button>
                                <button onClick={() => setConfirmacaoExclusao(false)}>Não</button>
                            </div>
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
};