# 🎨 Healthsearch Demo - Frontend 🎨

The Healthsearch Demo is a React application powered by Next.js, which enables you to search and display supplement products interactively. This document provides setup instructions for the frontend, component details, and maintenance procedures.

## 🚀 Getting Started

Follow these steps to set up the frontend:

1. Ensure Node.js version `>=18.16.0` is installed. If not, download and install it from [Node.js](https://nodejs.org/).
2. Run `npm install` to install all required modules.
3. Adjust the backend endpoint in the `index.tsx` file according to your setup (default is localhost:8000).
4. Start the application with `npm run dev`.

### 🐳 Using Docker

You can also use Docker to setup the frontend. If you're not familiar with Docker you can read more about it here (https://docker-curriculum.com/)

Inside the frontend folder, use these commands:

0. **(Optional)** Adjust the backend endpoint in the `index.tsx` file according to your setup (default is localhost:8000).

1. **Build the docker image with**

-   `docker build -t healthsearch-frontend .`

2. **Run the docker with**

-   `docker run -p 3000:3000 healthsearch-frontend`

## 🔗 Product Schema

The `Product` interface in the `ResultsCard.tsx` component defines the product data displayed in the frontend. To add or remove fields, adjust the `ResultsCard.tsx`, `ProductCard.tsx`, and `ProductDetailsCard.tsx` components accordingly, and ensure the backend also provides these fields.

```ts
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
```

## 🔗 Code Maintenance

-   Run `npx prettier --write .` to format the codebase.
-   Lint the codebase with `npx eslint <FILENAME>`.

## 🎨 Styling

The application employs Tailwind CSS and global CSS classes for styling. Images and animations used in the demo are located in the public directory.

## 📚 Component Documentation

Below is a brief description of the key components:

-   `index.tsx`
    Contains a Sidebar for inputting and managing queries, a Main Content area for displaying results, and a Modal for disclaimers. The layout is responsive, with a collapsible sidebar for smaller screens.

-   `SideBarCard.tsx`
    A collapsible sidebar that displays instructions, a console for sending queries (ConsoleCard), a transformed query display (QueryCard), and detailed product info when a product is selected (ProductDetailsCard).

-   `ConsoleCard.tsx`
    Accepts a user query, displays search suggestions, and provides tooltip instructions. When a query is sent, it communicates with the parent component using the onSend function.

-   `QueryCard.tsx`
    Displays the transformed GraphQL query from user input in a stylized card format with syntax highlighting and interactive features like a tooltip for guidance and a copy-to-clipboard function.

-   `ProductDetailsCard.tsx`
    Presents detailed product information interactively, with parsed reviews differentiated from standard text.

-   `GenerativeCard.tsx`
    Shows generated product summaries using a typewriter effect and a loading spinner while waiting for fetched results.

-   `ResultsCard.tsx`
    Creates a responsive grid of ProductCards, with a variable number of products per row depending on window width.

-   `ProductCard.tsx`
    Displays products as cards with details and a typewriter-effect review summary. If no product image is available, it uses a placeholder icon.
