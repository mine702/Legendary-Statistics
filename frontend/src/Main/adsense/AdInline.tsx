import {useEffect, useRef} from "react";

interface Props {
  client: string;
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  fullWidth?: boolean;
  style?: React.CSSProperties;
  className?: string;
  reloadKey?: string | number;
  test?: boolean;
}

export const AdInline = ({
                           client,
                           slot,
                           format = "auto",
                           fullWidth = true,
                           style,
                           className,
                           reloadKey,
                         }: Props) => {
  const ref = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      if (ref.current) ref.current.innerHTML = "";
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error(e);
    }
  }, [reloadKey]);

  return (
    <ins
      ref={ref}
      className={`adsbygoogle ${className ?? ""}`}
      style={{display: "block", ...(style || {})}}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidth ? "true" : "false"}
    />
  );
}
