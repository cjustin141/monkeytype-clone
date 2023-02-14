import React from 'react';
import TypingTest from '../components/TypingTest';

export default function Home() {
    return (
        <>
            <div className="flex flex-col justify-between items-center h-screen">
                
                <h1 className="flex justify-center items-center h-[10%] text-5xl font-bold underline w-screen">typeMaster</h1>
                <div className="flex flex-col justify-center items-center">
                    <TypingTest />
                </div>
                
                <h2 className="flex justify-center items-end h-[20%] mt-10 pb-5w-screen">footer</h2>
            </div>
            {/* <h2 className="absolute bottom-2 bg-blue-200 w-screen text-center">footer</h2> */}
            

        </> 
    );
}