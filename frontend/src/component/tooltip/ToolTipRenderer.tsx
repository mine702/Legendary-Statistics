import style from "./ToolTipRenderer.module.scss"

interface Props {
  tooltipPosition: {x:number,y:number}
  tooltipContent?: React.ReactNode
  isMouseOver:boolean
}

export const ToolTipRenderer = (props:Props) => {
  return (
    <span className={`${style.tooltipText} ${props.isMouseOver ? style.hovered : ""}`}
          style={{left: props.tooltipPosition.x, top: props.tooltipPosition.y}}>
      {props.tooltipContent ?? <></>}
    </span>
  )
}