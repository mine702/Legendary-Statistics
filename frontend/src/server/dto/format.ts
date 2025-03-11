// ✅ 기본 응답 타입 (SUCCESS, FAILED, ERROR)
export interface ApiResponse<T> {
  status: "SUCCESS" | "FAILED" | "ERROR";
  message: string | null;
  data?: T;
}

// ✅ 페이지네이션 응답 타입
export interface PagedResponse<T> extends ApiResponse<T> {
  page: number;
  size: number;
  total: number;
}

// ✅ 필드 에러 (각 입력 필드의 오류 메시지)
export interface FieldError {
  field: string;
  message: string;
}

// ✅ 실패 응답 (Validation 에러 등)
export interface ErrorResponse extends ApiResponse<null> {
  errors?: FieldError[];
}
