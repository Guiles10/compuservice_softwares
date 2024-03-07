import styled from './styles.module.scss';
import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContext } from '@/context/auth.context';
import { editaSchema, editaSchemaType } from '@/schema/registerUser.schema';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const EditaUser = () => {
    
    const { editeUser, setOpenEditUser, excluirUser, userSelect, isLoadingUser, setIsLoadingUser } = useContext(AuthContext);

////////////////////////////////////////////// FUNÇÕES //////////////////////////////////////////////
    const [selectedOptions, setSelectedOptions] = useState<string[]>(userSelect.function || []);
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const optionValue = event.target.value;
        if (selectedOptions.includes(optionValue)) {
            setSelectedOptions(selectedOptions.filter(option => option !== optionValue));
        } else {
            setSelectedOptions([...selectedOptions, optionValue]);
        }
    };
    
////////////////////////////////////////////// ADMIN //////////////////////////////////////////////
    const [isAdmin, setIsAdmin] = useState<boolean>(userSelect.isAdmin);
    const handleIsAdminChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setIsAdmin(checked); 
    };
    
////////////////////////////////////////////// PASSWORD //////////////////////////////////////////////
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const passwordsMatch = password === confirmPassword

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        name === 'password' ? setPassword(value) : setConfirmPassword(value);
    };

////////////////////////////////////////////// BTN EXLUIR //////////////////////////////////////////////
    const buttonExcluit = (idUser: string) => {
        setIsLoadingUser(true)
        excluirUser(idUser)
    }

////////////////////////////////////////////// FORM //////////////////////////////////////////////
    const { register, handleSubmit, formState: { errors } } = useForm<editaSchemaType>({
        resolver: zodResolver(editaSchema),
    });
    const onSubmit = (data: any) => {
        setIsLoadingUser(true)
        if(password == '' || password.length < 6){
            const dataForm = { ...data, function: selectedOptions, isAdmin: isAdmin};
            editeUser(dataForm, userSelect.id);
        } else {
            const dataForm = { ...data, function: selectedOptions, isAdmin: isAdmin, password: password };
            console.log(dataForm)
                editeUser(dataForm, userSelect.id);
        }
    };

    return (
        <section className={styled.modal}>
            <div className={styled.modalCard}>

                <div className={styled.divHeader}>
                    <p className={styled.pHeader}>Editar Usuario - {userSelect.name}</p>
                    <button className={styled.btnFecha} disabled={isLoadingUser} onClick={() => setOpenEditUser(false)}>Fechar</button>
                </div>

                <form className={styled.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styled.divName}>
                        <label htmlFor="">Nome:</label>
                        <input className={styled.input} id="name" type="text" defaultValue={userSelect.name} {...register("name")} placeholder="Nome do usuario"/>
                        {errors.name?.message && (<p className={styled.pError}>{errors.name.message}</p>)}
                    </div>

                    <div className={styled.divEmail}>
                        <label htmlFor="">E-mail:</label>
                        <input className={styled.input} id="email" type="text" defaultValue={userSelect.email} {...register("email")} placeholder="E-mail do Usuario"/>
                        {errors.email?.message && (<p className={styled.pError}>{errors.email.message}</p>)}
                    </div>

                    <div className={styled.divPassword}>
                        <div className={styled.divPass}>
                            <label htmlFor="password">Nova Senha:</label>
                            <div className={styled.passwordContainer}>
                                <input className={styled.input} id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Senha do Usuario" value={password} onChange={handleInputChange} />
                                <div className={styled.toggleButton} onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </div>
                            </div>
                        </div>

                        <div className={styled.divPassConf}>
                            <label htmlFor="confirmPassword">Confirma Nova Senha:</label>
                            <input className={styled.input} id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Confirmação da Senha" value={confirmPassword} onChange={handleInputChange} />
                            {!passwordsMatch && password && <p className={styled.pError}>As senhas não correspondem</p>}
                        </div>
                    </div>

                    <div className={styled.divType}>
                        <p className={styled.pTitle}>Setor de Trabalho:</p>
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
                            {/* Adicione outras opções de checkbox semelhantes aqui */}
                            {selectedOptions.length === 0 && (<p className={styled.pError}>Escolha ao menos um Setor</p>)}
                        </div>
                    </div>

                    <div className={styled.divIsAdmin}>
                        <label htmlFor="isAdmin">Usuario é Adiministrador? </label>
                        <div>
                            <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={handleIsAdminChange}/>
                            <p>SIM</p>
                        </div>
                    </div>

                    <div className={styled.divBtn}>
                        <button type='submit' className={!passwordsMatch || selectedOptions.length === 0 ? styled.disabled : styled.salvar} disabled={ !passwordsMatch  || selectedOptions.length == 0 || isLoadingUser}>Editar</button>
                        <button type='button' disabled={isLoadingUser} className={styled.excluir} onDoubleClick={() => buttonExcluit(userSelect.id)}>Excluir</button>
                    </div>
                </form>

            </div>
        </section>
    );    
};
