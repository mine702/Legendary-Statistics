import style from './Login.module.scss'
import {Route, Routes, useLocation} from "react-router";
import logo from "../../assets/img/main_logo.png";
import {RouterSwitchTransition} from "../../component/transitions/RouterSwitchTransition.tsx";
import {Redirect} from "../../component/Redirect.tsx";
import {FindPassword} from "./FindPassword/FindPassword.tsx";
import {SignUpByEmail} from "./SignUpByEmail/SignUpByEmail.tsx";
import {EmailLogin} from "./EmaliLogin/EmailLogin.tsx";

export const Login = () => {
  const location = useLocation();

  return (
    <div className={style.root}>
      <div className={`position-center ${style.middleArea}`}>
        <img src={logo as string} alt="logo"
             className={`${style.logo} ${!location.pathname.startsWith("/login/login-entry") ? style.small : ""}`}/>
        <div className={style.buttonArea}>
          <RouterSwitchTransition location={location}>
            <Routes location={location}>
              <Route path="email-login" element={<EmailLogin/>}/>
              <Route path="signup-by-email" element={<SignUpByEmail/>}/>
              <Route path="find-password" element={<FindPassword/>}/>
              <Route path="*" element={<Redirect path="../login-entry"/>}/>
            </Routes>
          </RouterSwitchTransition>
        </div>
        <div className={style.about}>About WizTim</div>
      </div>
    </div>
  )
}
