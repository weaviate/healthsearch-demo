// Import React and other necessary dependencies
import React, { useState, useEffect } from 'react';
import ResultCard, { Product } from '../components/ResultsCard';
import GenerativeCard from '../components/GenerativeCard';
import SidebarCard from '../components/SidebarCard';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa';

export default function Home() {
    // State variables for data manipulation and UI control
    const [loading, setLoading] = useState(false); // Loading state
    const [apiStatus, setApiStatus] = useState<string>('Offline'); // API status
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Sidebar state
    const [isModalOpen, setIsModalOpen] = useState(true); // Modal display state

    // State variables for product data manipulation
    const [transformedQuery, setTransformedQuery] = useState(''); // Transformed query
    const [results, setResults] = useState<Product[]>([]); // Search results
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    ); // Selected product

    const [requests, setRequests] = useState<number>(0); // Number of requests
    const [cached, setCached] = useState<number>(0); // Number of cached results

    // State variable for generative search
    const [generativeResult, setGenerativeResult] = useState<string>(
        'Welcome to Healthsearch!',
    );

    // Function for checking the health of the API
    const checkApiHealth = async () => {
        try {
            // Change ENDPOINT based on your setup (Default to localhost:8000)
            const response = await fetch('http://localhost:8000/health');
            const responseData = await response.json();

            if (response.status === 200) {
                setApiStatus('Online');
                setRequests(responseData.requests);
                setCached(responseData.cache_count);

            } else {
                setApiStatus('Offline');
            }
        } catch (error) {
            setApiStatus('Offline');
        }
    };

    // UseEffect hook to check the API health on initial load
    useEffect(() => {
        checkApiHealth();
    }, []);

    // Function for sending a search request to the API
    const handleSend = async (inputValue: string) => {
        setLoading(true);
        setGenerativeResult('Generating...');
        setResults([]);
        checkApiHealth();

        try {
            // Change ENDPOINT based on your setup (Default to localhost:8000)
            const response = await fetch(
                'http://localhost:8000/generate_query',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: inputValue }),
                },
            );

            const responseData = await response.json();
            setTransformedQuery(responseData.query);
            setResults(responseData.results);
            setGenerativeResult(responseData.generative_summary);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setGenerativeResult(
                'Something went wrong. Please try again! ' + error,
            );
            setResults([]);
            checkApiHealth();
        }
    };

    // Function for handling the selection of a product
    const handleProductSelect = (product: Product) => {
        setSelectedProduct(product);
    };

    return (
        <div className="flex flex-col sm:flex-row min-h-screen">
            {isModalOpen && (
                <div className="fixed z-50 inset-0 flex items-center justify-center animate-pop-in">
                    <div className="bg-black text-white lg:p-6 md:p-3 sm:p-3 rounded shadow-lg text-center border-2 border-dashed border-yellow-500 lg:w-2/6 md:1/2 sm:1/2 sm:mx-3">
                        <h2 className="lg:text-2xl mb-4">⚠️ Please note</h2>
                        <p className="mb-6">
                            Healthsearch is NOT intended to give any health advice. All results are purely based on the content of user-written reviews. Healthsearch is a technical demonstration that presents a proof of concept for one of many usecases with Weaviate. Please ask a medical professional before taking any supplements for your condition.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-700 transition-colors animate-pop-in-late"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            )}
            <div
                className={`flex-shrink-0 ${isSidebarCollapsed ? 'sm:w-0 md:w-0' : 'sm:w-1/3 w-full'
                    } transition-width duration-200`}
            >
                <SidebarCard
                    onSend={handleSend}
                    loading={loading}
                    transformedQuery={transformedQuery}
                    selectedProduct={selectedProduct}
                    apiStatus={apiStatus}
                    onBack={() => setSelectedProduct(null)}
                    isSidebarCollapsed={isSidebarCollapsed}
                    requests={requests}
                    cached={cached}
                />
            </div>
            <div
                className={`flex-grow lg:w-2/3 min-h-screen overflow-y-auto ${isSidebarCollapsed ? 'block' : 'hidden'
                    } lg:block`}
                style={{
                    backgroundImage: "url('/background.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="justify-center items-center">
                    {transformedQuery.includes('Congratulations') ? (
                        <div className="p-56">
                            <img
                                className="rounded-lg shadow-lg border-2 border-dashed border-white table-container animate-pop-in w-max"
                                src="/rick-rolled.gif"
                                alt="No results meme"
                            />
                        </div>
                    ) : (
                        <div className="pt-8 px-8">
                            <GenerativeCard
                                text={generativeResult}
                                loading={loading}
                            />
                            <ResultCard
                                products={results}
                                onProductSelect={handleProductSelect}
                            />
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`fixed top-1/2 transform -translate-y-1/2 z-10 bg-zinc-500 text-white font-mono text-sm p-2 rounded-full transition-transform duration-200 ease-in-out hover:scale-105 lg:hidden hover:bg-green-500 ${isSidebarCollapsed ? 'left-0 ml-4' : 'right-0 mr-4'
                    }`}
            >
                {isSidebarCollapsed ? <FaAngleLeft /> : <FaAngleRight />}
            </button>
        </div>
    );
}
