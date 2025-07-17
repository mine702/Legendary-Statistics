import {toast, ToastContentProps} from "react-toastify";

type ConfirmToastProps = {
  message: string;
  onConfirm: () => void;
};

export const showConfirmToast = ({message, onConfirm}: ConfirmToastProps) => {
  toast(({closeToast}: ToastContentProps) => (
    <div
      style={{
        padding: "8px",
        fontSize: "14px",
        lineHeight: "2",
        minWidth: "250px",
        maxWidth: "400px",
        gap: "8px",
      }}
    >
      <div style={{margin: "5px 0px 15px 10px", color: "#444"}}>{message}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "6px",
        }}
      >
        <button
          style={{
            padding: "4px 10px",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            cursor: "pointer",
          }}
          onClick={() => {
            closeToast();
            onConfirm();
          }}
        >
          확인
        </button>
        <button
          style={{
            padding: "4px 10px",
            backgroundColor: "#ea4335",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            cursor: "pointer",
          }}
          onClick={closeToast}
        >
          취소
        </button>
      </div>
    </div>
  ), {
    position: "bottom-center",
    autoClose: false,
    closeOnClick: false,
    closeButton: false,
    style: {
      padding: 0,            // toast 자체의 padding 제거
      borderRadius: "8px",
      width: "fit-content",
    },
  });
};
