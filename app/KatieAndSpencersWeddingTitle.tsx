import {OverrideFont} from "@/app/components/OverrideFont";

const KatieAndSpencersWeddingTitle = () => {
    return (
        <div className={'text-white flex flex-col justify-center items-center'}>
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
        </div>
    )
};

export default KatieAndSpencersWeddingTitle;