import {OverrideFont} from "@/app/components/OverrideFont";

const KatieAndSpencersWeddingTitle = () => {
    const getDaysBetweenDates = (date1, date2) => {
        const timeDiff = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };

    const today = new Date();
    today.setHours(0,0,0,0);
    const date2 = new Date('2025-10-11');

    const daysBetween = getDaysBetweenDates(today, date2);
    console.log(daysBetween);
    return (
        <div className={'text-white flex flex-col justify-center items-center gap-4'}>
            <div className={'py-8'}>
                <OverrideFont>
                    <div className={'text-center'}>
                        <p className={'text-6xl sm:text-7xl'}>Katie & Spencer&apos;s</p>
                        <p className={'text-6xl sm:text-7xl pt-4'}>Wedding</p>
                    </div>
                </OverrideFont>
            </div>
            <div>
                <p className={'text-4xl sm:text-5xl'}>10.11.2025</p>
            </div>
            <div>
                <p className={'text-2xl sm:text-3xl'}>{`${daysBetween} Days To Go`}</p>
            </div>
        </div>
    )
};

export default KatieAndSpencersWeddingTitle;