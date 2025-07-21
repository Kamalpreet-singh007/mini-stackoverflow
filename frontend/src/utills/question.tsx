import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CommentDescription, Question, Response } from '../types';

interface QuestionContextType {
  getquestions: () => Promise<Question[]>;
  getQuestionDescription: (id: number) => Promise<Response[]>;
  getComments: (responseId: number) => Promise<CommentDescription[]>;
  getResponseById: (response_Id: number) => Promise<Response>;

  postResponse: (id: number, body: string) => void;
  postComment: (
    responseId: number,
    body: string
  ) => Promise<CommentDescription | undefined>;

  upvote: (entity_id: number, entity_type: string) => void;
  downvote: (entity_id: number, entity_type: string) => void;
  questions: Question[] | undefined;
}

export const QuestionContext = createContext<QuestionContextType | null>(null);

export const QuestionContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [questions, setquestions] = useState<Question[] | undefined>(undefined);

  const getquestions = async () => {
    const token = localStorage.getItem('access_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    try {
      const response = await fetch('http://localhost:8000/api/questions/', {
        method: 'Get',
        headers,
      });
      if (!response.ok) {
        throw new Error('unable to fetch questions');
      }
      const data = await response.json();
      const questions = data || [];
      setquestions(questions);
      return questions;
    } catch (error) {
      console.error('fetch error:', error);
      alert('unable to fetch.');
    }
  };

  const getQuestionDescription = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(
        `http://localhost:8000/api/questions/${id}/responses`,
        {
          method: 'Get',
          headers,
        }
      );
      if (!response.ok) {
        throw new Error('unable to fetch responses');
      }
      const data = await response.json();
      const questionsDescription = data || [];
      return questionsDescription;
    } catch (error) {
      console.error('fetch error:', error);
      alert('unable to fetch question description.');
    }
  };
  const postResponse = async (id: number, body: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/questions/${id}/responses/`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            body: body,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('response post failed');
      }
      alert('Succesfully Posted The Response');
    } catch (error) {
      console.error('fetch error:', error);
      alert('unable to post response.');
    }
  };
  const getComments = async (responseId: Number) => {
    try {
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(
        `http://localhost:8000/api/responses/${responseId}/comments/`,
        {
          method: 'Get',
          headers,
        }
      );
      if (!response.ok) {
        throw new Error('unable to fetch comments');
      }
      const data = await response.json();
      console.log('comments data:', data);
      return data || [];
    } catch (error) {
      console.error('fetch error:', error);
      alert('unable to fetch comments.');
    }
  };

  const postComment = async (responseId: Number, body: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/responses/${responseId}/comments/`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            body: body,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('comment post failed');
      }
      alert('Succesfully Posted The Response');
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('fetch error:', error);
      alert('unable to post Comment.');
    }
  };
  const upvote = async (entity_id: number, entity_type: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/upvote/${entity_id}/add`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            entity_type: entity_type,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`unable to upvote${entity_type}`);
      }
      console.log('upvoted succesfully ');
    } catch (error) {
      console.error('upvote error', error);
    }
  };
  const downvote = async (entity_id: number, entity_type: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/upvote/${entity_id}/unlike`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            entity_type: entity_type,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`unable to downvote${entity_type}`);
      }
      console.log('downvoted succesfully ');
    } catch (error) {
      console.error('downvote error', error);
    }
  };

  const getResponseById = async (response_id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/responses/${response_id}/`,
        {
          method: 'Get',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`unable to get singel response `);
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('get error', error);
    }
  };
  return (
    <QuestionContext.Provider
      value={{
        getquestions,
        getQuestionDescription,
        questions,
        postResponse,
        postComment,
        getComments,
        upvote,
        downvote,
        getResponseById,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
