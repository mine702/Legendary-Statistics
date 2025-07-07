import style from "./FindPassword.module.scss";
import {useNavigate} from "react-router";
import {useImmer} from "use-immer";
import {FindPasswordReq} from "../../../server/dto/user.ts";
import {ChangeEvent} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {parseValidationMessage} from "../../../util/errorParser.ts";

export const FindPassword = () => {
  const navigate = useNavigate()
  const [req, setReq] = useImmer<FindPasswordReq>({name: "", email: ""})
  const [reqErrors, setReqErrors] = useImmer<FindPasswordReq>({name: "", email: ""})
  const [noAccount, setNoAccount] = useImmer<string>("")

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setReq(draft => {
      draft.email = e.target.value
    })
    setReqErrors(draft => {
      draft.email = ""
    })
    setNoAccount("")
  }

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setReq(draft => {
      draft.name = e.target.value
    })
    setReqErrors(draft => {
      draft.name = ""
    })
    setNoAccount("")
  }

  const onClickGoBack = () => navigate(-1)

  const onClickFindPassword = async () => {
    try {
      await axios.post("/user/find-password", req).then(() => {
        toast.success(`임시 비밀번호가 입력하신 이메일로 전송되었습니다.`);
        navigate(-1)
      })
    } catch (e: any) {
      if (e.response.status === 422 && e.response.data?.code === "USER_NOT_FOUND") {
        setNoAccount(e.response.data.msg)
        return
      }
      try {
        let message = parseValidationMessage(e)
        message.forEach(value => {
          setReqErrors(draft => {
            draft[value.field] = value.message
          })
        })
      } catch (e: any) {
        toast.error(e?.message);
      }
    }
  }

  const onKeyDown = (e: any) => {
    if (e.key === "Enter") onClickFindPassword()
  }

  return (
    <div className={style.root} onKeyDown={onKeyDown}>
      <div className={style.title}>패스워드 변경</div>
      <div className={style.announcement}>입력한 회원 정보의 이메일로 임시 비밀번호가 발송됩니다.</div>
      <div className="input-description">이름</div>
      <input type="text" placeholder="이름" autoFocus={true}
             className={`full-width ${reqErrors.name !== "" && "error"}`}
             value={req.name} onChange={onChangeName}/>
      <div className="input-error">{reqErrors.name}</div>
      <div className="input-description">이메일</div>
      <input type="text" placeholder="이메일"
             className={`full-width ${reqErrors.email !== "" && "error"}`}
             value={req.email} onChange={onChangeEmail}/>
      <div className="input-error">{reqErrors.email}</div>
      <div className="input-error">{noAccount}</div>
      <button className="mt full-width" onClick={onClickFindPassword}>변경하기</button>
      <div className={style.bottomArea}>
        <a className="mr" onClick={onClickGoBack}>뒤로가기</a>
      </div>
    </div>
  )
}
