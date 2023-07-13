import openai
import os
import weaviate  # type: ignore[import]
import json
import re

from wasabi import msg  # type: ignore[import]

from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from dotenv import load_dotenv

load_dotenv()

# Request Count
request_count = 0
cache_count = 0

# Configuration
data_fields = [
    "name",
    "brand",
    "ingredients",
    "reviews",
    "image",
    "rating",
    "description",
    "summary",
    "effects",
]

model_name = "gpt-4"  # default (gpt-4)

# Define OpenAI API key, Weaviate URL, and auth configuration
openai.api_key = os.environ.get("OPENAI_API_KEY", "")
url = os.environ.get("HEALTHSEARCH_SERVER", "")
auth_config = weaviate.AuthApiKey(api_key=os.environ.get("HEALTHSEARCH_API_KEY", ""))

# Setup OpenAI API key and Weaviate client
if openai.api_key != "":
    msg.good("Open AI API Key available")
    if url:
        client = weaviate.Client(
            url=url,
            additional_headers={"X-OpenAI-Api-Key": openai.api_key},
            auth_client_secret=auth_config,
        )
    else:
        msg.warn("Server URL not available")
        exit()
else:
    msg.warn("Open AI API Key not available")
    exit()

# Define system prompt for conversation with GPT model
system_prompt = """

You are a parser that understands the meaning of natural language queries and parses them into valid graphql queries based on this schema:

    class_obj = {
        "class": "Product",
        "description": "Supplementary products from iHerb",
        "properties": [
            {
                "dataType": ["text"],
                "description": "The name of the product",
                "name": "name",
            },
            {
                "dataType": ["text"],
                "description": "The brand of the product",
                "name": "brand",
            },
            {
                "dataType": ["text"],
                "description": "The ingredients contained in the product.",
                "name": "ingredients",
            },
            {
                "dataType": ["text[]"],
                "description": "Reviews about the product",
                "name": "reviews",
            },
            {
                "dataType": ["text"],
                "description": "Image URL of the product",
                "name": "image",
            },
            {
                "dataType": ["number"],
                "description": "The Rating of the product",
                "name": "rating",
            },
            {
                "dataType": ["text"],
                "description": "The description of the product",
                "name": "description",
            },
            {
                "dataType": ["text"],
                "description": "The summary of the reviews",
                "name": "summary",
            },
            {
                "dataType": ["text"],
                "description": "The health effects of the product",
                "name": "effects",
            },
        ],
    }

    The query will be used to retrieve supplement products from a Weaviate database, make sure that all fields are returned with the _additional distance attribute.
    Your answers are only allowed to contain the query, the results will be used directly.

    Example natural language query: 'Which product is helpful for joint pain?' produce this GraphQL query:

    {
      Get {
        Product(
          nearText: {concepts: ["Helpful", "joint pain"]}
        ) {
          name
          brand
          ingredients
          reviews
          image
          rating
          description
          summary
          effects
          _additional {
            id
            distance
          }
        }
      }
    }

    Example natural language query: 'Products from brand "Life Extension" for glowing skin' produce this GraphQL query:

    {
  Get {
    Product(
      nearText: {concepts: ["glowing skin"]}
      where: {
        path: ["brand"],
        operator: Equal,
        valueString: "Life Extension"
      }
    ) {
          name
          brand
          ingredients
          reviews
          image
          rating
          description
          summary
          effects
      _additional {
      id
        distance
      }
    }
  }
}

  Example natural language query: 'Lowest rated products for energy' produce this GraphQL query:

  {
  Get {
    Product(
      nearText: {concepts: ["energy"]}
      sort: [{
      path: ["rating"]     
      order: asc          
    }]
    ) {
      name
          brand
          ingredients
          reviews
          image
          rating
          description
          summary
          effects
      _additional {
      id
        distance
      }
    }
  }
}

"""

# FastAPI App
app = FastAPI()

origins = ["http://localhost:3000", "https://healthsearch-frontend.onrender.com"]

# Add middleware for handling Cross Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def handle_results(results: dict) -> list:
    """Process the results from Weaviate to a defined format
    @parameter results : dict - Dict containing the products retrieved from Weaviate
    @returns list - A list of products in dict format
    """
    try:
        end_results = []
        data = results["data"]
        for key in data:
            query_results = data[key]["Product"]
            for query_result in query_results:
                end_results.append(
                    {
                        "brand": query_result.get("brand", "No brand"),
                        "name": query_result.get("name", "No name"),
                        "rating": query_result.get("rating", 0.0),
                        "ingredients": query_result.get("ingredients", ""),
                        "description": query_result.get("description", ""),
                        "summary": query_result.get("summary", ""),
                        "effects": query_result.get("effects", ""),
                        "reviews": query_result.get("reviews", []),
                        "image": query_result.get("image", ""),
                        "distance": round(
                            query_result.get("_additional", {"distance": 0})[
                                "distance"
                            ],
                            2,
                        ),
                    }
                )
        return end_results

    except Exception as e:
        msg.fail("Error at handling results")
        print(e)
        print(results)
        return [
            {
                "brand": "Brand",
                "name": "Product",
                "rating": 0.0,
                "ingredients": "Substances",
                "description": "description",
                "summary": "summary",
                "effects": "effects",
                "reviews": ["Review"],
                "image": "",
                "distance": 0.0,
            }
        ]


def get_cache(natural_query: str) -> dict:
    """Check if a natural language query exists in the Weaviate database
    @parameter natural_query : str - Natural Query from the user
    @returns dict - Data object retrieved from weaviate
    """
    filter = {
        "path": ["naturalQuery"],
        "operator": "Equal",
        "valueText": natural_query,
    }

    results = (
        client.query.get(
            "CachedResult", ["naturalQuery", "graphQuery", "products", "summary"]
        )
        .with_where(filter)
        .with_limit(1)
        .do()
    )

    if natural_query == results["data"]["Get"]["CachedResult"][0]["naturalQuery"]:
        return results
    else:
        return {"data": {"Get": {"CachedResult": []}}}


def get_cache_count() -> list:
    """Update the global cache count and return all cached queries
    @returns list of queries
    """
    query = client.query.get("CachedResult", ["naturalQuery"]).do()
    cachedQueries = [
        naturalQuery["naturalQuery"]
        for naturalQuery in query["data"]["Get"]["CachedResult"]
    ]
    return cachedQueries


def check_cache(cache_results: dict, natural_query: str, max_distance: float) -> dict:
    """Check if retrieved results are empty and use semantic search to find similar cached results based on the natural query
    @parameter cache_results : dict - Weaviate retrieved results
    @parameter natural_query : str - Natural Query of the user
    @parameter max_distance : float - Distance threshold for semantic search
    @returns dict | None - Data object retrieved from weaviate
    """
    if cache_results["data"]["Get"]["CachedResult"]:
        msg.good("Cache entry exists!")
        cache_results["data"]["Get"]["CachedResult"][0]["summary"] = (
            "🛰️ RETRIEVED FROM CACHE: "
            + cache_results["data"]["Get"]["CachedResult"][0]["summary"]
        )
        return cache_results
    else:
        msg.warn("Cache entry does not exist!")
        nearText = {"concepts": [natural_query], "max_distance": max_distance}
        results = (
            client.query.get(
                "CachedResult", ["naturalQuery", "graphQuery", "products", "summary"]
            )
            .with_near_text(nearText)
            .with_limit(1)
            .with_additional(["distance"])
            .do()
        )
        if not results["data"]["Get"]["CachedResult"]:
            msg.warn("No similar cache entry match")
            return {}
        elif (
            results["data"]["Get"]["CachedResult"][0]["_additional"]["distance"]
            > max_distance
        ):
            msg.warn("No similar cache entry match")
            return {}
        else:
            msg.good(
                f'Retrieved similar results (distance {results["data"]["Get"]["CachedResult"][0]["_additional"]["distance"]})'
            )
            results["data"]["Get"]["CachedResult"][0]["summary"] = (
                f"⭐ RETURNED SIMILAR RESULTS FROM QUERY '{natural_query}' ({round(results['data']['Get']['CachedResult'][0]['_additional']['distance'],2)}) : "
                + results["data"]["Get"]["CachedResult"][0]["summary"]
            )
            return results


def add_cache(naturalQuery: str, graphQuery: str, results: dict, summary: str) -> None:
    """Add results to the Weaviate cache
    @parameter natural_query : str - Natural Query of the user
    @parameter graphQuery : str - Generated GraphQL query
    @parameter results : dict - Results retrieved from Weaviate
    @parameter summary : str - Generated product summary
    @returns None
    """
    data_object = {
        "graphQuery": graphQuery,
        "naturalQuery": naturalQuery,
        "products": json.dumps(results),
        "summary": summary,
    }

    with client.batch as batch:
        batch.batch_size = 1
        client.batch.add_data_object(data_object, "CachedResult")

    msg.good("Added new cache entry")


def modify_graphql(graphQuery: str, natural_query: str, fields: list) -> str:
    """Uses the generated GraphQL query to generate the query for creating the product summary
    @parameter natural_query : str - Natural Query of the user
    @parameter graphQuery : str - Generated GraphQL query
    @parameter fields : list - List of strings for every data field
    @returns str - GraphQL query with the generate module
    """
    # Fields to keep
    fields_to_keep = ["summary", "description", "ingredients"]

    # All fields present in the query
    all_fields = fields

    # Fields to remove
    fields_to_remove = [field for field in all_fields if field not in fields_to_keep]

    # Pattern to match 'where' clause
    where_pattern = r"where:\s*\{([^\}]*)\}"

    # Check if 'where' field exists
    where_match = re.search(where_pattern, graphQuery, flags=re.DOTALL)
    if where_match:
        # 'where' field exists, extract field names within 'where' clause
        where_clause = where_match.group(1)
        where_fields = re.findall(r"path:\s*\[([^\]]*)\]", where_clause)

        # If a field in the 'where' clause is in the fields to be removed, keep it
        for where_field in where_fields:
            where_field = where_field.replace('"', "").strip()
            if where_field in fields_to_remove:
                fields_to_remove.remove(where_field)

    # Pattern to match 'sort' clause
    sort_pattern = r"sort:\s*\[\{([^\}]*)\}\]"

    # Check if 'sort' field exists
    sort_match = re.search(sort_pattern, graphQuery, flags=re.DOTALL)
    if sort_match:
        # 'sort' field exists, extract field names within 'sort' clause
        sort_clause = sort_match.group(1)
        sort_fields = re.findall(r"path:\s*\[([^\]]*)\]", sort_clause)

        # If a field in the 'sort' clause is in the fields to be removed, keep it
        for sort_field in sort_fields:
            sort_field = sort_field.replace('"', "").strip()
            if sort_field in fields_to_remove:
                fields_to_remove.remove(sort_field)

    # Remove unwanted fields
    for field in fields_to_remove:
        graphQuery = re.sub(rf"\s*{field}", "", graphQuery)

    # Pattern to match '_additional'
    pattern = r"(_additional\s*\{[^\}]*\})"

    # Pattern to match 'limit'
    limit_pattern = r"(limit:\s*\d+)"

    # Check if 'limit' field exists and if it's greater than 5
    limit_match = re.search(limit_pattern, graphQuery)
    if limit_match:
        # Limit field exists, ensure it's not greater than 5
        limit_value = int(limit_match.group().split(":")[1].strip())
        if limit_value > 5:
            graphQuery = re.sub(limit_pattern, "limit: 5", graphQuery)
    else:
        # 'limit' field doesn't exist, add it
        graphQuery = re.sub(r"Product\(", "Product(\n      limit: 5", graphQuery)

    # Replacement '_additional'
    replacement = f"""
      _additional {{
        generate(
          groupedResult: {{
            task: "Summarize products based on this query: {natural_query}"
          }}
        ) {{
          groupedResult
          error
        }}
        id
        distance
      }}"""

    # Replace '_additional'
    modified_query = re.sub(pattern, replacement, graphQuery, flags=re.DOTALL)

    return modified_query


# Class for the Natural Language Query
class NLQuery(BaseModel):
    text: str


# Define health check endpoint
@app.get("/health")
async def root():
    global cache_count

    try:
        cached_queries = get_cache_count()
        cache_count = len(cached_queries)
        return JSONResponse(
            content={
                "message": "Alive!",
                "requests": request_count,
                "cache_count": cache_count,
                "cache_queries": cached_queries,
            }
        )
    except Exception as e:
        msg.fail(f"Healthcheck failed with {str(e)}")
        return JSONResponse(
            content={
                "message": "Database connection failed!",
                "requests": request_count,
                "cache_count": cache_count,
                "cache_queries": [],
            },
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        )


# Define endpoint for generating GraphQL query from natural language
@app.post("/generate_query")
async def generate_query(payload: NLQuery):
    """Process the Payload sent by the Frontend, send API request to Open AI API, receive and format the results and send them back to the frontend
    @parameter payload : ProcessTweetsPayload - Payload sent by the frontend containing the prompt, tweets and context tags
    @returns JSONResponse - JSON containing the results
    """
    global request_count
    request_count += 1
    start_prompt = f"Convert this natural language to a GraphQL Query and only return the query, it will be directly used: {payload.text}"

    # Easter Egg
    if payload.text.lower() == "easteregg":
        return JSONResponse(
            content={
                "query": "🚀 Congratulations, you rolled the demo!",
                "results": {},
                "generative_summary": "You just got rick-rolled...",
            }
        )

    # Cache Retrieval
    results = check_cache(get_cache(payload.text.lower()), payload.text.lower(), 0.14)

    if len(results) > 0:
        products = json.loads(results["data"]["Get"]["CachedResult"][0]["products"])

        return JSONResponse(
            content={
                "query": results["data"]["Get"]["CachedResult"][0]["graphQuery"],
                "results": products,
                "generative_summary": results["data"]["Get"]["CachedResult"][0][
                    "summary"
                ],
            }
        )

    # Production
    else:
        prompt = start_prompt
        error_message = ""
        for i in range(0, 3):
            try:
                response = openai.ChatCompletion.create(
                    model=model_name,
                    messages=[
                        {
                            "role": "system",
                            "content": system_prompt,
                        },
                        {"role": "user", "content": prompt},
                    ],
                )
            except Exception as e:
                msg.fail("API Request Failed")
                msg.info(str(e))
                return JSONResponse(
                    content={
                        "query": f"API request failed...",
                        "results": {},
                        "generative_summary": f"💥 Oh no... API request failed: {str(e)}",
                    }
                )

            for choice in response["choices"]:
                content = str(choice["message"]["content"])
                results = client.query.raw(content)

                if "errors" in results:
                    error_message = str(results["errors"])
                    prompt = f"The provided GraphQL is not valid, see this error: {error_message} please fix this GraphQL query for a Weaviate database: {content}"
                    msg.warn(f"({i}) Query Error detected, retrying...")
                    msg.info(prompt)
                    continue

                results = handle_results(results)  # type: ignore[assignment]

                generative_query = modify_graphql(
                    str(content), payload.text, data_fields
                )
                generative_results = client.query.raw(str(generative_query))

                if "errors" in generative_results:
                    generative_summary = str(generative_results["errors"])
                    msg.warn("Generative Query Failed!")
                    return JSONResponse(
                        content={
                            "query": "".join(
                                [
                                    str(content) + "\n\n",
                                    "# Query with generative module \n\n",
                                    generative_query,
                                ]
                            ),
                            "results": results,
                            "generative_summary": generative_summary,
                        }
                    )

                else:
                    generative_summary = str(
                        generative_results["data"]["Get"]["Product"][0]["_additional"][
                            "generate"
                        ]["groupedResult"]
                    )

                add_cache(
                    payload.text.lower(),
                    "".join(
                        [
                            str(content) + "\n\n",
                            "# Query with generative module \n\n",
                            generative_query,
                        ]
                    ),
                    results,
                    generative_summary,
                )

                return JSONResponse(
                    content={
                        "query": "".join(
                            [
                                str(content) + "\n\n",
                                "# Query with generative module \n\n",
                                generative_query,
                            ]
                        ),
                        "results": results,
                        "generative_summary": "✨ GENERATED: " + generative_summary,
                    }
                )

        return JSONResponse(
            content={
                "query": f"Not able to construct query...",
                "results": {},
                "generative_summary": f"💥 Oh no... We couldn't create a GraphQL query from your input!",
            }
        )
