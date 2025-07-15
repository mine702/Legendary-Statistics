import React from "react";
import style from "./MultiFileUploader.module.scss";
import axios from "axios";
import {requestURL} from "../config.ts";
import {showToastOnErrorP1} from "../util/errorParser.ts";
import {GetFileRes} from "../server/dto/board.ts";
import {formatBytes} from "../util/fileSizeFormatter.ts";
import closeIcon from "../assets/icons/close.svg";
import {ApiResponse} from "../server/dto/format.ts";

interface Props {
  value: GetFileRes[];
  onChange?: (e: GetFileRes[]) => void;
  disabled?: boolean;
}

export const MultiFileUploader = (props: Props) => {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const disabled = props.disabled ?? false;
  const [isLoading, setLoading] = React.useState(false);

  const onClickUploadFile = () => fileRef.current?.click();

  const onChangeSelectFile = showToastOnErrorP1(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedFiles: GetFileRes[] = [];
    for (const file of Array.from(files)) {
      const uploadedFile = await uploadFile(file);
      uploadedFiles.push(uploadedFile);
    }

    // 기존 파일 목록에 새로 업로드된 파일 추가
    const updatedFiles = [...props.value, ...uploadedFiles];
    props.onChange?.(updatedFiles);
  });

  const uploadFile = async (file: File): Promise<GetFileRes> => {
    if (!file) throw new Error("파일을 선택해 주세요.");
    if (file.size > 104857600) throw new Error("100MB 이하의 파일만 업로드 가능합니다.");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post<ApiResponse<GetFileRes>>(
        `/file/upload/board`,
        formData
      );

      const result = response.data.data;
      if (!result) throw new Error("파일 업로드 응답이 유효하지 않습니다.");
      return result;
    } catch (e: any) {
      throw new Error("파일 업로드에 실패했습니다. " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = (fileId: number) => {
    const updatedFiles = props.value.filter((file) => file.id !== fileId);
    props.onChange?.(updatedFiles);
  };

  if (isLoading)
    return (
      <div className="FileUploadInput">
        <div>파일 업로드 중</div>
      </div>
    );

  return (
    <div className={style.root}>
      <div className={style.uploadContainer}>
        <input type="file" multiple style={{display: "none"}} ref={fileRef} onChange={onChangeSelectFile}/>
        {!disabled && <button className={style.uploadButton}
                              onClick={onClickUploadFile}
                              disabled={disabled}>파일 선택</button>}

        {props.value != null ? (
          <div className={style.fileList}>
            {props.value.map((file) => (
              <div key={file.id} className={style.fileCard}>
                <a href={`${requestURL}/file/${file.id}`} target="_blank" rel="noopener noreferrer">
                  {file.actualFileName}
                </a>
                <span className={style.fileSize}>{formatBytes(file.size)}</span>
                {!disabled && (
                  <button
                    className={style.deleteButton}
                    onClick={() => handleRemoveFile(file.id)}
                  >
                    <img src={closeIcon as string} alt="closeIcon"/>
                  </button>)}
              </div>
            ))}
          </div>
        ) : <div>파일 없음</div>}
      </div>
    </div>
  );
};
