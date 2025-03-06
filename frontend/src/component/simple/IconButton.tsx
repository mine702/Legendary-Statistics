import style from "./IconButton.module.scss"
import {CSSProperties, ReactNode} from "react";

interface Props{
  style?:CSSProperties,
  children?:ReactNode
  onClick:(e:React.MouseEvent)=>void
  className?:string
  size?:'small'|'medium'|'large'
  active?:boolean
  tabIndex?:number
}

export const IconButton = (props:Props) => {
  const className = props.className ? props.className : '';
  const sizeStyleClass = props.size === 'small' ? style.small :
    props.size === 'large' ? style.large : style.medium;
  return (
    <button className={`${style.root} ${sizeStyleClass} custom ${className} ${props.active ? style.active : ''}`} 
            tabIndex={props.tabIndex}
            style={props.style} onClick={props.onClick}>
      {props.children}
    </button>
  )
}