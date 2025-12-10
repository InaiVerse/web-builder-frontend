import { useState, useEffect } from 'react';

const useTypewriter = (text, speed = 50, delay = 1000) => {
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(speed);

    useEffect(() => {
        let timer;
        const handleType = () => {
            const i = loopNum % 1; // Currently only handling one string, but structure allows for array if needed later
            const fullText = text;

            setDisplayText(isDeleting
                ? fullText.substring(0, displayText.length - 1)
                : fullText.substring(0, displayText.length + 1)
            );

            setTypingSpeed(isDeleting ? speed / 2 : speed);

            if (!isDeleting && displayText === fullText) {
                timer = setTimeout(() => setIsDeleting(true), delay);
            } else if (isDeleting && displayText === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            } else {
                timer = setTimeout(handleType, typingSpeed);
            }
        };

        timer = setTimeout(handleType, typingSpeed);

        return () => clearTimeout(timer);
    }, [displayText, isDeleting, loopNum, typingSpeed, text, speed, delay]);

    return displayText;
};

export default useTypewriter;