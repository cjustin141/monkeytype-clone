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

    const inputRef = useRef(null);
    const backspacePressed = useRef(false);
    const spacePressed = useRef(false);

    // on load
    useEffect(() => {
        setWords('');
        setInput('');
        setCaretX(0);
        resetStyling();
        generateWords(80);
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
        setWords(randomWords)
    };

    const generateNewWord = () => {
        let randomIdx = Math.floor(Math.random() * wordCount);
        let randomWord = commonWords[randomIdx]

        setWords(previousWords => previousWords + ' ' + randomWord)
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

   const resetStyling = () => {
        characters.map((character) => {
            character.className = "inline-block text-gray-400";
        })
   };

   const evaluateCharacter = () => {  
        let prevElement = characters[input.length-1];
        let currElement = characters[input.length];

        if (backspacePressed.current == true) { 
            currElement.classList = "inline-block text-gray-400"; 
        } else { 
            if (prevElement && (input.length <= words.length)) {
                let typedChar = input.slice(-1);
                let correctChar = prevElement.innerHTML;

                if (typedChar == correctChar) {
                    prevElement.classList.add("text-black");
                } else if ((typedChar == ' ')  && (correctChar == '&nbsp;')) {
                    // do nothing
                } else {
                    prevElement.classList.add("text-red-600");
                }
            }
        }

        if (spacePressed.current == true) 
            generateNewWord();
   };

    const updateCaret = () => {
        if (words != '') {
            let prevElement = characters[input.length-1];
            let currentElement = characters[input.length];
            setCaretX(currentElement.offsetLeft);
            setCaretY(currentElement.offsetTop);
            // console.log("'"+input+"'");
            // console.log("'"+words+"'");
        }
    };

    const renderWords = words.split(' ').map((word, i) =>
        <React.Fragment key={`fragment ${i}`}>
            <span className="inline-block" key={i}>
            {
                word.split('').map((letter, j) =>     
                    <div 
                        id="character-el" 
                        className="inline-block text-gray-400" 
                        key={j}>
                        {letter}
                    </div>
                )      
            }
            </span>
            <span id="character-el" className="inline-block" key={`nbsp ${i}`}>&nbsp;</span>
            
        </React.Fragment>
    );    

    return (
        <>
            <button onClick={handleReset}>reset</button>
            <div id="text-box" className="border-4 h-20 w-45 relative" onClick={() => {inputRef.current.focus()}}>
                <input 
                    className="sr-only" 
                    onChange={(handleChange)}
                    ref={inputRef}
                    value={input}
                />
                <div id="words-wrapper" className="w-[400px] m-0 p-0">{renderWords}</div>
                <div  
                    id="caret-el"
                    className={`absolute inset-0 w-[1px] h-[20px] bg-black`} 
                    style={{left: `${caretX}px`, top: `${caretY+3}px`}}
                />
            </div>
        </>
    );
}