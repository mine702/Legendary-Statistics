import style from "./RouterSwitchTransition.module.scss"
import {CSSTransition, SwitchTransition} from "react-transition-group";
import {useRef} from "react";

interface Props {
  location: any;
  children: any;
}

/**
 * 라우터가 다른 페이지로 전환될때, 특정한 애니메이션 효과를 주면서 부드럽게 전환되는 효과를 제공합니다.
 * SwitchTransition은 먼저 사라지는 컴포넌트를 사라지게 하고, 그 다음에 새로운 컴포넌트를 나타나게 합니다.
 */
export const RouterSwitchTransition = (props: Props) => {
  const ref = useRef(null);
  const pathname = props.location.pathname;
  return (
    <SwitchTransition>
      <CSSTransition
        key={pathname}
        timeout={200}
        nodeRef={ref}

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
        <div ref={ref}>
          {props.children}
        </div>
      </CSSTransition>
    </SwitchTransition>
  )
}
