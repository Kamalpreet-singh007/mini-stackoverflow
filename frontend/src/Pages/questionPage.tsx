import {QuestionCard } from "../Components/questioncard"
import {useState, useContext, useEffect} from 'react'
import {QuestionContext} from '../utills/question'
import type {Question} from '../types'
import{authContext} from '../utills/auth'


const QuestionsPage = () =>{
    const questionContext = useContext(QuestionContext);
    if (!questionContext) {    throw new Error("useContext(QuestionContext) returned null — did you forget to wrap a provider?");}
        const {getquestions} = questionContext;

    const userContext = useContext(authContext);
        if (!userContext|| !userContext.user) {    throw new Error("useContext(userContext) returned null — did you forget to wrap a provider?");}
            const {user} = userContext;
        const user_id = user.id;


    const[questions, setQuestions] = useState<Question[]>([]);
    
     useEffect(() =>{
        const fetchQuestion = async () =>{
            const allQuestions = await getquestions(); 
            const userQuestions = allQuestions.filter((q) => q.author.id === user_id);
            console.log("in fetch",userQuestions)
            setQuestions(userQuestions);
        }
        fetchQuestion();
     },[])
    return(
        <>
        <h1  className="flex justify-center  pb-4px">My questions</h1  >
        {questions.map((q) =>(
            <QuestionCard key={q.id} question={q} />
        ))}
        </>
    )
}

export default QuestionsPage

