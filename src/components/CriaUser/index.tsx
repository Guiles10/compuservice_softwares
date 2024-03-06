import styled from './styles.module.scss';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContext } from '@/context/auth.context';
import { registerSchema, registerSchemaType } from '@/schema/registerUser.schema';

import { FaEye, FaEyeSlash } from 'react-icons/fa';



export const CriaUser = () => {
    const { registerUser, setOpenRegisterUser } = useContext(AuthContext);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const optionValue = event.target.value;
        if (selectedOptions.includes(optionValue)) {
            setSelectedOptions(selectedOptions.filter(option => option !== optionValue));
        } else {
            setSelectedOptions([...selectedOptions, optionValue]);
        }
    };
    
    const handleIsAdminChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setIsAdmin(checked); 
    };

    const { register, handleSubmit, formState: { errors }, watch } = useForm<registerSchemaType>({
        resolver: zodResolver(registerSchema),
    });
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    const onSubmit = (data: any) => {
        const dataForm = { ...data, function: selectedOptions, isAdmin: isAdmin };
        registerUser(dataForm);
    };

    return (
        <section className={styled.modal}>
            <div className={styled.modalCard}>

                <div className={styled.divHeader}>
                    <p className={styled.pHeader}>Cadastrar Usuario</p>
                    <button className={styled.btnFecha} onClick={() => setOpenRegisterUser(false)}>Fechar</button>
                </div>

                <form className={styled.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styled.divName}>
                        <label htmlFor="">Nome:</label>
                        <input className={styled.input} id="name" type="text" {...register("name")} placeholder="Nome do usuario"/>
                        {errors.name?.message && (<p className={styled.pError}>{errors.name.message}</p>)}
                    </div>

                    <div className={styled.divEmail}>
                        <label htmlFor="">E-mail:</label>
                        <input className={styled.input} id="email" type="text" {...register("email")} placeholder="E-mail do Usuario"/>
                        {errors.email?.message && (<p className={styled.pError}>{errors.email.message}</p>)}
                    </div>

                    <div className={styled.divPass}>
                        <label htmlFor="password">Senha:</label>
                        <div className={styled.passwordContainer}>
                            <input className={styled.input} id="password" type={showPassword ? "text" : "password"} {...register("password")} placeholder="Senha do Usuario"/>
                            <div className={styled.toggleButton} onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </div>
                        </div>
                        {errors.password?.message && (<p className={styled.pError}>{errors.password.message}</p>)}
                    </div>


                    <div className={styled.divPassConf}>
                        <label htmlFor="confirmPassword">Confirma Senha:</label>
                        <input className={styled.input} id="confirmPassword" type={showPassword ? "text" : "password"} {...register("confirmPassword")} placeholder="Confirmação da Senha"/>
                        {password !== confirmPassword && <p className={styled.pError}>As senhas não correspondem</p>}
                    </div>

                    <div className={styled.divType}>
                        <p className={styled.pDesc}>Setor de Trabalho:</p>
                        <div className={styled.checkboxContainer}>
                            <label>
                                <input type="checkbox" value="Atendimento" checked={selectedOptions.includes('Atendimento')} onChange={handleCheckboxChange}/>Atendimento
                            </label>
                            <label>
                                <input type="checkbox" value="Suporte" checked={selectedOptions.includes('Suporte')} onChange={handleCheckboxChange}/>Suporte
                            </label>
                            <label>
                                <input type="checkbox" value="Programação" checked={selectedOptions.includes('Programação')} onChange={handleCheckboxChange}/>Programação
                            </label>
                            <label>
                                <input type="checkbox" value="Faturamento" checked={selectedOptions.includes('Faturamento')} onChange={handleCheckboxChange}/>Faturamento
                            </label>
                            <label>
                                <input type="checkbox" value="Suporte Hospital" checked={selectedOptions.includes('Suporte Hospital')} onChange={handleCheckboxChange}/>Suporte Hospital
                            </label>
                            <label>
                                <input type="checkbox" value="Instalação" checked={selectedOptions.includes('Instalação')} onChange={handleCheckboxChange}/>Instalação
                            </label>
                            {selectedOptions.length === 0 && (<p className={styled.pError}>Escolha ao menos um Setor</p>)}
                        </div>
                    </div>

                    <div className={styled.divIsAdmin}>
                        <label htmlFor="isAdmin">Usuario é Adiministrador: </label>
                        <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={handleIsAdminChange} />
                    </div>

                    <div className={styled.divSalvar}>
                        <button type='submit' className={styled.salvar}>Cadastrar</button>
                    </div>
                </form>

            </div>
        </section>
    );    
};

