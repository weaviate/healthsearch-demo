// Import React and other necessary dependencies
import React from 'react';
import { Product } from './ResultsCard';
import { GiMedicinePills } from 'react-icons/gi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Typewriter from 'typewriter-effect';

// Define the properties of the ProductCard component
interface ProductCardProps {
    product: Product | null;
    onProductSelect: (product: Product) => void;
}

// Define the ProductCard functional component
const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onProductSelect,
}) => {
    // Calculate the rating and stars
    const rating = product?.rating || 0;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
        <div
            // Setup the styles for the card and handle the click event
            className="bg-slate-800 rounded-lg shadow-md p-2 m-2 animate-pop-in relative table-container border-2 border-slate-400 hover:border-green-500 hover:bg-slate-700"
            onClick={() => product && onProductSelect(product)}
        >
            <div className="flex flex-col items-center">
                <div className="m-2">
                    {/* Display the brand and name of the product */}
                    <h3 className="text-xs font-light text-white">
                        {product?.brand || 'No Brand'}
                    </h3>
                    <h3 className="font-semibold text-sm text-white">
                        {product?.name || 'Product Name'}
                    </h3>
                </div>
                {/* Display the product image or a fallback icon */}
                {product?.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className=" w-44 h-44 object-cover shadow-lg rounded-lg p-3 m-2 bg-white"
                    />
                ) : (
                    <GiMedicinePills className=" w-36 h-36 object-cover shadow-lg rounded-lg p-3 m-2 bg-white text-slate-300" />
                )}
                <div className="flex justify-around items-center">
                    <div className="mt-2">
                        {/* Display the product rating as stars */}
                        <div className="flex items-center justify-center">
                            {[...Array(fullStars)].map((e, i) => (
                                <FaStar className="text-yellow-300" key={i} />
                            ))}
                            {[...Array(halfStar)].map((e, i) => (
                                <FaStarHalfAlt
                                    className="text-yellow-300"
                                    key={i}
                                />
                            ))}
                            {[...Array(emptyStars)].map((e, i) => (
                                <FaRegStar className="text-slate-500" key={i} />
                            ))}
                        </div>
                        {/* Display the number of reviews */}
                        <div className="text-xs text-slate-500 mt-1">
                            {product?.reviews.length} reviews - click to see
                            more
                        </div>
                    </div>
                </div>
            </div>
            {/* Display the product summary */}
            <div
                className="mt-2 bg-slate-900 rounded-lg p-5 font-mono text-white text-xs overflow-auto "
                style={{ maxHeight: '150px' }}
            >
                <h4 className="font-bold mb-2 text-green-400">
                    🤖 Generated Review Summary:
                </h4>
                <Typewriter
                    onInit={(typewriter) => {
                        typewriter
                            .typeString(product?.summary || 'N/A')
                            .start();
                    }}
                    options={{ delay: 25 }}
                />
            </div>
        </div>
    );
};

export default ProductCard;
