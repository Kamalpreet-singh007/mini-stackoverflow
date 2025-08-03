import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CommentDescription, Question, Response } from '../types';
import { useNavigate } from 'react-router-dom';

interface QuestionContextType {
  getquestions: () => Promise<Question[]>;
  getResponses: (id: number) => Promise<Response[]>;
  getComments: (responseId: number) => Promise<CommentDescription[]>;
  getResponseById: (response_Id: number) => Promise<Response>;
  getQuestionbyId: (id: number) => Promise<Question | undefined>;
  postResponse: (id: number, body: string) => void;
  postQuestion: (title: string, body: string) => Promise<void>;
  postComment: (
    responseId: number,
    body: string
  ) => Promise<CommentDescription | undefined>;

  deleteQuestion_: (question_id: Number) => Promise<void>;

  updateQuestion: (id: number, body: string) => Promise<void>;

  upvote: (entity_id: number, entity_type: string) => void;
  downvote: (entity_id: number, entity_type: string) => void;
  questions: Question[] | undefined;
}

export const QuestionContext = createContext<QuestionContextType | null>(null);

export const QuestionContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [questions, setquestions] = useState<Question[] | undefined>(undefined);
  const navigate = useNavigate();

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

  const getResponses = async (id: number) => {
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
  const postQuestion = async (title: string, body: string) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please login to ask a question.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/questions/', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          body: body,
        }),
      });
      if (!response.ok) {
        throw new Error('Question post failed');
      }
      alert('question added successfully');
      navigate('/');
    } catch (error) {
      console.error('fetch error:', error);
      alert('unable to post question.');
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
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(
        `http://localhost:8000/api/responses/${response_id}/`,
        {
          method: 'GET',
          headers,
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
  const getQuestionbyId = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(
        `http://localhost:8000/api/questions/${id}/`,
        {
          method: 'Get',
          headers,
        }
      );
      if (!response.ok) {
        throw new Error(`unable to get question by id`);
      }
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('get error', error);
    }
  };
  const deleteQuestion_ = async (question_id: Number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/questions/${question_id}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('unable to delete question');
      }
      alert('Question deleted successfully');
    } catch (error) {
      console.error('delete error', error);
      alert('unable to delete question.');
    }
  };
  const updateQuestion = async (id: number, body: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/questions/${id}/`,
        {
          method: 'PATCH',
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
        throw new Error('unable to update question');
      }
      alert('Question updated successfully');
      navigate(`/question/${id}`);
    } catch (error) {
      console.error('update error', error);
      alert('unable to update question.');
    }
  };
  return (
    <QuestionContext.Provider
      value={{
        getquestions,
        getResponses,
        questions,
        postResponse,
        postComment,
        getComments,
        upvote,
        downvote,
        getResponseById,
        getQuestionbyId,
        deleteQuestion_,
        postQuestion,
        updateQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
