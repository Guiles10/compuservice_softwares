import styled from './styles.module.scss';
import { CardsContext, iCard, iFiles } from '@/context/cards.context';
import { useContext, useRef, useState } from 'react';

interface iUploadFileComponente{
    infoCard: iCard,
    isAuthorized: boolean
}
export const UploadFileComponente = ({ infoCard, isAuthorized }: iUploadFileComponente) => {
    const { uploadFile, deleteFile } = useContext(CardsContext);

    const [selectedFileName, setSelectedFileName] = useState('');
    const [fileSelected, setFileSelected] = useState(false);

    const [isUploading, setIsUploading] = useState(false);
    const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

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
            setIsUploading(true);
            uploadFile(file, infoCard.id);

            setTimeout(() => {
                setIsUploading(false);
            }, 3500);
        }
    };

    const handleFileDelete = (fileName: string, fileId: string) => {
        setDeletingFileId(fileId);
        deleteFile(fileName, infoCard.id);

        setTimeout(() => {
            setDeletingFileId(null); 
        }, 3500);
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <section className={styled.secFile}>
            <p className={styled.pDesc}>Selecionar Arquivo:</p>
            <div className={styled.divAddFile}>
                <input className={styled.inputFile} type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
                {isAuthorized && (
                    <button className={styled.btnSelectFile} type="button" onClick={handleButtonClick}>Selecionar Arquivo</button>
                )}
                {selectedFileName &&
                    <div className={styled.divSpan}>
                        <span className={styled.span}>Arquivo:</span>
                        <span className={styled.spanFile}> - {selectedFileName}</span>
                    </div>
                }
                {isAuthorized && (
                    <button className={styled.btnSalveFile} type='button' onClick={handleFileUpload} disabled={!fileSelected || isUploading}>
                        {isUploading ? 'Carregando...' : 'Salvar'} 
                    </button>
                )}
            </div>

            <div className={styled.divAllFile}>
                {infoCard.files.map((file: iFiles) => (
                    <div className={styled.divFile} key={file.id}>
                        <p className={styled.fileName} >{file.filename} </p>
                        <div>
                            <a className={styled.fileLink} href={file.url} target="_blank" rel="noopener noreferrer">Visualizar</a>
                            {isAuthorized && (
                                <button className={styled.fileExcluir} type='button' disabled={deletingFileId === file.id} onDoubleClick={() => handleFileDelete(file.filename, file.id)}>
                                    {deletingFileId === file.id ? 'Excluindo...' : 'Excluir'}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
