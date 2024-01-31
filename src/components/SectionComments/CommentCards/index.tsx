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

  const isOwner = item.userId === userId;
  const authorized = isOwner;

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

  const headerButtons = (
    <div className={styled.divBtn}>
      {authorized && !modoEdicao && (
        <div className={styled.divEditExclui}>
          <button className={styled.btnEdita} type='button' onClick={() => setModoEdicao(true)}>Editar</button>
          <button type='button' onClick={exibirConfirmacaoExclusao} className={styled.btnExclui}>Excluir</button>
        </div>
      )}
      {confirmacaoExclusao && (
        <span className={styled.spanExcluir}>
          <p className={styled.pExcluir}>Deseja Excluir?</p>
          <div className={styled.divSimNao}>
            <button className={styled.btnSim} type='button' onClick={() => confirmaExcluir(item.id!)}>Excluir</button>
            <button className={styled.btnNao} type='button' onClick={() => setConfirmacaoExclusao(false)}>Não</button>
          </div>
        </span>
      )}
    </div>
  );

  return (
    <section className={styled.secComment}>
      <div className={styled.divHeaderComment}>
        <div className={styled.divInfo}>
          <div className={styled.divName}>
            <p className={styled.pName}>{item.user!.name}</p>
            <div>
              <p className={styled.pData}>{item.createdAt!.slice(0, 10)}</p>
              <p className={styled.pData}>{item.updatedAt!.slice(0, 10)}</p>
            </div>
          </div>
          {headerButtons}
        </div>
      </div>

      {!modoEdicao ? (
        <>
          <div className={styled.divComment}>
            <textarea className={styled.textareaComment} value={item.comment} readOnly />
          </div>
        </>
      ) : (
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
      )}
    </section>
  );
};
