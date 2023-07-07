// Import React and other necessary dependencies
import React from 'react';
import ConsoleCard from './ConsoleCard';
import QueryCard from './QueryCard';
import ProductDetailsCard from './ProductDetailsCard';
import { Product } from './ResultsCard';
import RiveComponent from '@rive-app/react-canvas';

// Define the properties of the SidebarCard component
interface SidebarCardProps {
    onSend: (inputValue: string) => void;
    loading: boolean;
    transformedQuery: string;
    selectedProduct: Product | null;
    apiStatus: string;
    onBack: () => void;
    isSidebarCollapsed: boolean;
    requests: number;
    cached: number;
}

// Define the SidebarCard functional component
const SidebarCard: React.FC<SidebarCardProps> = ({
    onSend,
    loading,
    transformedQuery,
    selectedProduct,
    apiStatus,
    onBack,
    isSidebarCollapsed,
    requests,
    cached
}) => {
    // Styles for the global scrollbar
    const scrollBarStyles = `
    ::-webkit-scrollbar {
        width: 15px;
    }
    ::-webkit-scrollbar-track {
        background: #0e0b33;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #1f234b;
        border-radius: 20px;
    }
    `;

    // Main component rendering
    return (
        <div
            className="lg:w-1/3 md:w-full sm:w-full h-screen fixed shadow-lg overflow-y-auto bg-slate-900"
            style={{
                backgroundImage: "url('/banner.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                scrollbarColor: '#2D3748 #1A202C',
                scrollbarWidth: 'thin',
                // Control the sidebar collapse/expand functionality
                transform: isSidebarCollapsed ? 'translateX(-100%)' : 'none',
            }}
        >
            {/* eslint-disable */}
            {/* Global scrollbar style */}
            <style jsx global>
                {scrollBarStyles}
            </style>
            {/* eslint-enable */}

            {/* If there is no selectedProduct, render welcome and instruction messages, ConsoleCard, and QueryCard */}
            {/* Otherwise, render the ProductDetailsCard component for the selectedProduct */}
            {selectedProduct === null ? (
                <>
                    <div className=" text-white px-8 pt-4 flex flex-col justify-center items-center mb-4">
                        <div>
                            <div className="flex justify-center items-center">
                                <RiveComponent
                                    src="logo_anim.riv"
                                    className="rive-container"
                                />
                            </div>
                            <div className="flex justify-center my-2">
                                <a className='cursor-pointer transform transition duration-500 ease-in-out hover:scale-150' href="https://www.weaviate.io" target="_blank" rel="noreferrer">
                                    <img src="/weaviate-icon.png" alt="Weaviate" className="w-8 h-8 mx-2 cursor-pointer" />
                                </a>
                                <a className='cursor-pointer transform transition duration-500 ease-in-out hover:scale-150' href="https://github.com/weaviate" target="_blank" rel="noreferrer">
                                    <img src="/github-icon.png" alt="Github" className="w-8 h-8 mx-2 cursor-pointer" />
                                </a>
                            </div>
                            {/* Welcome message and instructions */}
                            <div className="flex flex-col justify-center items-center pb-4">
                                <div className="w-full lg:w-full md:w-3/4 sm:w-1/2">
                                    <p className="text-sm font-mono bg-black bg-opacity-10 p-3 shadow-lg rounded-lg">
                                        {' '}
                                        Welcome to HealthSearch! Convert natural
                                        language to a GraphQL query to search
                                        for products with specific health
                                        effects. The demo uses generative search
                                        to further enhance the results by
                                        providing summaries about the products
                                        and reviews.
                                    </p>
                                    {/* Disclaimer */}
                                    <p className="text-xs text-slate-400 hover:text-white mt-2 font-mono bg-black bg-opacity-10 border-2 border-dashed border-zinc-600 table-container hover:border-yellow-400 p-3 shadow-lg rounded-lg">
                                        Results are based on user-written
                                        reviews and should NOT be taken as
                                        health advice. HealthSearch is a
                                        technical demonstration and presents one
                                        of many usecases for Weaviate.
                                    </p>
                                </div>
                                {/* Display API and version status */}
                                <div className="mt-4 text-xs text-white font-mono flex justify-center">
                                    <span className="rounded-indicator neon-text">
                                        Powered by Weaviate
                                    </span>
                                    <span
                                        className={`rounded-indicator text-white ${apiStatus === 'Online'
                                            ? 'neon-text'
                                            : 'bg-red-500'
                                            }`}
                                    >
                                        Demo {apiStatus}
                                    </span>
                                    <span className="rounded-indicator neon-text">
                                        v1.0.0
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ConsoleCard for sending queries */}
                    <ConsoleCard onSend={onSend} loading={loading} />
                    {/* QueryCard for displaying transformed query */}
                    <QueryCard transformedQuery={transformedQuery} />
                </>
            ) : (
                // Product details card for displaying selected product details
                <ProductDetailsCard product={selectedProduct} onBack={onBack} />
            )}
            <div className="my-4 text-xs text-white font-mono flex justify-center">
                <span className='rounded-indicator neon-text'>Total Requests: {requests}</span>
                <span className='rounded-indicator neon-text ml-4'>Saved in Cache: {cached}</span>
            </div>
        </div>
    );
};

export default SidebarCard;
