'use client';
import {QuestionAndAnswer} from "@/app/faq/QuestionAndAnswer";
import {Divider} from "@mantine/core";
import {APP_MODE, RSVP_DEADLINE} from "@/constants/app-constants";
import EmailModal from "@/app/EmailModal";

export default function FAQPage() {
    const isSaveTheDateMode = APP_MODE === 'SAVE_THE_DATE';
    const questionsAndAnswers = [
        {
            question: 'Where is the wedding and reception being held?',
            answer: <div className={'flex flex-col justify-center items-center'}>
                <p>Hilton Chicago/Oak Brook Hills Resort & Conference Center, 3500 Midwest Road, Oak Brook, IL, 60523,
                    USA</p>
                <div className={'p-4 md:p-8'}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2973.327526011273!2d-87.97474292398235!3d41.821244971248014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e4e80128e97e7%3A0x7907206e6fd07ffd!2sHilton%20Chicago%2FOak%20Brook%20Hills%20Resort%20%26%20Conference%20Center!5e0!3m2!1sen!2sus!4v1730768469484!5m2!1sen!2sus"
                        width="300" height="225" style={{border: 0}}></iframe>
                </div>
            </div>
        },
        ...(isSaveTheDateMode ? [] : [{
            question: 'When is the RSVP deadline?',
            answer: `We ask that you please RSVP on this website by ${RSVP_DEADLINE}.`
        }]),
        {
            question: 'Is there a dress code?',
            answer: 'Cocktail attire. We suggest that men wear a suit or dress shirt with tie and women wear a dress or dressy separates.'
        },
        {
            question: 'Will the wedding be indoors or outdoors?',
            answer: 'The ceremony will be outdoors if weather permits followed by an indoor reception.  The cocktail hour will take place outdoors if weather permits as well. Please dress comfortably and plan for the weather.'
        },
        ...(isSaveTheDateMode ? [] : [{
            question: 'What time should I arrive for the ceremony?',
            answer: 'Please arrive at 5:15 PM as the ceremony will start promptly at 5:30 PM.'
        }]),
        {
            question: 'Are children invited to attend the wedding and reception?',
            answer: 'While we love your little ones, we have chosen to make this event an adults only celebration.'
        },
        {
            question: 'Can I bring a plus one?',
            answer: 'We are only able to accommodate those listed on your invitation. Thank you for your understanding and we can\'t wait to celebrate with you!'
        },
        {
            question: 'Is there parking at the wedding venue?',
            answer: 'Yes! There is free parking at the hotel.  If you plan on drinking and aren\'t staying overnight, we recommend using a ride share to get to and from the venue!'
        },
        ...(isSaveTheDateMode ? [] : [{
            question: 'What if I have food allergies or dietary restrictions?',
            answer: 'Please let us know when you RSVP and we will do our best to accommodate!'
        }])
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