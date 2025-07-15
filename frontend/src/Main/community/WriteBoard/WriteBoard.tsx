import style from "./WriteBoard.module.scss"
import {Space} from "../../../component/simple/Space.tsx";
import axios from "axios";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {showToastOnError} from "../../../util/errorParser.ts";
import {useLocation, useNavigate, useParams} from "react-router";
import {GetFileRes, GetMultiBoardRes, PostMultiBoardReq} from "../../../server/dto/board.ts";
import {MultiFileUploader} from "../../../component/MultiFileUploader.tsx";
import {isImage} from "../../../util/fileNameParser.ts";
import {checkIsAuthenticated, parseJWT} from "../../../util/loginManager.ts";
import {useSWRBoardCategories} from "../../../server/server.ts";
import {ApiResponse} from "../../../server/dto/format.ts";

interface PostBoardForm extends Omit<PostMultiBoardReq, "fileIds"> {
  files: GetFileRes[];
}

const formToReq = (form: PostBoardForm): PostMultiBoardReq => {
  const {files, ...keyRemovedForm} = form;
  return {
    ...keyRemovedForm,
    fileIds: files.map((file) => file.id),
  };
};

export const WriteBoard = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const location = useLocation();
  const {data: categoryInfo} = useSWRBoardCategories();

  useEffect(() => {
    if (!checkIsAuthenticated()) navigate("/login");
  }, []);

  const isEditMode = location.pathname.includes("edit");
  const jwt = parseJWT();

  const [form, setForm] = useState<PostBoardForm>({
    category: "",
    title: "",
    content: "",
    files: [],
  });

  useEffect(() => {
    init();
  }, []);

  const init = showToastOnError(async () => {
    if (!isEditMode) return;
    let res = await axios.get<ApiResponse<GetMultiBoardRes>>(`/board/detail/${id}`);
    const resData = res.data.data;

    if (!resData) {
      toast.error("데이터를 불러오지 못했습니다.");
      return;
    }

    const {title, content, category, files} = resData;

    setForm({
      title: title ?? "",
      content: content ?? "",
      category: category ?? "",
      files: files ?? [],
    });
  });

  const onChangeCategory = (e: any) => setForm({...form, category: e.target.value});
  const onChangeTitle = (e: any) => setForm({...form, title: e.target.value});
  const onChangeContent = (e: any) => setForm({...form, content: e.target.value});
  const onChangeFiles = (files: GetFileRes[]) => setForm({...form, files});

  const onClickSave = showToastOnError(async () => {
    if (isEditMode) {
      await axios.put(`board/write`, formToReq(form));
    } else {
      try {
        await axios.post("board/write", formToReq(form));
      } catch (e: any) {
        if (e.response?.status === 400) {
          console.log(e.response?.data?.body.errors);
          e.response?.data?.body.errors.forEach((error: any) => {
            toast.error(error.message);
          })
          return;
        }
        throw e;
      }
    }
    toast.success("게시글이 등록되었습니다.");
    navigate("../freeboard");
  });

  return (
    <div className={style.root}>
      <h1>{isEditMode ? "게시판 글 수정" : "게시판 글 작성"}</h1>
      <div className={style.sectionHeader}>제목</div>
      <div className="flex mb">
        <select className={style.selectContainer} value={form.category} onChange={onChangeCategory}>
          <option value="" disabled>카테고리</option>
          {(categoryInfo || [])
            .filter((item) => {
              if (jwt.admin) return true;
              if (jwt.user) return !["NOTICE", "LEGEND"].includes(item.name);
            })
            .map((item) => (
              <option key={item.name} value={item.name}>
                {item.label}
              </option>
            ))}
        </select>
        <input
          type="text"
          className={style.inputContainer}
          value={form.title}
          onChange={onChangeTitle}
        />
      </div>
      <div className={style.sectionHeader}>내용</div>
      <textarea
        className={style.textArea}
        style={{height: "400px"}}
        value={form.content}
        onChange={onChangeContent}
      />
      <div className={style.sectionHeader}>첨부파일</div>
      <MultiFileUploader value={form.files} onChange={onChangeFiles}/>
      {form.files.length > 0 && (
        <div className={style.uploadedFiles}>
          {form.files.map((file) => (
            <div key={file.id} className={style.fileItem}>
              {file && isImage(file.actualFileName) ?
                <img src={`/uploads${file.path}`} alt="첨부 이미지" className={style.image}/> : null}
            </div>
          ))}
        </div>
      )}
      <div className="flex">
        <Space/>
        <button className={style.saveButton} onClick={onClickSave}>저장</button>
      </div>
    </div>
  );
};
