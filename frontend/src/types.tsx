export type Author = {
  id: number;
  username: string;
};

export type Response = {
  id: number;
  body: string;
  response_count?: number; // optional, since not always present
  author: Author;
  upvote_count: number;
  created_at: string;
  updated_at: string;
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
