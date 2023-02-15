import React from 'react';
import TypingTest from '../components/TypingTest';

export default function Home() {
    return (
        <>
            <div className="flex flex-col justify-between items-center h-screen bg-stone-400">
                
                <h1 className="flex justify-center items-center h-[10%] text-5xl font-bold underline w-screen text-stone-700">typeMaster</h1>
                <div className="h-[10%]"></div>
                <div className="flex flex-col justify-center items-center">
                    <TypingTest />
                </div>
                <div className="h-[20%]"></div>
                <h2 className="flex justify-center items-end h-[10%] mt-10 pb-5w-screen"></h2>
            </div>
            {/* <h2 className="absolute bottom-2 bg-blue-200 w-screen text-center">footer</h2> */}
            

        </> 
    );
}