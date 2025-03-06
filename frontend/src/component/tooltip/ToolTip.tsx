import style from "./ToolTip.module.scss"
import {useContext, useEffect, useState} from "react";
import {Position} from "../../util/position.ts";
import {ToolTipContext} from "./tooltipContext.ts";
import {useLocation} from "react-router-dom";
interface Props {
  children: React.ReactNode
  tooltipContent: React.ReactNode
}

export const ToolTip = (props:Props) => {
  const tooltipContext = useContext(ToolTipContext);


  const onMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // const y = e.clientY - rect.top;
    tooltipContext.showTooltip({x:(rect.left+rect.right)/2,y:rect.bottom+10},props.tooltipContent);
  }
  
  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement,MouseEvent>) => {
    tooltipContext.closeTooltip();
  }
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement,MouseEvent>) => {
    tooltipContext.closeTooltip();
  }
  
  return <>
    <div className={`${style.root}`} onMouseOver={onMouseOver} 
         onMouseLeave={onMouseLeave} onMouseDown={onMouseDown}>
      {props.children}
    </div>
  </>
}