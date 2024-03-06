import React, { useContext, useState } from 'react';
import styled from './styles.module.scss';
import { CommentContext, iComment } from '@/context/comment.context';
import { CommentCard } from './CommentCards';
import { commentSchema, commentSchemaType } from '@/schema/comment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface iFilter {
  search: string;
}

export const SectionComments = () => {

  const { allCommentsSup, creatComment } = useContext(CommentContext);
  
  const [menuAberto, setMenuAberto] = useState(false);
  const [filter, setFilter] = useState<iFilter>({ search: '' });

  const [isFormOpen, setIsFormOpen] = useState(false);

  const filterComments = (comments: iComment[]) => {
    return comments.filter(
      (item) =>
        item.createdAt?.includes(filter.search) || // Mudança: Buscar em todos os campos
        item.user?.name?.toLowerCase().includes(filter.search.toLowerCase()) ||
        item.comment?.toLowerCase().includes(filter.search.toLowerCase())
    );
  };

  const sortedComments = filterComments(allCommentsSup);

  const { register, handleSubmit, formState: { errors } } = useForm<commentSchemaType>({
    resolver: zodResolver(commentSchema),
  });
  
  const onSubmit = (dataForm: any) => {
    creatComment(dataForm);
    setIsFormOpen(false);
  };

  return (
    <section className={styled.secComm}>
      <div className={styled.divTitleHeaderComm}>

        <div className={styled.TitleBtn}>
          <div className={styled.divTitleComm}>
            <h1 className={styled.h1Title}>CHAT</h1>
            <button className={styled.btnCriar} onClick={() => setIsFormOpen(true)}>Comentar</button>
            <button className={styled.btnCriar} onClick={() => setMenuAberto(!menuAberto)}>{menuAberto ? 'X' : 'Filtrar'}</button>
          </div>
        </div>

        {menuAberto && (
          <div className={styled.divShareComm}>
            <div className={styled.divInputs}>
              <div className={styled.divShareInput}>
                <p>Pesquisa:</p>
                <input placeholder="Digite um Título, Nome ou Data" value={filter.search} onChange={(e) => setFilter({ search: e.target.value })}/>
              </div>
            </div>
          </div>
        )}

      </div>

      {isFormOpen && (
        <form className={styled.formCriaComment} onSubmit={handleSubmit(onSubmit)}>
          <div className={styled.divTitleComment}>
            <input className={styled.criaTitleComm} {...register('title')}  placeholder="Digite o título" />
            {errors.title?.message && (<p className={styled.pError}>{errors.title.message}</p> )}
          </div>
          <div className={styled.divComment}>
            <textarea className={styled.textareaCriaComment} {...register('comment')}  placeholder="Digite o comentário..." />
            {errors.comment?.message && (<p className={styled.pError}>{errors.comment.message}</p> )}
          </div>
          <div className={styled.divBtn}>
            <button className={styled.btnSalvar} type="submit">Salvar</button>
            <button className={styled.btnCancelar} type="button" onClick={() => { setIsFormOpen(false)}}>Cancelar</button>
          </div>
        </form>
      )}

      {sortedComments.map((item: iComment) => (<CommentCard key={item.id} item={item} />))}

    </section>
  );
};
