export const QuestionAndAnswer = ({question, answer}) => {
    return (
        <div className={'flex flex-col w-full'}>
            <p className={'text-2xl font-bold'}>{question}</p>
            <p className={'text-xl'}>{answer}</p>
        </div>
    );
}