// Import React and other necessary dependencies
import React, { useMemo } from 'react';
import { Product } from './ResultsCard';
import { GiMedicinePills } from 'react-icons/gi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// Define the properties of the ProductDetailsCard component
interface ProductDetailsCardProps {
    product: Product;
    onBack: () => void;
}

// Helper function to parse reviews
function parseReview(review: string) {
    return review
        .split("<span className='annotation'>")
        .reduce((acc: any[], part, i) => {
            // The first part of the review does not include annotation
            if (i === 0) {
                return [{ text: part.trim(), isAnnotation: false }];
            } else {
                const [annotation, remainder] = part.split('</span>');
                // Add annotation and the remaining part of the review
                return [
                    ...acc,
                    { text: annotation.trim(), isAnnotation: true },
                    {
                        text: remainder ? remainder.trim() : '',
                        isAnnotation: false,
                    },
                ];
            }
        }, []);
}

// Define the ProductDetailsCard functional component
const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({
    product,
    onBack,
}) => {
    // Calculate the rating and stars
    const rating = product.rating || 0;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    // Use memoization to optimize review parsing
    const parsedReviews = useMemo(
        () => product.reviews.map(parseReview),
        [product.reviews],
    );

    return (
        <div className="bg-slate-800 rounded-lg shadow-lg flex flex-col justify-between border-2 border-dashed border-white m-4 p-5 bg-opacity-60">
            <button
                onClick={onBack}
                className="self-start px-2 py-1 rounded font-mono text-xs bg-rose-600 hover:bg-rose-500 text-white"
            >
                Back
            </button>
            <div>
                <h3 className="text-base font-light mt-4 text-white">
                    {product.brand || 'No Brand'}
                </h3>
                <h3 className="font-bold text-xl mb-8 text-white">
                    {product.name || 'Product Name'}
                </h3>
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className=" w-64 h-64 mx-auto object-cover shadow-lg rounded-lg p-3 mb-4 bg-white animate-pop-in"
                    />
                ) : (
                    <GiMedicinePills className=" w-56 h-56 object-cover shadow-lg rounded-lg p-3 m-2 bg-white text-slate-300" />
                )}
                <div className="flex items-center justify-center mb-4">
                    {[...Array(fullStars)].map((e, i) => (
                        <FaStar className="text-yellow-300 text-xl" key={i} />
                    ))}
                    {[...Array(halfStar)].map((e, i) => (
                        <FaStarHalfAlt
                            className="text-yellow-300 text-xl"
                            key={i}
                        />
                    ))}
                    {[...Array(emptyStars)].map((e, i) => (
                        <FaRegStar className="text-slate-500 text-xl" key={i} />
                    ))}
                </div>
                <div className="bg-slate-900 rounded-lg shadow-lg p-4 text-xs mb-4 text-white font-mono animate-pop-in border-2 border-dashed border-green-500">
                    <h4 className="font-bold mb-2 text-slate-200">
                        📝 Description:
                    </h4>
                    <p className="mb-4">{product.description}</p>
                    <h4 className="font-bold mb-2 text-slate-200">
                        🍏 Ingredients:
                    </h4>
                    <p className="mb-4">
                        {product.ingredients || 'No ingredients provided.'}
                    </p>
                    <h4 className="font-bold mb-2 text-slate-200">
                        📏 Distance: {product?.distance || 'N/A'}
                    </h4>
                </div>
            </div>
            <hr className="border-slate-700 my-4" />
            <div className="flex flex-col items-start">
                {/* Iterate over parsed reviews */}
                {parsedReviews.map((parsedReview, index) => {
                    return (
                        <div
                            key={index}
                            className="bg-slate-900 rounded-lg shadow-lg p-4 text-xs mb-4 animate-pop-in-late text-white font-mono table-container leading-8"
                        >
                            {parsedReview.map((part, i) =>
                                part.isAnnotation ? (
                                    <span
                                        key={i}
                                        className=" rounded-lg p-2 shadow-lg bg-slate-800 font-bold table-container hover:bg-green-500"
                                    >
                                        {part.text}
                                    </span>
                                ) : (
                                    <span key={i}>{part.text}</span>
                                ),
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductDetailsCard;
