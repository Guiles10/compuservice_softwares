"use client";

import styled from './styles.module.scss'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginSchemaType } from "@/schema/login.schema";
import { AuthContext } from "@/context/auth.context";
import { useContext } from "react";
import Logo from '../assets/Logo Compuservice.png'
import Image from "next/image";


export default function Login() {
  const { loginFunction } = useContext(AuthContext);

  const { register, handleSubmit, formState: { errors }} = useForm<loginSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(loginSchema),
  });

  return (
      <section className={styled.secLogin}>
        <div className={styled.divLogin}>
            <figure className={styled.figure}>
                <Image src={Logo} width={240} height={150} alt="Logo Compuservice"/>
            </figure>
            <form className={styled.form} onSubmit={handleSubmit(loginFunction)}>
                <h1 className={styled.h1Login}>Login</h1>
                <div className={styled.divInput}>
                  <label className={styled.label} htmlFor="email">E-mail</label>
                  <input className={styled.input} id="email" type="text" {...register("email")} placeholder="Digite seu e-mail aqui"/>
                  {errors.email?.message && ( <p className={styled.pError}>{errors.email.message}</p> )}
                </div>
                <div className={styled.divInput}>
                  <label className={styled.label} htmlFor="password">Senha</label>
                  <input className={styled.input} id="password" type="password" {...register("password")} placeholder="Digite seu senha aqui"/>
                  {errors.password?.message && (<p className={styled.pError}>{errors.password.message}</p>)}
                </div>
                <button className={styled.btnLogar} type="submit">Entrar</button>
            </form>
        </div>
      </section>
  );
}