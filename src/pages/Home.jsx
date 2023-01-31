import React from 'react';
import Typespace from '../components/Typespace';

export default function Home() {
    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="text-3xl font-bold underline">typeit</h1>
                <Typespace />
            </div>

        </> 
    );
}