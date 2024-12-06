import React from 'react';

const Circle = ({size = 100, color = 'black', text = null}) => {
    return (
        <svg width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color}/>
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
    );
};

export default Circle;