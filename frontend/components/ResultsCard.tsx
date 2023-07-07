// Import React and other necessary dependencies
import React, { useState, useEffect } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import ProductCard from './ProductCard';
import { useMediaQuery } from 'react-responsive';

// Define the properties of the Product type
export interface Product {
    brand: string;
    name: string;
    rating: number;
    ingredients: string;
    description: string;
    summary: string;
    effects: string;
    reviews: string[];
    image: string;
    distance: number;
}

// Define the properties of the ResultCard component
interface CardProps {
    products: Product[] | null;
    onProductSelect: (product: Product) => void;
}

// Define the ResultCard functional component
const ResultCard: React.FC<CardProps> = ({ products, onProductSelect }) => {
    // Use media queries to determine the number of grid columns based on screen width
    const isLarge = useMediaQuery({ query: '(min-width: 1024px)' });
    const isMedium = useMediaQuery({ query: '(min-width: 768px)' });
    const columnCount = isLarge ? 3 : isMedium ? 2 : 1;

    // Define the grid item component
    const GridItem = ({
        columnIndex,
        rowIndex,
        style,
    }: {
        columnIndex: number;
        rowIndex: number;
        style: React.CSSProperties;
    }) => {
        // Calculate the index of the product to render based on grid positioning
        const index = rowIndex * columnCount + columnIndex;
        const product = products ? products[index] : null;
        return (
            <div style={style}>
                {/* Render a ProductCard component for the product */}
                <ProductCard
                    product={product}
                    onProductSelect={onProductSelect}
                />
            </div>
        );
    };

    // Get the count of products to render
    const itemCount = products?.length || 0;

    // Define state for the grid width
    const [width, setWidth] = useState(325 * columnCount);

    // Update the grid width on window resize
    useEffect(() => {
        const handleResize = () => {
            setWidth(325 * columnCount); // update the width whenever columnCount changes
        };

        // Add and remove the resize event listener
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [columnCount]);

    return (
        <div className="rounded-lg p-6 flex mt-3 flex-col justify-between items-center">
            {/* Render a grid of products if there are any */}
            {itemCount > 0 ? (
                <div className="flex justify-center">
                    <Grid
                        className="overflow-x-auto"
                        columnCount={columnCount}
                        columnWidth={320}
                        height={730}
                        rowCount={Math.ceil(itemCount / columnCount)}
                        rowHeight={520}
                        width={width}
                    >
                        {GridItem}
                    </Grid>
                </div>
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default ResultCard;
