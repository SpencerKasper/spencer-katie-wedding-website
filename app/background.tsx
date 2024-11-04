import {ReactNode} from "react";

export default function Background({children}: {children: ReactNode}) {
    return (
        <div
            style={{backgroundImage: 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(/background/background-4.jpg)'}}
            className="bg-cover bg-center"
        >
            {children}
        </div>
    )
}