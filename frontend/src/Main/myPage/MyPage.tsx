import style from "./MyPage.module.scss"
import {useEffect, useState} from "react";
import {checkIsAuthenticated} from "../../util/loginManager.ts";
import {useNavigate} from "react-router";
import axios from "axios";
import {showToastOnError} from "../../util/errorParser.ts";
import {toast} from "react-toastify";
import {useSWRMyInfo} from "../../server/server.ts";
import {showConfirmToast} from "../../component/simple/ConfirmToast.tsx";
import Cookies from "universal-cookie";

export const MyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkIsAuthenticated()) navigate("/login");
  }, []);

  const {data: myInfo} = useSWRMyInfo();

  const [changeMyPasswordReq, setChangeMyPasswordReq] = useState({oldPassword: "", newPassword: ""});
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const onChangeOldPassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setChangeMyPasswordReq({...changeMyPasswordReq, oldPassword: e.target.value});

  const onChangeNewPassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setChangeMyPasswordReq({...changeMyPasswordReq, newPassword: e.target.value});

  const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswordConfirm(e.target.value);

  const onKeyDownInPasswordInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") await onClickChangePassword();
  }

  const onClickChangePassword = showToastOnError(async () => {
    if (changeMyPasswordReq.newPassword !== passwordConfirm) {
      toast.error("신규 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    await axios.post("/user/change-password", changeMyPasswordReq);
    toast.success("비밀번호가 변경되었습니다.");
    setChangeMyPasswordReq({oldPassword: "", newPassword: ""});
    setPasswordConfirm("");
  });

  const onClickWithdrawal = () => {
    showConfirmToast({
      message: "정말 탈퇴 하시겠습니까?",
      onConfirm: onConfirmDelete
    });
  };

  const onConfirmDelete = showToastOnError(async () => {
    await axios.delete("/user/withdrawal"); // 선행 슬래시

    const cookie = new Cookies();
    cookie.remove("accessToken", {path: "/"});
    cookie.remove("refreshToken", {path: "/"});

    toast.success("성공적으로 탈퇴 되었습니다.", {
      autoClose: 1500,
      onClose: () => window.location.replace("/login"),
    });
  });

  return (
    <div className={style.root}>
      <h2 style={{marginTop: "50px", marginBottom: "10px"}}>내 정보</h2>
      <div className={style.container}>
        <div className={style.profileArea}>
          <span className={style.text}>닉네임 : {myInfo?.name}</span>
          <span className={style.text}>ID : {myInfo?.email}</span>
        </div>
      </div>
      <h3 style={{marginTop: "20px", marginBottom: "10px"}}>비밀번호</h3>
      <div className={style.container}>
        <div className={style.passwordArea}>
          <div className="input-description">현재 비밀번호</div>
          <input type="password" onKeyDown={onKeyDownInPasswordInput}
                 value={changeMyPasswordReq.oldPassword} onChange={onChangeOldPassword}/>
          <div className="input-description">신규 비밀번호</div>
          <input type="password" onKeyDown={onKeyDownInPasswordInput}
                 value={changeMyPasswordReq.newPassword} onChange={onChangeNewPassword}/>
          <div className="input-description">비밀번호 확인</div>
          <input type="password" onKeyDown={onKeyDownInPasswordInput}
                 value={passwordConfirm} onChange={onChangePasswordConfirm}/>
          <br/>
          <div className={style.buttonArea}>
            <button className="mt" onClick={onClickChangePassword}>변경</button>
          </div>
        </div>
      </div>
      <h3 style={{marginTop: "20px", marginBottom: "10px"}}>회원 탈퇴</h3>
      <div className={style.container} style={{marginBottom: "20px"}}>
        <div className={style.withdrawal}>
          <div className={style.description}>회원 탈퇴 시 해당 아이디로 접속 할 수 없습니다.</div>
          <button className="mt" onClick={onClickWithdrawal}>회원 탈퇴</button>
        </div>
      </div>
    </div>
  )
}
