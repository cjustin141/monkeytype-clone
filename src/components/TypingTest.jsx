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

    const [sentence, setsentence] = useState([]);
    const [input, setInput] = useState('');

    const inputRef = useRef(null)

    useEffect(() => {
        generateRandomSentence(10);
    }, []);

    const generateRandomSentence = (length) => {
        let randomSentence = '';
    
        for (let i = 0; i < length; i++) {
            const randomIdx = Math.floor(Math.random() * wordCount);
            randomSentence += commonWords[randomIdx] + ' ';
        }
        setsentence(randomSentence.trim().split(" "));
    };

    const handleReset = () => {
        setsentence('');
        setInput('');
        generateRandomSentence(10);
        inputRef.current.focus();
        renderSentence();
    };

    const handleChange = e => {
        console.log(e.target.value)
        setInput(e.target.value)
    };

    const renderSentence = sentence.map((word, i) =>
        <React.Fragment key={`fragment ${i}`}>
            <span className="inline-block" key={i}>
            {
                word.split("").map((letter, j) =>     
                    <div className="inline-block" key={j}>{letter}</div>
                )
            }
            </span>
            <span className="inline-block" key={`nbsp ${i}`}>&nbsp;</span>
        </React.Fragment>
    );    

    return (
        <>
            <button onClick={handleReset}>reset</button>
            <div className="border-4" onClick={() => {inputRef.current.focus()}}>
                <input 
                    className="sr-only" 
                    onChange={handleChange}
                    ref={inputRef}
                    value={input}
                />
                <div className="w-[400px] m-0 p-0">{renderSentence}</div>
            </div>
        </>
    );
}