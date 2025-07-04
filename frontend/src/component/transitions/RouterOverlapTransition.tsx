import style from "./RouterOverlapTransition.module.scss"
import {CSSTransition,TransitionGroup} from "react-transition-group";

interface Props {
  location: any;
  children: any;
}

/**
 * 라우터가 다른 페이지로 전환될때, 특정한 애니메이션 효과를 주면서 부드럽게 전환되는 효과를 제공합니다.
 * OverlapTransition은 새로운 컴포넌트가 나타나면서, 동시에 기존 컴포넌트가 사라지는 효과를 제공합니다.
 */
export const RouterOverlapTransition = (props:Props) => {
  const pathname = props.location.pathname;
  
  return (
    <TransitionGroup className={style.root}>
      <CSSTransition
        key={pathname}
        timeout={300}
        classNames={{
          appear: style.fadeAppear,
          appearActive: style.fadeAppearActive,
          appearDone: style.fadeAppearDone,
          enter: style.fadeEnter,
          enterActive: style.fadeEnterActive,
          enterDone: style.fadeEnterDone,
          exit: style.fadeExit,
          exitActive: style.fadeExitActive,
          exitDone: style.fadeExitDone,
        }}
      >
        {props.children}
      </CSSTransition>
    </TransitionGroup>
  );
};
