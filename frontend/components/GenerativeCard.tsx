// Import React and other necessary dependencies
import React from 'react';
import Typewriter from 'typewriter-effect';

// Define the properties of the GenerativeCard component
interface CardProps {
    text: string;
    loading: boolean;
}

// Define the GenerativeCard functional component
const GenerativeCard: React.FC<CardProps> = ({ text, loading }) => {
    return (
        // Render a card with typewriter effect
        <div
            className="bg-slate-900 rounded-lg shadow-md p-6  animate-pop-in font-mono relative table-container border-2 border-blue-500 border-dashed text-white text-xs overflow-auto "
            style={{ maxHeight: '150px' }}
        >
            <div className="flex">
                {/* Render a loading spinner if loading */}
                {loading && (
                    <svg
                        className="animate-spin mr-2 h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25 text-blue-800"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75 text-blue-300"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l1-1.647z"
                        ></path>
                    </svg>
                )}
                <h4 className="font-bold text-blue-400 mb-2">
                    🤖 Generated Product Summary
                </h4>
            </div>
            {/* Use the Typewriter effect to type out the provided text */}
            <Typewriter
                key={text}
                onInit={(typewriter) => {
                    typewriter.typeString(text).start();
                }}
                options={{ delay: 25 }}
            />
        </div>
    );
};

export default GenerativeCard;
