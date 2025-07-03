import { useParams } from 'react-router-dom';

export const AskQuestionPage = () =>{
    const { id } = useParams();
    return (
    <>
    <h1>ask page</h1>
    <p>{id}</p>
    </>)
}
export default AskQuestionPage