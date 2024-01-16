import React, { useEffect, useState } from 'react';

export default function Countdown({ second, onOver }) {
    const [seconds, setSeconds] = useState(second);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            } else {
                onOver();
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    });

    return (<div>{seconds}</div>)
}