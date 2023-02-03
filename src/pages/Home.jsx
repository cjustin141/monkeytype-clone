import React from 'react';
import TypingTest from '../components/TypingTest';

export default function Home() {
    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-3xl font-bold underline">SurrealTypeMaster</h1>
                <TypingTest />
            </div>

        </> 
    );
}