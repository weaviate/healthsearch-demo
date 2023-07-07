// Import React and other necessary dependencies
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Define the properties of the QueryCard component
interface QueryCardProps {
    transformedQuery: string;
}

// Define the QueryCard functional component
const QueryCard: React.FC<QueryCardProps> = ({ transformedQuery }) => {
    // Define state variables for copied message and tooltip visibility
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Function to copy the transformed query to the clipboard
    const copyToClipboard = async () => {
        try {
            // Use the clipboard API to write the text
            await navigator.clipboard.writeText(transformedQuery.trim());
            setShowCopiedMessage(true);
            setTimeout(() => {
                setShowCopiedMessage(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    // Main component rendering
    return (
        <div className="animate-pop-in">
            <div className="relative bg-slate-800 rounded-lg  table-container shadow-lg flex flex-col justify-center border-2 border-blue-400 border-dashed m-5 p-5">
                {/* Display QueryCard header */}
                <div className="flex items-center mb-4">
                    <span className="bg-red-500 rounded-full w-2 h-2 mr-1"></span>
                    <span className="bg-yellow-500 rounded-full w-2 h-2 mr-1"></span>
                    <span className="bg-green-500 rounded-full w-2 h-2 mr-2"></span>
                    <span className="font-mono text-sm text-white">
                        📝 GraphQL Query
                    </span>
                </div>
                {/* Highlighted query */}
                <div className="bg-slate-900 p-5 rounded-lg animate-pop-in-late">
                    <SyntaxHighlighter
                        language="graphql"
                        style={vscDarkPlus}
                        customStyle={{
                            background: 'none',
                            fontSize: '14px',
                            padding: '0',
                            margin: '0',
                        }}
                    >
                        {transformedQuery.trim()}
                    </SyntaxHighlighter>
                </div>
                {/* Tooltip and copy to clipboard button */}
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
                                The generated GraphQL will be displayed here and
                                can be copied to your clipboard using the Copy
                                to clipboard button.
                            </div>
                        )}
                    </div>
                    {showCopiedMessage && (
                        <div className="text-xs text-white opacity-75 transition-opacity duration-300">
                            Copied to clipboard
                        </div>
                    )}
                    <button
                        onClick={copyToClipboard}
                        className="bg-blue-500 hover:bg-blue-400 text-white text-xs font-semibold py-2 px-4 rounded animate-pop-more-late"
                    >
                        📋 Copy to clipboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QueryCard;
