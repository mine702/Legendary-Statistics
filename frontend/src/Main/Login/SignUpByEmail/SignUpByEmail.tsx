import style from "./SignUpByEmail.module.scss";
import {useNavigate} from "react-router";
import {useImmer} from "use-immer";
import {SignUpByEmailReq} from "../../../server/dto/user.ts";
import {ChangeEvent, useEffect} from "react";
import axios from "axios";
import {parseValidationMessage} from "../../../util/errorParser.ts";
import {toast} from "react-toastify";

export const SignUpByEmail = () => {
  const navigate = useNavigate();
  const [req, setReq] = useImmer<SignUpByEmailReq>({email: "", password: "", name: ""});
  const [reqErrors, setReqErrors] = useImmer<SignUpByEmailReq>({email: "", password: "", name: ""});
  const [passwordRepeat, setPasswordRepeat] = useImmer<string>("");
  const [showPasswordRepeatError, setShowPasswordRepeatError] = useImmer<boolean>(false);

  useEffect(() => {
    console.log(reqErrors);
  }, [reqErrors]);

  // 입력값 변경 핸들러
  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setReq(draft => {
      draft.email = e.target.value;
    });
    setReqErrors(draft => {
      draft.email = "";
    });
  };

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setReq(draft => {
      draft.name = e.target.value;
    });
    setReqErrors(draft => {
      draft.name = "";
    });
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setReq(draft => {
      draft.password = e.target.value;
    });
    setReqErrors(draft => {
      draft.password = "";
    });
  };

  const onChangePasswordRepeat = (e: ChangeEvent<HTMLInputElement>) => setPasswordRepeat(e.target.value);

  const onClickGoBack = () => navigate("../login");

  const onClickSignUp = async () => {
    if (req.password !== passwordRepeat) {
      setShowPasswordRepeatError(true);
      return;
    }

    try {
      await axios.post("/user/signup", req);
      navigate("/main");
    } catch (e: any) {
      if (e.response.status === 409) {
        setReqErrors(draft => {
          draft.email = "중복된 이메일입니다.";
        });
        return;
      }
      try {
        let message = parseValidationMessage(e);
        message.forEach(value => {
          setReqErrors(draft => {
            draft[value.field] = value.message;
          });
        });
      } catch (e: any) {
        toast.error(e?.message);
      }
    }
  };

  const onKeyDown = (e: any) => {
    if (e.key === "Enter") onClickSignUp();
  };

  return (
    <div className={style.root} onKeyDown={onKeyDown}>
      <div className={style.title}>회원가입</div>

      <div className="input-description">이메일</div>
      <input type="text" placeholder="이메일" value={req.email} onChange={onChangeEmail}
             className={`full-width ${reqErrors.email && "error"}`}/>
      <div className="input-error">{reqErrors.email}</div>

      <div className="input-description">이름</div>
      <div className={style.littleText}>닉네임 혹은 이름을 입력해 주세요</div>
      <input type="text" placeholder="이름" value={req.name} onChange={onChangeName}
             className={`full-width ${reqErrors.name && "error"}`}/>
      <div className="input-error">{reqErrors.name}</div>
      <div className="input-description">비밀번호</div>
      <input type="password" placeholder="비밀번호 입력" value={req.password} onChange={onChangePassword}
             className={`full-width ${reqErrors.password && "error"}`}/>
      <div className="input-error">{reqErrors.password}</div>

      <div className="input-description">비밀번호 확인</div>
      <input type="password" placeholder="비밀번호 확인" value={passwordRepeat} onChange={onChangePasswordRepeat}
             className={`full-width ${req.password !== passwordRepeat && showPasswordRepeatError && "error"}`}/>
      <div
        className="input-error">{(req.password !== passwordRepeat && showPasswordRepeatError) && "비밀번호가 일치하지 않습니다."}</div>

      <button className="mt full-width" onClick={onClickSignUp}>회원가입</button>
      <div className={style.bottomArea}>
        <a onClick={onClickGoBack}>뒤로가기</a>
      </div>
    </div>
  );
};
