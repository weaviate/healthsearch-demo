# Healthsearch

Welcome to the Healthsearch Demo, an open-source project aimed at showcasing the potential of leveraging user-written reviews and queries to retrieve supplement products based on specific health effects. 

[![Weaviate](https://img.shields.io/static/v1?label=%E2%9D%A4%20made%20with&message=Weaviate&color=green&style=flat-square)](https://weaviate.io/) [![Docker support](https://img.shields.io/badge/Docker_support-%E2%9C%93-4c1?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/get-started/) [![Demo](https://img.shields.io/badge/Check%20out%20the%20demo!-blue?&style=flat-square&logo=react&logoColor=white)](https://healthsearch-frontend.onrender.com/) [![Weaviate](https://img.shields.io/static/v1?label=version&message=v1.0&color=pink&style=flat-square)](https://weaviate.io/)

![Demo of Health Search](https://github.com/weaviate/healthsearch-demo/blob/main/frontend/public/Intro.gif)

## 🎯 Overview

The search functionality in this demo accepts natural language queries that are translated into GraphQL queries using LLMs. These GraphQL queries are then utilized to retrieve supplements from a Weaviate database. The demo also exhibits an example of generative search by providing product summaries generated based on the retrieved objects.

> ⚠️ **Disclaimer**: Healthsearch is a technical demonstration, and the results shown should not be treated as health advice. The results and generated summaries are purely based on user-written reviews.

## 🔧 Template

This repository is designed to serve as a template - a starting point for your own projects with Weaviate. Take inspiration from how we've implemented certain features and feel free to enhance it in your own project. We welcome comments, ideas, and feedback. Embrace the open-source spirit!

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
> Note that if you're using the GPT-4 model (by default), ensure your OpenAI key has access.

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
