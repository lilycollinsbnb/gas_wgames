import React from 'react';

export const PLFlagRound = ({ width = '32px', height = '32px' }) => {
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          width={width}
          height={height}
          viewBox="0 0 256 256"
          xmlSpace="preserve"
        >
          <defs />
          <g
            style={{
              stroke: 'none',
              strokeWidth: 0,
              strokeDasharray: 'none',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeMiterlimit: 10,
              fill: 'none',
              fillRule: 'nonzero',
              opacity: 1,
            }}
            transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
          >
            {/* Red background */}
            <path
              d="M 45 90 C 20.147 90 0 69.853 0 45 h 90 C 90 69.853 69.853 90 45 90 z"
              style={{
                stroke: 'none',
                strokeWidth: 1,
                strokeDasharray: 'none',
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                strokeMiterlimit: 10,
                fill: 'rgb(220,20,60)',
                fillRule: 'nonzero',
                opacity: 1,
              }}
              transform="matrix(1 0 0 1 0 0)"
              strokeLinecap="round"
            />
    
            {/* White stripe */}
            <path
              d="M 45 0 C 20.147 0 0 20.147 0 45 h 90 C 90 20.147 69.853 0 45 0 z"
              style={{
                stroke: 'none',
                strokeWidth: 1,
                strokeDasharray: 'none',
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                strokeMiterlimit: 10,
                fill: 'rgb(243,244,245)',
                fillRule: 'nonzero',
                opacity: 1,
              }}
              transform="matrix(1 0 0 1 0 0)"
              strokeLinecap="round"
            />
          </g>
        </svg>
      );
  };
