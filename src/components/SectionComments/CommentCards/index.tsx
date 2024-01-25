import styled from './styles.module.scss';
import { useContext, useState } from 'react';
import { CommentContext, iComment } from '@/context/comment.context';
import { editCommentSchema, editCommentSchemaType } from '@/schema/comment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AuthContext } from '@/context/auth.context';

export const CommentCard = ({ item }: { item: iComment }) => {
  
  const { userId, token } = useContext(AuthContext);
  const { editarComment, excluirComment} = useContext(CommentContext);


  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState(false);
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);
  const [novoComment, setNovoComment] = useState<string>(item.comment);

  const exibirConfirmacaoExclusao = () => {
    setConfirmacaoExclusao(true);
  };

  const confirmaExcluir = (commentId: string) => {
    excluirComment(commentId);
    setConfirmacaoExclusao(false);
  };

  const { register, handleSubmit, formState: { errors } } = useForm<editCommentSchemaType>({
    resolver: zodResolver(editCommentSchema),
  });

  const onSubmit = (dataForm: iComment) => {
    editarComment(item.id!, dataForm);
    setModoEdicao(false);
  };

  let renderContent;
  if (!modoEdicao) {
    renderContent = (
      <>
       <div className={styled.divComment}>
          <textarea className={styled.textareaComment} value={item.comment} readOnly />
        </div>
        <div className={styled.divBtn}>
          {confirmacaoExclusao && (
            <span className={styled.spanExcluir}>
              <p className={styled.pExcluir}>Tem certeza que deseja Excluir?</p>
              <div className={styled.divSimNao}>
                <button className={styled.btnSim} type='button' onClick={() => confirmaExcluir(item.id!)}>Excluir</button>
                <button className={styled.btnNao} type='button' onClick={() => setConfirmacaoExclusao(false)}>Não Excluir</button>
              </div>
            </span>
          )}
          {userId === item.userId && (
          <>
              <button className={styled.btnEdita} type='button' onClick={() => setModoEdicao(true)}>Editar</button>
              <button type='button' onClick={exibirConfirmacaoExclusao} className={styled.btnExclui}>Excluir</button>
            </>
          )}
        </div>
       
      </>
    );
  } else {
    renderContent = (
      <form onSubmit={handleSubmit(onSubmit)}>
       <div className={styled.divComment}>
          <textarea className={styled.textareaEditComment} value={novoComment} {...register('comment')} onChange={(e) => setNovoComment(e.target.value)} />
          {errors.comment?.message && (<p className={styled.pError}>{errors.comment.message}</p>)}
        </div>
        <div className={styled.divBtnEdite}>
          <button className={styled.btnSalvar} type='submit'>Salvar</button>
          <button className={styled.btnCancelar} type='button' onClick={() => setModoEdicao(false)}>Cancelar</button>
        </div>
      </form>
    );
  }

  return (
    <section className={styled.secComment}>
      <div className={styled.divHeaderComment}>
        <div className={styled.divInfo}>
          <div className={styled.divName}>
            <p className={styled.pName}>{item.user!.name}</p>
            <p className={styled.pData}>Criado: {item.createdAt!.slice(0, 10)} - {item.createdAt!.slice(10, -3)}</p>
            <p className={styled.pData}>Editado: {item.updatedAt!.slice(0, 10)} - {item.updatedAt!.slice(10, -3)}</p>
          </div>
          <div className={styled.divDate}>
          </div>
        </div>
      </div>
      {renderContent}
    </section>
  );
};
