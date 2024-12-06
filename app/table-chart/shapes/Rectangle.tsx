import React from 'react';

const Rectangle = ({height, width, text, color}) => {
    return (
        <svg height={height} width={width}>
            <rect height={height} width={width} fill={color} />
            {text && text.trim() !== '' ?
                <text
                    x="50%"
                    y="50%"
                    textAnchor={'middle'}
                    color={'white'}
                    stroke="white"
                    strokeWidth="2px"
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