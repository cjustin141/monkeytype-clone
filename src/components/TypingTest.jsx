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

    const [sentence, setsentence] = useState('');
    const [input, setInput] = useState('');
    const [caretX, setCaretX] = useState(0);
    const [characters, setCharacters] = useState([]);

    const inputRef = useRef(null);
    const backspacePressed = useRef(false);

    // on load
    useEffect(() => {
        setsentence('');
        setInput('');
        setCaretX(0);
        resetStyling();
        generateRandomSentence(10);
    }, []);

    // to handle aysync
    useEffect(() => {setCharacters([...(document.querySelectorAll("#character"))])}, [input])
    useEffect(() => {updateCaret()}, [characters])
    useEffect(() => {evaluateCharacter()}, [caretX])

    const generateRandomSentence = (length) => {
        let randomSentence = '';
    
        for (let i = 0; i < length; i++) {
            const randomIdx = Math.floor(Math.random() * wordCount);
            randomSentence += commonWords[randomIdx] + ' ';
        }
        setsentence(randomSentence.trim());
    };

    const handleReset = () => {
        setsentence('');
        setInput('');
        resetStyling();
        setCaretX(0);
        generateRandomSentence(10);
        inputRef.current.focus();
    };

    const handleChange = e => { //maybe not efficient
        backspacePressed.current = false;
        setInput(e.target.value);
        // detect backspace so evaluateCharacter can handle
        if (e.nativeEvent.inputType == "deleteContentBackward") 
            backspacePressed.current = true;
        // console.log(backspacePressed.current)    
        
   };

   const resetStyling = () => {
        characters.map((character) => {
            character.className = "inline-block text-gray-400";
        })
   }

   const evaluateCharacter = () => {  
        let prevElement = characters[input.length-1];
        let currElement = characters[input.length];

         if (backspacePressed.current == true) { 
            currElement.classList = "inline-block text-gray-400"; 
        } else { 
            if (prevElement && (input.length <= sentence.length)) {
                let typedChar = input.slice(-1)
                let correctChar = prevElement.innerHTML

                if (typedChar == correctChar) {
                    prevElement.classList.add("text-black")
                } else if ((typedChar == ' ')  && (correctChar == '&nbsp;')) {
                    // do nothing
                } else {
                    prevElement.classList.add("text-red-600")
                }
            }
        }
   }

    const updateCaret = () => {
        if (sentence != '') {
            // if input.length > 0 && 
            if (input.length <= sentence.length) {
                let prevElement = characters[input.length-1]
                let currentElement = characters[input.length]
                setCaretX(currentElement.offsetLeft);
            }
            // console.log("'"+input+"'");
            // console.log("'"+sentence+"'");
        }
    };

    const renderSentence = sentence.split(' ').map((word, i) =>
        <React.Fragment key={`fragment ${i}`}>
            <span className="inline-block" key={i}>
            {
                word.split('').map((letter, j) =>     
                    <div 
                        id="character" 
                        className="inline-block text-gray-400" 
                        key={j}>
                        {letter}
                    </div>
                )      
            }
            </span>
            <span id="character" className="inline-block" key={`nbsp ${i}`}>&nbsp;</span>
            
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
                <div className="w-[400px] m-0 p-0">{renderSentence}</div>
                <div  
                    id="caret"
                    className={`absolute inset-0 w-[1px] h-[20px] bg-black top-[3px]`} 
                    style={{left: `${caretX}px`}}
                />
            </div>
        </>
    );
}