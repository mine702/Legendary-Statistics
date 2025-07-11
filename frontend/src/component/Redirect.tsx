import {useNavigate} from "react-router";
import {useEffect} from "react";

interface Props {
  path: string
}

export const Redirect = (props: Props) => {
  const navigate = useNavigate();
  // @ts-ignore
  useEffect(() => navigate(props.path), []);
  return <></>
}
