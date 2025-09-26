import style from "./ToolTip.module.scss"
import {useContext} from "react";
import {ToolTipContext} from "./tooltipContext.ts";
import {getAgentTypeByWidth} from "../../util/agent.ts"

interface Props {
    children: React.ReactNode
    tooltipContent: React.ReactNode
}

export const ToolTip = (props: Props) => {
    const tooltipContext = useContext(ToolTipContext);

    const isMobile = getAgentTypeByWidth() === "mobile";

    const onMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        // const y = e.clientY - rect.top;
        tooltipContext.showTooltip({x: (rect.left + rect.right) / 2, y: rect.bottom + 10}, props.tooltipContent);
    }

    const onMouseLeave = () => {
        if (isMobile) return;
        tooltipContext.closeTooltip();
    }
    const onMouseDown = () => {
        if (isMobile) return;
        tooltipContext.closeTooltip();
    }

    return <>
        <div className={`${style.root}`} onMouseOver={onMouseOver}
             onMouseLeave={onMouseLeave} onMouseDown={onMouseDown}>
            {props.children}
        </div>
    </>
}
