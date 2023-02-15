import React from "react";
import { useState, useEffect, useRef } from "react";
import useComponentVisible from "../hooks/useComponentVisible"

export default function TypingTest() {
    const commonWords =  [ 'the' , 'at' , 'there' , 'some' , 'my'
                    , 'of' , 'be' , 'use' , 'her' , 'than'
                    , 'and' , 'this' , 'an' , 'would' , 'first'
                    , 'a' , 'have' , 'each' , 'make' , 'water'
                    , 'to' , 'from' , 'which' , 'like' , 'been'
                    , 'in' , 'or' , 'she' , 'him', 'call'
                    , 'is' , 'one' , 'do' , 'into' , 'who'
                    , 'you' , 'had' , 'how' , 'time' , 'oil'
                    , 'that' , 'by' , 'their' , 'has' , 'its'
                    , 'it' , 'word' , 'if' , 'look' , 'now'
                    , 'he' , 'but' , 'will' , 'two' , 'find'
                    , 'was' , 'not' , 'up' , 'more' , 'long'
                    , 'for' , 'what' , 'other' , 'write' , 'down'
                    , 'on' , 'all' , 'about' , 'go' , 'day'
                    , 'are' , 'were' , 'out' , 'see' , 'did'
                    , 'as' , 'we' , 'many' , 'number' , 'get'
                    , 'with' , 'when' , 'then' , 'no' , 'come'
                    , 'his' , 'your' , 'them' , 'way' , 'made'
                    , 'they' , 'can', 'these' , 'could' , 'may'
                    , 'I' , 'said' , 'so' , 'people' , 'part' ];

    const wordCount = commonWords.length;

    const [words, setWords] = useState('');
    const [input, setInput] = useState('');
    const [caretX, setCaretX] = useState(0);
    const [caretY, setCaretY] = useState(0);
    const [characters, setCharacters] = useState([]);
    const [score, setScore] = useState(0);
    const [seconds, setSeconds] = useState(30);

    const inputRef = useRef(null);
    const backspacePressed = useRef(false);
    const spacePressed = useRef(false);
    const timerId = useRef();
    const gameStart = useRef(false);

    // on load
    useEffect(() => {
        setWords('');
        setInput('');
        setCaretX(0);
        generateWords(80);
        resetStyling();
    }, []);

    // to handle aysync
    useEffect(() => {
        setCharacters([...(document.querySelectorAll("#character-el"))]);
        if (gameStart.current == false && input != '') {
            gameStart.current = true;
            startTimer();
        }
    }, [input]);
    useEffect(() => {updateCaret()}, [characters]);
    useEffect(() => {evaluateCharacter()}, [caretX, caretY]);

    useEffect(() => {checkIfFinished()}, [seconds]);

    // custom hook to handle focus
    const { ref, isComponentVisible } = useComponentVisible(false); 

    const startTimer = () => {
        timerId.current = setInterval(() => {
            setSeconds((prevSeconds) => {
                const newSeconds = prevSeconds - 1;
                if (newSeconds <= 0) {
                    clearInterval(timerId.current)
                    timerId.current = 0;
                }
                return newSeconds;
            });
        }, 1000);
   };

   const checkIfFinished = () => {
        if (seconds == 0) {
            console.log("timer finished")
        }
   };

    const generateWords = (length) => {
        let randomWords = '';

        for (let i=0; i<length; i++) {
            let randomIdx = Math.floor(Math.random() * wordCount);
            randomWords += commonWords[randomIdx] + ' ';
        }
        setWords(randomWords.trim())
    };

    const generateNewWords = (length) => {
        let randomWords = '';

        for (let i=0; i<length; i++) {
            let randomIdx = Math.floor(Math.random() * wordCount);
            randomWords += commonWords[randomIdx] + ' ';
        }

        setWords(previousWords => previousWords.trim() + ' ' + randomWords)
    }

    const handleReset = () => {
        setInput('');
        resetStyling();
        setCaretX(0);
        generateWords(80);
        inputRef.current.focus();
        setScore(0);
        setSeconds(30);
    };

    const handleChange = e => { //maybe not efficient
        backspacePressed.current = false;
        spacePressed.current = false;
        setInput(e.target.value);
        // detect backspace so evaluateCharacter can handle
        if (e.nativeEvent.inputType == "deleteContentBackward") 
            backspacePressed.current = true;
        if (e.nativeEvent.data == ' ') {
            spacePressed.current = true;
        }
        
   };

   const handleFocus = e => {
        inputRef.current.focus();
        setCaretX(0);
        // setView(true);
   }

   /*
   Use on keydown to handle keypresses

   1. detect backspaces and do respective code
        -remove styling when needed
        -deny backspace when at start
   2. detect spaces and do respective code
   3. else call evaluate character
   */

   const resetStyling = () => {
        characters.forEach((character) => {
            character.className = "untyped";
        })
   };

   const evaluateCharacter = () => {  
        let prevElement = characters[input.length-1];
        let currElement = characters[input.length];

        if (backspacePressed.current == true) {
            currElement.className = "untyped";  
        } else { 
            if (prevElement && (input.length <= words.length)) {
                let typedChar = input.slice(-1);
                let correctChar = prevElement.innerHTML;

                if (typedChar == correctChar) {
                    prevElement.className = "correct";
                } else if ((typedChar == ' ')  && (correctChar == '&nbsp;')) {
                    // do nothing
                } else {
                    prevElement.className = "wrong";
                }
            }
        }

        if (caretY == 56) {
            removeTopLine();
            setCaretY(24);
            generateNewWords(13);
        }

        // to calculate score (replace this eventually with hooks implimentation)
        let scoreCount = 0;
        document.querySelectorAll("#word-el").forEach(word => {
            var children = word.children;
            let correct = true;
            for (let i=0; i<children.length; i++) {       
                if (children[i].className == "wrong" || children[i].className == "untyped") {
                    correct = false;
                } 
            }
            if (correct == true) {
                scoreCount++;
            }
        })
        setScore(scoreCount)
   };

    // const calculateWpm = () => {

    // }

    const updateCaret = () => {
        if (words != '') { // eventually replace conditional with isLoaded conditional
            let prevElement = characters[input.length-1];
            let currentElement = characters[input.length];
            setCaretX(currentElement.offsetLeft);
            setCaretY(currentElement.offsetTop);

            // console.log("'"+input+"'");
            // console.log("'"+words+"'");
        }
    };

    /*
    So far this is the only way I have figured out how to implement removing the 
    topline from the word box. If I try manipulating the dom, directly my code 
    breaks very easily. Here are the two other ways I have tried which are
    probably wrong because they manipulate the DOM in a "non-reactful" way by
    using query selector

    1.  Count the top characters the same way as below, then use remove() to
        to directly remove from the DOM. However, this is wrong as, the "words" 
        useState variable is still keeping track of the previous words that are 
        unmodified.

    2.  Count the top characters the same way as below, keeping track of the 
        number of chars in the top line. Then use this number as the termination
        of a for loop to iteratively remove chars from the "words" useState 
        variable. This however, breaks styling as the words are rerendered and
        the DOM (not sure if thats the correct term) "loses track" of the previous
        styling.

        *note: both methods remove characters from "input" variable as well to 
        maintain updateCaret functionality.
    */
    const removeTopLine = () => {
        let charactersToHide = [];

        characters.forEach(char => {
            if (char.offsetTop == 0) {
                charactersToHide.push(char);
            }            
        });

        charactersToHide.forEach(char => {
            char.classList.add("sr-only");
        });
    };

    const renderWords = words.split(' ').map((word, i) =>
        <React.Fragment key={`fragment ${i}`}>
            <span 
                id="word-el" 
                className="inline-block" 
                key={`word ${i}`}>
            {
                word.split('').map((letter, j) =>     
                    <div 
                        id="character-el" 
                        className="untyped" 
                        key={`characterbe ${j} ${letter}`}>
                        {letter}
                    </div>
                )      
            }
            </span>
            <span id="character-el" key={`nbsp ${i}`}>&nbsp;</span>
        </React.Fragment>
    );    

    const calculateScore = () => {
        console.log("score: " + score)
        console.log("time: " + seconds)
        if (seconds == 30) {
            return 0;
        } else {
            return Math.floor(score / ((30-seconds)/60));
        }
        
    }

    return (
        <>
            <div className="h-28 text-4xl font-mono items-center">
                <div>time: {seconds}</div>
                <div>wpm: {calculateScore()}</div>
            </div>
            <button onClick={handleReset}>reset</button>
            <div ref={ref} id="text-box" className="border-4 h-[95px] w-[610px] relative" onClick={handleFocus}>
                <input 
                    className="sr-only" 
                    onChange={(handleChange)}
                    ref={inputRef}
                    value={input}
                />
                <div id="words-wrapper" className="w-[600px] m-0 p-0 text-xl">{renderWords}</div>
                <div  
                    id="caret-el"
                    className={`absolute inset-0 w-[2px] h-[25px] bg-black animate-pulse`} 
                    style={{left: `${caretX}px`, top: `${caretY+3}px`, display: `${isComponentVisible ? "block" : "none"}`}}
                />
            </div>
        </>
    );
}