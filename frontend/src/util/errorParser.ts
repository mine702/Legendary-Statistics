import {toast} from "react-toastify";

/**
 * 토스트로 한줄로 표현할 수 있는 에러메시지로 해석합니다.
 */
export const parseErrorMessageToOneLine = (e: any): string => {
  try {
    if (typeof e === "string") return e;
    if (!e.response || !e.response.status) {
      console.log(e)
      if (e.message) return `식별되지 않은 에러입니다. (${e.message})`
      else return "알 수 없는 에러입니다."
    }

    if (e.response.status === 403) return "권한이 없습니다."
    if (e.response.status === 500) return "서버 에러입니다. 잠시 후 다시 시도해주세요."

    const detail = e.response.data.detail
    if (!Array.isArray(detail)) return e.response.data.msg;

    if (detail.length == 0) return "검증에 실패했습니다.";
    return detail[0].msg;
  } catch (e) {
    console.log(e)
    return "알 수 없는 에러입니다."
  }
}

export type ValidateMessages = {
  field: string;
  message: string;
}[]

/**
 * 사용자에게 제공하기 위해 유효성검사 에러를 해석합니다. 해석에 실패한경우 예외가 발생하고 에러메시지가 전달됩니다.
 */

export const parseValidationMessage = (e: any): ValidateMessages => {
  if (typeof e === "string") throw new Error(e);

  const response = e?.response;
  const status = response?.status;
  const data = response?.data;

  if (!status) {
    console.log(e);
    if (e.message) throw new Error(`식별되지 않은 에러입니다. (${e.message})`);
    else throw new Error("알 수 없는 에러입니다.");
  }

  if (status === 403) throw new Error("권한이 없습니다.");
  if (status === 500) throw new Error("서버 에러입니다. 잠시 후 다시 시도해주세요.");

  try {
    const errors = data?.errors;

    if (!Array.isArray(errors)) {
      // fallback: 단일 메시지가 있다면 반환
      if (typeof data?.msg === "string") throw new Error(data.msg);
      throw new Error("유효성 검증 형식이 올바르지 않습니다.");
    }

    return errors.map((item: any) => ({
      field: item.field,
      message: item.message
    }));
  } catch (err) {
    throw new Error("알 수 없는 에러입니다.");
  }
};


/** 예외처리를 편하게 할 수 있도록 하는 데코레이터입니다.<br/>
 * 실험적 기능을 사용하지 않으려는 의도와 예외처리를 간편하게 하고자 하는 의도를 모두 충족하도록 합니다.
 * 기술적 한계로, 인자가 없거나 3개까지의 함수만 중복 정의하였습니다. 인자 개수에 따라 사용하면 됩니다.
 * 또한, 서버 전송시 에러를 핸들링하는것을 기본적으로 전제하므로 async 함수를 리턴합니다.
 */
export const showToastOnError = (fn: () => void, onFinally?: () => void) => {
  return async () => {
    try {
      await fn()
    } catch (e) {
      toast.error(parseErrorMessageToOneLine(e));
    } finally {
      onFinally?.();
    }
  }
}

/** 예외 처리 데코레이터의 인자 1개 바리에이션. */
export const showToastOnErrorP1 = <T>(fn: (arg1: T) => void, onFinally?: () => void) => {
  return async (arg1: T) => {
    try {
      await fn(arg1)
    } catch (e) {
      toast.error(parseErrorMessageToOneLine(e));
    } finally {
      onFinally?.();
    }
  }
}

/** 예외 처리 데코레이터의 인자 2개 바리에이션. */
export const showToastOnErrorP2 = <T, T2>(fn: (arg1: T, arg2: T2) => void) => {
  return async (arg1: T, arg2: T2) => {
    try {
      await fn(arg1, arg2);
    } catch (e) {
      toast.error(parseErrorMessageToOneLine(e));
    }
  }
}

/** 예외 처리 데코레이터의 인자 3개 바리에이션. */
export const showToastOnErrorP3 = <T, T2, T3>(fn: (arg1: T, arg2: T2, arg3: T3) => void) => {
  return async (arg1: T, arg2: T2, arg3: T3) => {
    try {
      await fn(arg1, arg2, arg3);
    } catch (e) {
      toast.error(parseErrorMessageToOneLine(e));
    }
  }
}
