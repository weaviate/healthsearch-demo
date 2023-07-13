// Import React and other necessary dependencies
import React, { useState } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

// Define the properties of the ConsoleCard component
interface ConsoleCardProps {
    onSend: (inputValue: string) => void;
    loading: boolean;
    cachedQueries: string[];
}

// Define the ConsoleCard functional component
const ConsoleCard: React.FC<ConsoleCardProps> = ({ onSend, loading, cachedQueries }) => {
    // Define state variables for tooltip visibility and input value
    const [showTooltip, setShowTooltip] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const [fade, setFade] = useState('fade-in');

    // Predefined search suggestions, feel free to adjust these
    const searchSuggestions = [
        'Helpful for joint pain',
        'Products for sleep from the Now Foods brand',
        'Best rated product for energy',
        'Help with depression',
        'Increasing muscle growth',
        'Products that improve my mood',
        'Reducing anxiety',
        'helpful for neck muscle pain',
        'best 5-htp',
        'migraine with aura',
        'best for hyperthyroidism',
        'fat liver',
        'helpful for weight loss',
        'good for back pain',
        'improves depression and gives energy',
    ];

    // If you want to display the cached queries, you can combine them with your predefined queries like this:
    // const allSuggestions = [...searchSuggestions, ...cachedQueries];

    const allSuggestions = searchSuggestions;

    // State variable to track the current index
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to handle left navigation
    const handleLeftNav = () => {
        setFade('fade-out');
        setTimeout(() => {
            if (currentIndex === 0) {
                setCurrentIndex(allSuggestions.length - 3);
            } else {
                setCurrentIndex(currentIndex - 3);
            }
            setFade('fade-in');
        }, 250);
    }

    // Function to handle right navigation
    const handleRightNav = () => {
        setFade('fade-out');
        setTimeout(() => {
            if (currentIndex + 3 >= allSuggestions.length) {
                setCurrentIndex(0);
            } else {
                setCurrentIndex(currentIndex + 3);
            }
            setFade('fade-in');
        }, 250);
    }

    return (
        <div className="animate-pop-in">
            <div
                className="relative bg-slate-800 rounded-lg  table-container shadow-lg flex flex-col justify-between border-2 border-dashed border-green-500 mx-5 p-5"
                style={{ position: 'relative' }}
            >
                <div>
                    {/* Display console card header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                            <span className="bg-red-500 rounded-full w-2 h-2 mr-1"></span>
                            <span className="bg-yellow-500 rounded-full w-2 h-2 mr-1"></span>
                            <span className="bg-green-500 rounded-full w-2 h-2 mr-2"></span>
                            <span className="font-mono text-sm text-white">
                                💬 Natural Language Query
                            </span>
                        </div>
                    </div>
                    {/* Text area for entering the query */}
                    <div className="bg-slate-900 p-5 rounded-lg animate-pop-in-late">
                        <div className="flex items-center text-white font-mono">
                            <textarea
                                value={inputValue}
                                placeholder="Helpful for joint pain"
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full bg-transparent text-white outline-none font-mono"
                            />
                        </div>
                    </div>
                    {/* Predefined search suggestions */}
                    <div className="flex mt-2 space-x-2">
                        <button
                            onClick={handleLeftNav}
                            className="bg-slate-700 hover:bg-green-500 text-white text-xs font-semibold py-1 px-2 rounded-md transition duration-500 ease-in-out"
                        >
                            <FaArrowLeft />
                        </button>
                        {allSuggestions.slice(currentIndex, currentIndex + 3).map((suggestion, index) => (
                            <button
                                key={index}
                                onClick={() => setInputValue(suggestion)}
                                className={`bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold py-1 px-2 rounded-md ${fade}`}
                            >
                                {suggestion}
                            </button>
                        ))}
                        <button
                            onClick={handleRightNav}
                            className="bg-slate-700 hover:bg-green-500 text-white text-xs font-semibold py-1 px-2 rounded-md transition duration-500 ease-in-out"
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
                <div className="text-center text-xs mt-2 font-mono text-zinc-500">
                    Saved queries: {cachedQueries.length}
                </div>
                {/* Button for showing the tooltip and sending the input value */}
                <div className="flex justify-between pt-5">
                    <div className="relative">
                        <button
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold py-2 px-3 rounded-full hover:ring-2 hover:ring-slate-400"
                        >
                            ?
                        </button>
                        {/* Tooltip */}
                        {showTooltip && (
                            <div className="absolute bottom-full left-0 text-xs bg-slate-700 text-white font-mono p-3 w-60 rounded z-50 mb-2 shadow-lg">
                                Search for products with specific health
                                effects based on user-written reviews. Press Generate to create a GraphQL
                                Query. Use the generated query to retrieve a
                                list of products, which you can select for more
                                information.
                            </div>
                        )}
                    </div>
                    {/* Button for sending the input value */}
                    <div className="flex items-center">
                        <button
                            onClick={() => onSend(inputValue)}
                            className="bg-green-500 hover:bg-green-400 text-white text-xs font-semibold py-2 px-4 rounded animate-pop-more-late"
                            disabled={loading}
                        >
                            {loading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsoleCard;
