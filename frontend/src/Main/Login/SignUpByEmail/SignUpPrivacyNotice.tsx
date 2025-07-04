import style from "./SignUpPrivacyNotice.module.scss";
import {useNavigate} from "react-router";

export const SignUpPrivacyNotice = () => {
  const navigate = useNavigate();

  const onClickGoBack = () => navigate(-1)
  const onClickSignUp = () => navigate("../signup-by-email")

  return (
    <div className={style.root}>
      <h2 className={style.title}>개인정보 수집 및 이용 동의</h2>

      <div className={style.privacyBox}>
        <h3 className={style.privacyBoxTitle}>[개인정보 수집 및 이용 동의]</h3>
        <p className={style.privacyBoxText}>
          <strong>Wiztim</strong>은(는) 이용자의 개인정보를 중요하게 보호하며, 관련 법령을 준수하여 안전하게 관리하고 있습니다.
          회원 가입을 진행하기 전 아래 내용을 확인하시고 동의해 주세요.
        </p>

        <h3 className={style.privacyBoxTitle}>[1] 수집하는 개인정보 항목</h3>
        <p className={style.privacyBoxText}>회원 가입 시, 아래와 같은 필수 정보를 수집합니다.</p>
        <ul className={style.privacyBoxUl}>
          <li>필수 정보: 이름, 이메일, 비밀번호</li>
          <li>선택 정보: 연락처</li>
        </ul>

        <h3 className={style.privacyBoxTitle}>[2] 개인정보 수집 및 이용 목적</h3>
        <p className={style.privacyBoxText}>Wiztim은 수집된 정보를 다음과 같은 목적으로 이용합니다.</p>
        <ul className={style.privacyBoxUl}>
          <li>회원 가입 및 본인 인증</li>
          <li>서비스 제공 및 운영</li>
          <li>고객 문의 응대 및 지원</li>
          <li>이용자 맞춤 서비스 제공</li>
        </ul>

        <h3 className={style.privacyBoxTitle}>[3] 개인정보 보유 및 이용 기간</h3>
        <p className={style.privacyBoxText}>
          회원 탈퇴 시 즉시 삭제하며, 관련 법령에 따라 일정 기간 보관될 수 있습니다.
          법령에 따른 보관 기간이 경과한 후에는 즉시 파기됩니다.
        </p>

        <h3 className={style.privacyBoxTitle}>[4] 동의 여부</h3>
        <p className={style.privacyBoxText}>회원 가입을 계속 진행하려면 아래 버튼을 눌러 동의해 주세요.</p>
      </div>

      <div className={style.buttons}>
        <button className={style.agreeButton} onClick={onClickSignUp}>동의</button>
        <button className={style.disagreeButton} onClick={onClickGoBack}>동의하지 않음</button>
      </div>
    </div>
  );
};
