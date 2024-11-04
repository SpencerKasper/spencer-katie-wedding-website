import {QuestionAndAnswer} from "@/app/faq/QuestionAndAnswer";
import {Divider} from "@mantine/core";
import {OverrideFont} from "@/app/components/OverrideFont";

const RSVP_DEADLINE = 'September 1st, 2025';

export default async function FAQPage() {
    const questionsAndAnswers = [
        {question: 'When is the RSVP deadline?', answer: `We ask that you please RSVP on this website by ${RSVP_DEADLINE}.`},
        {question: 'Is there a dress code?', answer: 'Cocktail attire. We suggest that men wear a suit or dress shirt with tie and women wear a dress or dressy separates.'},
        {question: 'Will the wedding being indoors or outdoors?', answer: 'The ceremony will be outdoors if weather permits followed by an indoor reception.  The cocktail hour will take place outdoors if weather permits as well.'},
        {question: 'What time should I arrive for the ceremony?', answer: 'This information will be provided shortly.'},
        {
            question: 'Are children invited to attend the wedding and reception?',
            answer: 'This is going to be an 18+ event. We respectfully request no children under 18 at the reception.'
        },
        {question: 'Can I bring a plus one?', answer: 'If your invite was addressed with a plus one, then yes! Otherwise, no.'},
        {question: 'What if I have food allergies or dietary restrictions?', answer: 'Please let us know when you RSVP and we will do our best to accommodate!'}
    ]
    return (
        <div className={'text-white'}>
            <div className={'w-full text-center'}>
                <h1 className={'text-7xl'}>FAQ</h1>
            </div>
            <div className={'flex flex-col justify-center items-center gap-8 p-8'}>
                {questionsAndAnswers.map((x, index) =>
                    <div className={'max-w-xl w-full'} key={`q-a-${index}`}>
                        <QuestionAndAnswer
                            question={x.question}
                            answer={x.answer}
                        />
                        {index + 1 !== questionsAndAnswers.length ? <Divider my={'md'}/> : <></>}
                    </div>
                )}
            </div>
        </div>
    )
}