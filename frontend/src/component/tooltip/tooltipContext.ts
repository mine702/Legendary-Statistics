import React, {ReactNode, useEffect} from "react";
import {Position} from "../../util/position.ts";
import {useLocation} from "react-router";

interface TooltipContextData {
  showTooltip: (position: Position, node: ReactNode) => void;
  closeTooltip: () => void;
}

export const ToolTipContext = React.createContext<TooltipContextData>({
  showTooltip: () => {
  },
  closeTooltip: () => {
  }
});

export const useToolTip = () => {
  const [ttPosition, setTtPosition] = React.useState<Position>({x: 0, y: 0});
  const [ttNode, setTtNode] = React.useState<ReactNode>(undefined);
  const [isTtMouseOver, setTtMouseOver] = React.useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    closeTooltip();
  }, [location.pathname]);

  const showTooltip = (position: Position, node: ReactNode) => {
    setTtPosition(position);
    setTtNode(node);
    setTtMouseOver(true);
  }

  const closeTooltip = () => {
    setTtMouseOver(false);
  }
  return [ttPosition, ttNode, isTtMouseOver, setTtPosition,
    setTtNode, setTtMouseOver, showTooltip, closeTooltip] as const;
}
