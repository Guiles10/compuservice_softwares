import styled from './styles.module.scss'

export const LateralMenu = ({ selectMenu }: any) => {
    return (
      <section className={styled.lateralMenuMain}>
        <p className={styled.pMenu} onClick={() => selectMenu('Supporte')}>
          Supporte
        </p>
        <p className={styled.pMenu} onClick={() => selectMenu('Programação')}>
          Programação
        </p>
        <p className={styled.pMenu} onClick={() => selectMenu('Faturamento')}>
          Faturamento
        </p>
      </section>
    );
  };