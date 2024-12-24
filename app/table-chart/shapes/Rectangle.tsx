import React from 'react';
import {getBrightness} from "@/app/util/rgb-util";

const Rectangle = ({height, width, text, color}) => {
    const textColor = getBrightness(color) > 40 ? 'black' : 'white';
    return (
        <svg height={height} width={width}>
            <rect height={height} width={width} fill={color} stroke={textColor} strokeWidth={'2px'} />
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
    )
};

export default Rectangle;