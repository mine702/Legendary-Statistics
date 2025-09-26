import style from "./ToolTip.module.scss"
import {useContext, useEffect, useState} from "react";
import {ToolTipContext} from "./tooltipContext.ts";
import {getAgentTypeByWidth} from "../../util/agent.ts"

interface Props {
    children: React.ReactNode
    tooltipContent: React.ReactNode
}

export const ToolTip = (props: Props) => {
    const tooltipContext = useContext(ToolTipContext);
    const [agent, setAgent] = useState<"mobile" | "pc">(getAgentTypeByWidth());

    useEffect(() => {
        const onResize = () => {
            const next = getAgentTypeByWidth();
            setAgent(next);
            if (next === "mobile") tooltipContext.closeTooltip();
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [tooltipContext]);

    const isMobile = agent === "mobile";

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
