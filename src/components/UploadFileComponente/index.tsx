import styled from './styles.module.scss'

import { AuthContext } from '@/context/auth.context';
import { CardsContext } from '@/context/cards.context';
import { useContext, useRef } from 'react';


export const UploadFileComponente = () => {

    const { infoUser, logout } = useContext(AuthContext);
    const { getFile, uploadFile, docUrl } = useContext(CardsContext);


    const fileInputRef = useRef<any>(null);

    const handleFileUpload = () => {
        const file = fileInputRef.current.files[0];
        uploadFile(file);
    };

    const UrlFile = docUrl
    return (
        <section>
            <div>
                <input type="file" ref={fileInputRef} />
                <button type='button' onClick={handleFileUpload}>Enviar Arquivo</button>
            </div>

            <div>
                <button type='button' onClick={() => getFile('anexo01.jpg')}>LIONS.pdf</button>
            </div>
            {docUrl && (
                <a href={UrlFile} target="_blank" rel="noopener noreferrer">Aqui</a>
            )}
        </section>
    );
};