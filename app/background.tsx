import {ReactNode} from "react";

export default function Background({children}: {children: ReactNode}) {
    return (
        <div
            style={{backgroundImage: 'url(/background/background-4.jpg)'}}
            className="bg-cover bg-center min-h-screen"
        >
            {children}
        </div>
    )
}