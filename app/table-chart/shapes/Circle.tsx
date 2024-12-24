import React from 'react';
import {getBrightness} from "@/app/util/rgb-util";

const Circle = ({size = 100, color = 'black', text = null}) => {
    const textColor = getBrightness(color) > 40 ? 'black' : 'white';
    return (
        <svg width={size + 4} height={size + 4}>
            <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} stroke={textColor} strokeWidth={'1px'}/>
            {text && text.trim() !== '' ?
                <text
                    x="50%"
                    y="50%"
                    textAnchor={'middle'}
                    color={textColor}
                    stroke={textColor}
                    strokeWidth="1px"
                    dy=".3em"
                >
                    {text}
                </text> :
                <></>
            }
        </svg>
    );
};

export default Circle;