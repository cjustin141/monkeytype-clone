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

    const inputRef = useRef(null)

    useEffect(() => {
        setsentence('');
        setInput('');
        setCaretX(0);
        generateRandomSentence(10);
    }, []);

    // to handle aysync
    useEffect(() => {
        updateCaret();
    }, [input])

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
        setCaretX(0);
        generateRandomSentence(10);
        inputRef.current.focus();
    };

    const handleChange = e => { //maybe not efficient
        setInput(e.target.value);
   };


    const renderSentence = sentence.split(' ').map((word, i) =>
        <React.Fragment key={`fragment ${i}`}>
            <span className="inline-block" key={i}>
            {
                word.split('').map((letter, j) =>     
                    <div id="character" className="inline-block" key={j}>{letter}</div>
                )      
            }
            </span>
            <span id="character" className="inline-block" key={`nbsp ${i}`}>&nbsp;</span>
            
        </React.Fragment>
    );    

    const updateCaret = () => {
        if (sentence != '') {
            console.log("'"+input+"'")
            console.log("'"+sentence+"'")

            var characters = document.querySelectorAll("#character")
            let currentElement = characters[input.length]
            setCaretX(currentElement.offsetLeft)

            // console.log(input.length)
            // console.log("current")
            // console.log(currentElement)
            // console.log("next")
            // console.log(nextElement)
        }
    };

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