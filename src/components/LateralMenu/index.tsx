import styled from './styles.module.scss'

export const LateralMenu = () => {

    return (
        <section className={styled.lateralMenuMain}>
            <p className={styled.pMenu}>Supporte</p>
            <p className={styled.pMenu}>Programação</p>
            <p className={styled.pMenu}>Faturamento</p>
        </section>
    );
};