export type Author = {
  id: number;
  username: string;
};

export type Response = {
  id: number;
  body: string;
  comment_count?: number; // optional, since not always present
  author: Author;
  upvote_count: number;
  created_at: string;
  updated_at: string;
  upvoted_by_user: boolean;
};

export type Question = {
  id: number;
  title: string;
  body: string;
  author: Author;
  upvote_count: number;
  created_at: string;
  updated_at: string;
  response_count: number;
  upvoted_by_user: boolean;
};
export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  author: number;
  type_name: string;
};
export type ResponseDescription = {
  // userId:number;
  responses: Response[];
};

export type CommentDescription = {
  id: number;
  body: string;
  author: Author;
  created_at: string;
  updated_at: string;
  upvote_count: number;
  replies: CommentDescription[];
  upvoted_by_user: boolean;
};
