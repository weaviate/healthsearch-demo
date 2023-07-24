# Healthsearch

Welcome to the Healthsearch Demo, an open-source project aimed at showcasing the potential of leveraging user-written reviews and queries to retrieve supplement products based on specific health effects. 

[![Weaviate](https://img.shields.io/static/v1?label=%E2%9D%A4%20made%20with&message=Weaviate&color=green&style=flat-square)](https://weaviate.io/) [![Docker support](https://img.shields.io/badge/Docker_support-%E2%9C%93-4c1?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/get-started/) [![Demo](https://img.shields.io/badge/Check%20out%20the%20demo!-blue?&style=flat-square&logo=react&logoColor=white)](https://healthsearch-frontend.onrender.com/) [![Weaviate](https://img.shields.io/static/v1?label=version&message=v1.1&color=pink&style=flat-square)](https://weaviate.io/)

![Demo of Health Search](https://github.com/weaviate/healthsearch-demo/blob/main/frontend/public/Intro.gif)

## 🎯 Overview

The search functionality in this demo accepts natural language queries that are translated into GraphQL queries using LLMs. These GraphQL queries are then utilized to retrieve supplements from a Weaviate database. The demo also exhibits an example of generative search by providing product summaries generated based on the retrieved objects.

> ⚠️ **Disclaimer**: Healthsearch is a technical demonstration, and the results shown should not be treated as health advice. The results and generated summaries are purely based on user-written reviews.

### 💡 Natural Language Translation to GraphQL

We use Large Language Models (LLM), like GPT4, to translate natural language queries into a structured query format, called a GraphQL query.
The demo extracts information about filters, sorting, and limits directly from the context of the query. Whether the query is `the top 10 products for glowing skin`, `products for sleep from a specific brand`, or `best-rated products for toothache`, the demo can interpret these queries and generate an appropriate GraphQL query in return.

### 🔎 Semantic Search

Healthsearch relies on the power of semantic search in user reviews. When seeking products that are `good for joint pain`, for instance, Healthsearch scans user reviews for discussions on products that have alleviated joint pain or similar conditions. The results are then aggregated and grouped according to their respective products.

### 💥 Generative Search

After the translation of the query to GraphQL and the retrieval of the most semantically relevant product, we enhance our demo with a feature called `Generative Search`. Essentially, we examine the top five results and employ an LLM to generate a product summary. This concise summary offers a brief overview of the products, highlighting their pros and cons and providing valuable insights. Each summary is crafted around the query, ensuring every search is unique and interesting.

### 🔥 Semantic Cache

We embed the generated results and queries to Weaviate, and use it as a `Semantic Cache`.
This method is advantageous as it enables the demo to return results from queries that are semantically equal to the new query. For example `good for joint pain` and `helpful for joint pain` are semantically very similar and should return the same results, whereas `bad for joint pain` should have its own generated result. This method allows us to gain much more from generated results than traditional string matching would permit. It's a simple yet potent solution that enhances the efficiency of the search process.

## 🔧 Template

This repository is designed to serve as a template - a starting point for your own projects with Weaviate. Take inspiration from how we've implemented certain features and feel free to enhance it in your own project. We welcome comments, ideas, and feedback. Embrace the open-source spirit!

## 💰 Language Learning Model (LLM) Costs

This demonstration primarily uses OpenAI models for embedding supplement products, processing user queries, and generating summaries. By default, any costs associated with using these services will be billed to the access key that you provide.

If you prefer, you can replace the OpenAI models with any other Language Learning Model (LLM) provider. However, please be aware that completely changing the API will require further adjustments to the code.

Below, we provide a rough estimate of the costs involved in importing data to Weaviate. For a comprehensive understanding, please visit OpenAI's pricing page at https://openai.com/pricing.

### Data Embedding Costs
We employ the Ada v2 model for embedding data into the Weaviate cluster. At the time of writing this README, the model costs $0.0001 for every 1k tokens (note that approximately [4 characters equal 1 token](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)). As a rough approximation, importing the dataset to Weaviate might cost around $0.002. However, we also provide the same dataset with pre-generated vectors so that it is not required to generate and pay for the product embeddings. The file is called `dataset_100_supplements_with_vectors.json`. The import script automatically detects whether the datasets contains the `vector` key or not.

### Query Construction and Summary Generation Costs
We use the GPT-4 model for building GraphQL queries and generating summaries. As of the time of writing this README, this model costs $0.03/1k tokens for input and $0.06/1k tokens for output. The exact costs are dependent on the user query and the results returned by the GraphQL query. Please take these factors into account when calculating your expected costs. You can also change the `model_name` variable to `gpt-3.5-turbo` inside the `api.py` script in the backend folder. The GPT-3 model costs $0.0015/1k tokens for input and $0.002/1k tokens for output.

## 🛠️ Project Structure

The Healthsearch Demo is structured in three main components:

1. A Weaviate database (either cluster hosted on WCS or local).
2. A FastAPI endpoint facilitating communication between the LLM provider and database.
3. An interactive React frontend for displaying the information.

Make sure you have Python (`>=3.8.0`) and Node (`>=18.16.0`) installed. We also support Docker and provide Dockerfiles for the setup.

## 🐳 Quickstart with Docker

You can use Docker to setup the demo in one line of code! If you're not familiar with Docker you can read more about it here (https://docker-curriculum.com/)

1. **Set environment variables:**
- The following environment variables need to be set
- ```OPENAI_API_KEY=your-openai-api-key```
> Use the `.env` file inside the backend folder to set the variable (https://github.com/theskumar/python-dotenv)
> Note that if you're using the GPT-4 model (by default), ensure your OpenAI key has access. You can change the `model_name` variable to `gpt-3.5-turbo` inside the `api.py` script.

1. **Use docker compose**
-  `docker-compose up`

2. **Access the frontend on:**
- `localhost:3000`


## 📚 Getting Started

To kick-start with the Healthsearch Demo, please refer to the READMEs in the `Frontend` and `Backend` folders:

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## 💡 Usage

Follow these steps to use the Healthsearch Demo:

1. Set up the Weaviate database, FastAPI backend, and the React frontend by following the instructions in their respective READMEs.
2. Launch the database, backend server, and the frontend application.
3. Use the interactive frontend to input your natural language query related to a health condition or benefit.
4. The frontend sends the query to the backend, which transforms the natural language query into a GraphQL query using the LLM.
5. The backend sends the GraphQL query to the Weaviate database to fetch relevant reviews based on the user query.
6. The frontend displays the results, allowing you to explore the most semantic-related supplements to your specific health-related query.

## 💖 Open Source Contribution

Your contributions are always welcome! Feel free to contribute ideas, feedback, or create issues and bug reports if you find any! Please adhere to the code guidelines that include formatting, linting, and testing.
