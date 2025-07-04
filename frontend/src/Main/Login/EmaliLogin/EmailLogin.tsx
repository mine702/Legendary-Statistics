import style from "./EmailLogin.module.scss"
import {useNavigate} from "react-router";
import {useImmer} from "use-immer";
import {AuthReq} from "../../../server/dto/user.ts";
import {ChangeEvent} from "react";
import axios from "axios";
import {showToastOnError} from "../../../util/errorParser.ts";
import {useLocalStorage} from "usehooks-ts";

export const EmailLogin = () => {
  const navigate = useNavigate()
  const [savedId, setSavedId] = useLocalStorage<string>("savedId", "");
  const [req, setReq] = useImmer<AuthReq>({account: savedId, password: ""});
  const [saveId, setSaveId] = useImmer(savedId !== "");

  const onChangeAccount = (e: ChangeEvent<HTMLInputElement>) => {
    setReq(draft => {
      draft.account = e.target.value
    })
  }

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setReq(draft => {
      draft.password = e.target.value
    })
  }

  const onClickGoBack = () => navigate(-1)

  const onClickSignUp = () => navigate("../signup-privacy-notice")

  const onClickFindPassword = () => navigate("../find-password")

  const onClickLogin = showToastOnError(async () => {
    await axios.post("/auth", req)

    if (saveId) setSavedId(req.account);
    else setSavedId("");

    navigate("/main")
  });

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onClickLogin()
  }

  return (
    <div className={style.root} onKeyDown={onKeyDown}>
      <div className={style.title}>이메일로 시작</div>
      <div className="input-description">이메일</div>
      <input type="email" autoFocus={true} placeholder="이메일" className="full-width"
             value={req.account} onChange={onChangeAccount}/>

      <div className="input-description">비밀번호</div>
      <input type="password" placeholder="비밀번호" className="full-width"
             value={req.password} onChange={onChangePassword}/>

      <div className={style.checkboxContainer}>
        <label>
          <input
            type="checkbox"
            checked={saveId}
            onChange={(e) => setSaveId(e.target.checked)}
          />
          아이디 저장
        </label>
      </div>
      
      <button className="mt full-width" onClick={onClickLogin}>로그인</button>

      <div className={style.bottomArea}>
        <a className="mr" onClick={onClickSignUp}>회원가입</a>
        <span className="mr"> | </span>
        <a className="mr" onClick={onClickGoBack}>다른 방법으로 로그인</a>
        <span className="mr"> | </span>
        <a className="mr" onClick={onClickFindPassword}>비밀번호 찾기</a>
      </div>
    </div>
  )
}
