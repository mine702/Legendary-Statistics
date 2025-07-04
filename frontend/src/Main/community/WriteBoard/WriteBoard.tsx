import style from "./WriteBoard.module.scss"
import {Space} from "../../../../../component/simple/Space.tsx";
import axios from "axios";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {showToastOnError} from "../../../../../util/errorParser.ts";
import {useLocation, useNavigate, useParams} from "react-router";
import {GetFileRes} from "../../../../../server/dto/file.ts";
import {GetMultiInquiryRes, PostMultiInquiryReq} from "../../../../../server/dto/board.ts";
import {requestURL} from "../../../../../config.ts";
import {MultiFileUploader} from "../../../../../component/MultiFileUploader.tsx";
import {isImage} from "../../../../../util/fileNameParser.ts";
import {parseJWT} from "../../../../../util/loginManager.ts";
import {useSWRGetLastTimeInquiry, useSWRInquiryCategories} from "../../../../../server/server.ts";
import {LargeCheckBox} from "../../../../../component/simple/LargeCheckBox.tsx";

interface PostInquiryForm extends Omit<PostMultiInquiryReq, "fileIds"> {
  files: GetFileRes[];
}

const formToReq = (form: PostInquiryForm): PostMultiInquiryReq => {
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
  const {mutate: getLastTime} = useSWRGetLastTimeInquiry();
  const {data: categoryInfo} = useSWRInquiryCategories();

  const isEditMode = location.pathname.includes("edit");
  const jwt = parseJWT();

  const [form, setForm] = useState<PostInquiryForm>({
    category: "기능 제안",
    title: "",
    content: "",
    files: [],
    shared: false
  });

  useEffect(() => {
    init();
  }, []);

  const init = showToastOnError(async () => {
    if (!isEditMode) return;
    let res = await axios.get<GetMultiInquiryRes>(`inquiry/one/${id}`);
    setForm({
      ...res.data,
      files: res.data.files || [],
    });
  });

  const onChangeCategory = (e: any) => setForm({...form, category: e.target.value});
  const onChangeTitle = (e: any) => setForm({...form, title: e.target.value});
  const onChangeContent = (e: any) => setForm({...form, content: e.target.value});
  const onChangeFiles = (files: GetFileRes[]) => setForm({...form, files});
  const onChangeShared = (e: any) => setForm({...form, shared: e});

  const onClickSave = showToastOnError(async () => {
    if (isEditMode) {
      await axios.put(`inquiry`, formToReq(form));
    } else {
      await axios.post("inquiry", formToReq(form));
    }
    toast.success("문의가 등록되었습니다.");
    await getLastTime();
    if (form.category === "문서 공유") {
      navigate("../shared-documents");
    } else {
      navigate("../list");
    }
  });

  return (
    <div className={style.root}>
      <h1>{isEditMode ? "문의 수정" : "문의 작성"}</h1>
      {!isEditMode ? (
        <div className="header-description">WizTim에 의견을 전달할 수 있습니다.</div>
      ) : null}

      <div className={style.sectionHeader}>제목</div>
      <div className="flex mb">
        <select className="pad mr" value={form.category} onChange={onChangeCategory}>
          {/*DEV권한이 있는사람만 아래 항목을 등록할 수 있음.
          백엔드 검사도 필요하지만 일반사용자가 아래 항목으로 등록하여도 큰 피해가 발생하지 않으므로 별도 필터는 하지 않았음*/}
          {Object.keys(categoryInfo)
            //devOnly인 항목은 개발자만 보이도록 필터링
            .filter((key) => jwt.dev ? true : !categoryInfo[key].devOnly)
            .filter((key) => jwt.admin ? true : !categoryInfo[key].adminWriteOnly)
            .map((key) => <option key={key} value={key}>
              {categoryInfo[key].displayTitle}
            </option>)}
        </select>
        <input
          type="text"
          className="pad grow"
          value={form.title}
          onChange={onChangeTitle}
        />
      </div>
      <div className={style.sectionHeader}>내용</div>
      <textarea
        className="full-width pad grow"
        style={{height: "400px"}}
        value={form.content}
        onChange={onChangeContent}
      />
      {parseJWT().dev && <div style={{marginBottom: "15px"}}>
          <div className={style.option}>
              <div>개발팀 수정 가능</div>
              <LargeCheckBox onChange={onChangeShared} style={{marginLeft: "5px"}} checked={form.shared}/>
          </div>
          <div className="input-description">위 항목을 체크하면 개발팀으로 등록된 사람은 이 문의를 수정할 수 있습니다. 산출물 등을 같이 업데이트하기 위한 기능입니다.</div>
      </div>}

      <div className={style.sectionHeader}>첨부파일</div>
      <MultiFileUploader value={form.files} onChange={onChangeFiles}
                         authority={categoryInfo?.showForAllUser ? "public" : "dev"}/>
      {form.files.length > 0 && (
        <div className={style.uploadedFiles}>
          {form.files.map((file) => (
            <div key={file.id} className={style.fileItem}>
              {file && isImage(file.actualFileName) ?
                <img src={`${requestURL}/file/${file.id}`} alt="첨부 이미지" className={style.image}/> : null}
            </div>
          ))}
        </div>
      )}
      <div className="flex">
        <Space/>
        <button onClick={onClickSave}>저장</button>
      </div>
    </div>
  );
};
