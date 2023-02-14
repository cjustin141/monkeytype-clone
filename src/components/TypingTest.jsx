import React from "react";
import { useState, useEffect, useRef } from "react";

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
    const [wpm, setWpm] = useState(0);
    const [counter, setCounter] = useState(60);

    const inputRef = useRef(null);
    const backspacePressed = useRef(false);
    const spacePressed = useRef(false);
    const renders = useRef(0);

    // on load
    useEffect(() => {
        setWords('');
        setInput('');
        setCaretX(0);
        generateWords(80);
        resetStyling();
    }, []);

    // to handle aysync
    useEffect(() => {setCharacters([...(document.querySelectorAll("#character-el"))])}, [input]);
    useEffect(() => {updateCaret()}, [characters]);
    useEffect(() => {evaluateCharacter()}, [caretX, caretY]);

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

   const startTimer = () => {
        
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
   };

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

    return (
        <>
            <div className="h-28 text-4xl font-mono items-center">
                <div>time: {counter}</div>
                <div>wpm: {wpm}</div>
            </div>
            <button onClick={handleReset}>reset</button>
            <button onClick={startTimer}>start</button>
            <div id="text-box" className="border-4 h-[95px] w-[610px] relative" onClick={() => {inputRef.current.focus()}}>
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
                    style={{left: `${caretX}px`, top: `${caretY+3}px`}}
                />
            </div>
        </>
    );
}