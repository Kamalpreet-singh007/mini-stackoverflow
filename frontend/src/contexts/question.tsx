import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CommentDescription, Question, Response } from '../types';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';

interface QuestionContextType {
  getquestions: () => Promise<Question[]>;
  getResponses: (id: number) => Promise<Response[]>;
  getComments: (responseId: number) => Promise<CommentDescription[]>;
  getResponseById: (response_Id: number) => Promise<Response>;
  getQuestionbyId: (id: number) => Promise<Question>;
  postResponse: (id: number, body: string) => void;
  postQuestion: (title: string, body: string) => Promise<void>;
  postComment: (responseId: number, body: string) => Promise<CommentDescription | undefined>;
  deleteQuestion_: (question_id: number) => Promise<void>;
  getSearchedQuestion: (query: string) => Promise<Question[]>;
  updateQuestion: (id: number, body: string) => Promise<void>;
  upvote: (entity_id: number, entity_type: string) => void;
  downvote: (entity_id: number, entity_type: string) => void;
  setquestions: React.Dispatch<React.SetStateAction<Question[]>>;
  questions: Question[];
}

export const QuestionContext = createContext<QuestionContextType | null>(null);

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const QuestionContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [questions, setquestions] = useState<Question[]>([]);
  const navigate = useNavigate();

  const getquestions = async () => {
    try {
      const data = await apiFetch<Question[]>('/questions/', {
        method: 'GET', headers: getAuthHeaders(),
      });
      setquestions(data || []);
      return data || [];
    } catch (error) {
      console.error('fetch error:', error);
      return [];
    }
  };

  const getSearchedQuestion = async (query: string) => {
    try {
      const data = await apiFetch<Question[]>(`/questions/search/?search=${query}`, { 
        method: 'GET', headers: getAuthHeaders() 
      });
      setquestions(data || []);
      return data || [];
    } catch (error) {
      console.error('fetch error:', error);
      return [];
    }
  };

  const getResponses = async (id: number) => {
    try {
      const data = await apiFetch<Response[]>(`/questions/${id}/responses`, { 
        method: 'GET', headers: getAuthHeaders() 
      });
      return data || [];
    } catch (error) {
      console.error('fetch error:', error);
      return [];
    }
  };

  const postResponse = async (id: number, body: string) => {
    try {
      await apiFetch(`/questions/${id}/responses/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ body }),
      });
      alert('Response posted successfully!');
    } catch (error) {
      console.error('fetch error:', error);
      alert('Unable to post response.');
    }
  };

  const postQuestion = async (title: string, body: string) => {
    if (!localStorage.getItem('access_token')) { alert('Please login to ask a question.'); return; }
    try {
      await apiFetch('/questions/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, body }),
      });
      alert('Question added successfully!');
      navigate('/home');
    } catch (error) {
      console.error('fetch error:', error);
      alert('Unable to post question.');
    }
  };

  const getComments = async (responseId: number) => {
    try {
      const data = await apiFetch<CommentDescription[]>(`/responses/${responseId}/comments/`, { 
        method: 'GET', headers: getAuthHeaders() 
      });
      return data || [];
    } catch (error) {
      console.error('fetch error:', error);
      return [];
    }
  };

  const postComment = async (responseId: number, body: string) => {
    try {
      const data = await apiFetch<CommentDescription>(`/responses/${responseId}/comments/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ body }),
      });
      return data;
    } catch (error) {
      console.error('fetch error:', error);
      alert('Unable to post comment.');
      return undefined;
    }
  };

  const upvote = async (entity_id: number, entity_type: string) => {
    try {
      await apiFetch(`/upvote/${entity_id}/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ entity_type }),
      });
    } catch (error) {
      console.error('upvote error', error);
    }
  };

  const downvote = async (entity_id: number, entity_type: string) => {
    try {
      await apiFetch(`/upvote/${entity_id}/unlike`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ entity_type }),
      });
    } catch (error) {
      console.error('downvote error', error);
    }
  };

  const getResponseById = async (response_id: number) => {
    try {
      return await apiFetch<Response>(`/responses/${response_id}/`, { 
        method: 'GET', headers: getAuthHeaders() 
      });
    } catch (error) {
      console.error('get error', error);
      return null;
    }
  };

  const getQuestionbyId = async (id: number) => {
    try {
      return await apiFetch<Question>(`/questions/${id}/`, { 
        method: 'GET', headers: getAuthHeaders() 
      });
    } catch (error) {
      console.error('get error', error);
      return null;
    }
  };

  const deleteQuestion_ = async (question_id: number) => {
    try {
      await apiFetch(`/questions/${question_id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      alert('Question deleted successfully');
    } catch (error) {
      console.error('delete error', error);
      alert('Unable to delete question.');
    }
  };

  const updateQuestion = async (id: number, body: string) => {
    try {
      await apiFetch(`/questions/${id}/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ body }),
      });
      alert('Question updated successfully');
      navigate(`/question/${id}`);
    } catch (error) {
      console.error('update error', error);
      alert('Unable to update question.');
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        getquestions, getSearchedQuestion, getResponses, questions,
        postResponse, postComment, getComments, upvote, downvote,
        getResponseById, getQuestionbyId, deleteQuestion_, postQuestion,
        updateQuestion, setquestions,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};
