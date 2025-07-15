import style from "./LargeCheckBox.module.scss"
import CheckedIcon from "../../assets/icons/checked.svg";

interface Props {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  style?: React.CSSProperties;
}

export const LargeCheckBox = (props: Props) => {
  const onClick = () => props.onChange(!props.checked)

  return (
    <div className={`${style.root} ${props.checked ? style.checked : ""}`} style={props.style} onClick={onClick}>
      {props.checked && <img src={CheckedIcon as string} alt="checked" className={style.checkedIcon}/>}
    </div>
  )
}
