import { Link } from "react-router-dom";
import {useContext, useEffect, useState} from 'react'
import {QuestionCard} from '../Components/questioncard'
import {QuestionContext} from '../utills/question'
import type {Question} from '../types'


function Home(){
    const context = useContext(QuestionContext);
        if (!context) {    throw new Error("useContext(QuestionContext) returned null — did you forget to wrap a provider?");}
        const {getquestions} = context;
    
        const [questions, setQuestions] = useState<Question[]>([]);
    
        useEffect(() =>{
            const fetchQuestion = async () =>{
                const data = await getquestions(); 
                setQuestions(data);
            };
            fetchQuestion();
    
        },[]);
    
    return(
    <div className ="homePage">
        <div className="homePage-hero">
            <h1 className="hero-title">Welcome to Mini Stack Overflow</h1>
      <p className="hero-subtitle">
        A place to ask technical questions and get help from fellow developers. Jump in and share your knowledge!
      </p>
      <Link to = "/ask" className="hero-button">Ask a question</Link>
    
        </div>
        <div className="homePage-questions">
            {questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
))}
        </div>
        
    </div>
    )
}
export default Home