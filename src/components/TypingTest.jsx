import React from "react";
import { useState, useEffect, useRef } from "react";

export default function Typespace() {
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

    const [prompt, setPrompt] = useState('');
    const [input, setInput] = useState('');

    const inputRef = useRef(null)

    useEffect(() => {
        generateRandomPrompt(10);
    }, []);

    const generateRandomPrompt = (length) => {
        let randomPrompt = '';
    
        for (let i = 0; i < length; i++) {
            const randomIdx = Math.floor(Math.random() * wordCount);
            randomPrompt += commonWords[randomIdx] + ' ';
        }
        setPrompt(randomPrompt.trim());
    };

    const handleReset = () => {
        setPrompt('');
        setInput('');
        generateRandomPrompt(10);
        inputRef.current.focus()
    };

    const handleChange = e => {
        console.log(e.target.value)
        setInput(e.target.value)
    };

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
                <div className="w-[400px] m-0 p-0">{prompt}</div>
            </div>

        </>
    );
}