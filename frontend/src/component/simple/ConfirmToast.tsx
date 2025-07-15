import {toast, ToastContentProps} from "react-toastify";

type ConfirmToastProps = {
  message: string;
  onConfirm: () => void;
};

export const showConfirmToast = ({message, onConfirm}: ConfirmToastProps) => {
  toast(({closeToast}: ToastContentProps) => (
    <div
      style={{
        padding: "10px",
        fontSize: "14px",
        lineHeight: "1.5",
        minWidth: "200px",
        maxWidth: "400px",
      }}
    >
      <div style={{margin: "10px 0px 16px 5px", color: "#444"}}>
        {message}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "4px",
        }}
      >
        <button
          style={{
            padding: "6px 12px",
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
            padding: "6px 12px",
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
      padding: 0,
      borderRadius: "8px",
      width: "fit-content",
    },
  });
};
