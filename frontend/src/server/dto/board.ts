export interface GetMultiBoardRes {
  id: number;
  userId?: number;
  userName?: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  files: GetFileRes[];
}

export interface PostMultiBoardReq {
  id: number;
  title: string;
  content: string;
  category: string;
  fileIds: number[];
}

export interface GetBoardListRes {
  id: number;
  userId: number;
  userName: string;
  title: string;
  createdAt: string;
  commentCount: number;
}

export interface GetFileRes {
  id: number;
  actualFileName: string;
  path: string;
  size: number;
}

export interface GetBoardCategoryRes {
  name: string;
  label: string;
}

export interface GetBoardCommentRes {
  id: number;
  userId: number;
  userName: number;
  content: string;
  createdAt: string;
}

export interface GetBoardRes {
  id: number;
  userId: number;
  userName: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  files: GetFileRes[];
}
