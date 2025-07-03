import {createContext,useState} from "react";
import type { ReactNode } from "react";
import type {Question,responseDescription} from '../types'


interface QuestionContextType{

    getquestions:()=>Promise<Question[]>;
    getQuestionDescription:(id:number) => Promise<responseDescription>;
    postResponse:(id:number,body:string) =>void;
    questions:Question[]|undefined;

}

export const QuestionContext = createContext<QuestionContextType|null>(null);

export const QuestionContextProvider: React.FC<{ children: ReactNode }> =({children}) =>{
    const[questions, setquestions] = useState<Question[]|undefined>(undefined       )
    
    const getquestions =async()=>{
        try{
            const response = await fetch("http://localhost:8000/api/questions/",
                {
                    method : "Get",
                    headers:{
                        "Content-Type": "application/json",
                    }

                }
            )
            if (!response.ok){
                throw new Error("unable to fetch questions");
            }
            const data =await response.json();
            const questions = data ||[];
            setquestions(questions)
            return questions;
            
        }
        catch(error){
            console.error("fetch error:",error);
        alert("unable to fetch.");
  
        }
    }

    const getQuestionDescription = async(id:number) =>{
const response = await fetch(`http://localhost:8000/api/questions/${id}/responses`,
                {
                    method : "Get",
                    headers:{
                        "Content-Type": "application/json",
                    }
                })
            if (!response.ok){
                throw new Error("unable to fetch responses");
            }
            const data = await response.json()
            const questionsDescription = data ||[];
            
            return questionsDescription;

    
        }        
    const postResponse = async(id:number,body:string)=>{

        const response = await fetch(`http://localhost:8000/api/questions/${id}/responses/`,
            {method:"post",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_    token")}`,

                },
                body:JSON.stringify({
                    body:body,
                })

            });
            if(!response.ok){
                throw new Error("post failed");
                    
            }
            alert("Succesfully Posted The Response");
    }
    return (
    <QuestionContext.Provider value={{getquestions,getQuestionDescription, questions,postResponse }}>
      {children}
    </QuestionContext.Provider>
  );

}