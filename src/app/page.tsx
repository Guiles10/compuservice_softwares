
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import styled from './styles.module.scss'
import { LateralMenu } from "@/components/LateralMenu";
import { Atividades } from "@/components/Atividades";

export default function Home() {

  return (
    <main className={styled.main}>
      <Header/>
      <section className={styled.secBody}>
        <LateralMenu />
        <Atividades/>
      </section>
      <Footer/>
    </main>
  )
}
