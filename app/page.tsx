export default function Home() {
    return (
        <div
            style={{backgroundImage: 'url(/background/background-4.jpg)'}}
            className="bg-cover bg-center"
        >
            <div
                className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                    <div>
                        <div className={'flex flex-col'}>
                            <h1 className={'text-6xl text-black text-center font-bold'}>Katie and Spencer&apos;s Wedding
                                Website</h1>
                        </div>
                        <div>
                            <h2 className={'text-3xl text-black text-center font-bold'}>Coming Soon...</h2>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
