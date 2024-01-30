import React, { useContext, useState } from 'react';
import styled from './styles.module.scss';
import { CommentContext, iComment } from '@/context/comment.context';
import { CommentCard } from './CommentCards';
import { commentSchema, commentSchemaType } from '@/schema/comment.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface iFilter {
  date: string;
  creator: string;
  comment: string;
}

export const SectionComments = () => {

  const { allCommentsSup, creatComment } = useContext(CommentContext);

  const [menuAberto, setMenuAberto] = useState(false);

  const [filter, setFilter] = useState<iFilter>({ date: '', creator: '', comment: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filterComments = (comments: iComment[]) => {
    return comments
      .filter(
        (item) =>
          item.createdAt?.includes(filter.date) &&
          item.user?.name?.toLowerCase().includes(filter.creator.toLowerCase()) &&
          item.comment?.toLowerCase().includes(filter.comment.toLowerCase())
      )
  };

  const sortedComments = filterComments(allCommentsSup);

  const convertStringToDate = (dateString: string) => {
    const [day, month, year, time] = dateString.split(/\/|\s/);
    const [hour, minute, second] = time.split(':');
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second));
  };

  sortedComments.sort((a, b) => {
    const dateA = convertStringToDate(a.createdAt!);
    const dateB = convertStringToDate(b.createdAt!);
    return dateB.getTime() - dateA.getTime();
  });

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
                <p>Título:</p>
                <input placeholder="Digite um Título " value={filter.comment} onChange={(e) => setFilter({ ...filter, comment: e.target.value })}/>
              </div>
              <div className={styled.divShareInput}>
                <p>Criador:</p>
                <input  placeholder="Digite um Nome" value={filter.creator} onChange={(e) => setFilter({ ...filter, creator: e.target.value })}/>
              </div>
              <div className={styled.divShareInput}>
                <p>Data:</p>
                <input  placeholder="Digite uma Data" value={filter.date} onChange={(e) => setFilter({ ...filter, date: e.target.value })}/>
              </div>
            </div>
          </div>
        )}

      </div>

      {isFormOpen && (
        <form className={styled.formCriaComment} onSubmit={handleSubmit(onSubmit)}>
          <div className={styled.divComment}>
            <textarea className={styled.textareaCriaComment} {...register('comment')} />
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