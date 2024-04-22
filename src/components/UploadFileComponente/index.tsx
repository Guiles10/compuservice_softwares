import styled from './styles.module.scss';
import { CardsContext, iCard, iFiles } from '@/context/cards.context';
import { useContext, useRef, useState } from 'react';

interface iUploadFileComponente{
    infoCard: iCard,
    isAuthorized: boolean,
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}
export const UploadFileComponente = ({ infoCard, isAuthorized, isLoading, setIsLoading }: iUploadFileComponente) => {
    const { uploadFile, deleteFile } = useContext(CardsContext);

    const [selectedFileName, setSelectedFileName] = useState('');
    const [fileSelected, setFileSelected] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = () => {
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
            const file = fileInputRef.current.files[0];
            setSelectedFileName(file.name);
            setFileSelected(true);
        } else {
            setSelectedFileName('');
            setFileSelected(false);
        }
    };

    const handleFileUpload = () => {
        if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
            const file = fileInputRef.current.files[0];
            setSelectedFileName('');
            setFileSelected(false);
            setIsLoading(true)
            uploadFile(file, infoCard.id);
        }
    };

    const handleFileDelete = (fileName: string, fileId: string) => {
        deleteFile(fileName, infoCard.id);
        setIsLoading(true)
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <section className={styled.secFile}>
            <p className={styled.pDesc}>Selecionar Arquivo:</p>
            <div className={styled.divAddFile}>
                <input className={styled.inputFile} type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} disabled={isLoading}/>
                {isAuthorized && (
                    <button className={styled.btnSelectFile} type="button" onClick={handleButtonClick} disabled={isLoading}>Selecionar Arquivo</button>
                )}
                {selectedFileName &&
                    <div className={styled.divSpan}>
                        <span className={styled.span}>Arquivo:</span>
                        <span className={styled.spanFile}> - {selectedFileName}</span>
                    </div>
                }
                {isAuthorized && (
                    <button className={styled.btnSalveFile} type='button' onClick={handleFileUpload} disabled={!fileSelected  || isLoading}>
                        {isLoading ? 'Carregando...' : 'Salvar'} 
                    </button>
                )}
            </div>

            <div className={styled.divAllFile}>
                {infoCard.files.map((file: iFiles) => (
                    <div className={styled.divFile} key={file.id}>
                        <p className={styled.fileName} >{file.fileName} </p>
                        <div>
                            <a className={styled.fileLink} href={file.url} target="_blank" rel="noopener noreferrer" style={{ pointerEvents: isLoading ? 'none' : 'auto'}}>
                                Visualizar
                            </a>
                            {isAuthorized && (
                                <button className={styled.fileExcluir} type='button' disabled={ isLoading} onDoubleClick={() => handleFileDelete(file.fileName, file.id)}>
                                    {isLoading ? 'Excluindo...' : 'Excluir'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
