import weaviate  # type: ignore[import]
import json
import typer
import os

from pathlib import Path
from wasabi import msg  # type: ignore[import]

from dotenv import load_dotenv

load_dotenv()


def main(data_path: Path) -> None:
    msg.divider("Starting data import")

    # Connect to Weaviate
    url = os.environ.get("HEALTHSEARCH_SERVER", "")
    openai_key = os.environ.get("OPENAI_API_KEY", "")
    auth_config = weaviate.AuthApiKey(
        api_key=os.environ.get("HEALTHSEARCH_API_KEY", "")
    )

    if url == "":
        msg.fail("Environment Variables not set.")
        msg.info(f"URL: {url}")
        return

    client = weaviate.Client(
        url=url,
        additional_headers={"X-OpenAI-Api-Key": openai_key},
        auth_client_secret=auth_config,
    )

    msg.good("Client connected to Weaviate Instance")

    # Data import, please see the README for the expected data format
    data = None
    try:
        with open(data_path, "r") as reader:
            data = json.load(reader)
            msg.info("Data loaded.")
    except Exception as e:
        msg.fail("Data couldn't be imported!")
        msg.info(e)
        return

    class_obj = {
        "class": "Product",
        "description": "Supplement products",
        "properties": [
            {
                "dataType": ["text"],
                "description": "The name of the product",
                "name": "name",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": True,
                        "vectorizePropertyName": False,
                    }
                },
            },
            {
                "dataType": ["text"],
                "description": "The brand of the product",
                "name": "brand",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": True,
                        "vectorizePropertyName": False,
                    }
                },
            },
            {
                "dataType": ["text"],
                "description": "The ingredients contained in the product.",
                "name": "ingredients",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": False,
                        "vectorizePropertyName": True,
                    }
                },
            },
            {
                "dataType": ["text[]"],
                "description": "Reviews about the product",
                "name": "reviews",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": True,
                        "vectorizePropertyName": False,
                    }
                },
            },
            {
                "dataType": ["text"],
                "description": "Image URL of the product",
                "name": "image",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": True,
                        "vectorizePropertyName": False,
                    }
                },
            },
            {
                "dataType": ["number"],
                "description": "The Rating of the product",
                "name": "rating",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": True,
                        "vectorizePropertyName": False,
                    }
                },
            },
            {
                "dataType": ["text"],
                "description": "The description of the product",
                "name": "description",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": True,
                        "vectorizePropertyName": False,
                    }
                },
            },
            {
                "dataType": ["text"],
                "description": "The summary of the reviews",
                "name": "summary",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": False,
                        "vectorizePropertyName": True,
                    }
                },
            },
            {
                "dataType": ["text"],
                "description": "The health effects of the product",
                "name": "effects",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": False,
                        "vectorizePropertyName": True,
                    }
                },
            },
        ],
        "moduleConfig": {
            "generative-openai": {"model": "gpt-3.5-turbo"},
            "text2vec-openai": {"model": "ada", "modelVersion": "002", "type": "text"},
        },
        "vectorizer": "text2vec-openai",
    }

    if not client.schema.exists("Product"):
        client.schema.create_class(class_obj)
        msg.warn(f"Product class was created because it didn't exist.")
    else:
        # WARNING THIS DELETES ALL PRODUCTS AND CREATES A NEW PRODUCT CLASS
        client.schema.delete_class("Product")
        msg.info(f"Product class was removed because it already exists")
        client.schema.create_class(class_obj)

    with client.batch as batch:
        batch.batch_size = 100
        for i, d in enumerate(data):
            msg.info(f"({i+1}/{len(data)}) Importing Product {d}")

            properties = {
                "name": data[d].get("name", "Productname"),
                "brand": data[d].get("brand", "Productbrand"),
                "ingredients": data[d].get("ingredients", "Product ingredients"),
                "reviews": data[d].get("reviews", ["Example review"]),
                "rating": data[d].get("rating", 3.0),
                "image": data[d].get(
                    "img",
                    "https://en.wikipedia.org/wiki/Rickrolling#/media/File:RickRoll.png",
                ),
                "effects": data[d].get("effects", "Good for something"),
                "description": data[d].get("description", "Product description"),
                "summary": data[d].get("summary", "Review summary"),
            }

            # Check if vector exists in dataset
            if "vector" in data[d]:
                client.batch.add_data_object(
                    properties, "Product", vector=data[d]["vector"]
                )
            else:
                client.batch.add_data_object(properties, "Product")

    msg.good("Data imported")
    msg.divider("Starting to initialize Cache")

    cache_obj = {
        "class": "CachedResult",
        "description": "Cached results",
        "properties": [
            {
                "dataType": ["text"],
                "description": "GraphQL Query",
                "name": "graphQuery",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": True,
                        "vectorizePropertyName": False,
                    }
                },
            },
            {
                "dataType": ["text"],
                "description": "Natural Language Query",
                "name": "naturalQuery",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": False,
                        "vectorizePropertyName": True,
                    }
                },
            },
            {
                "dataType": ["text"],
                "description": "Retrieved Products",
                "name": "products",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": True,
                        "vectorizePropertyName": False,
                    }
                },
            },
            {
                "dataType": ["text"],
                "description": "Generated Summary",
                "name": "summary",
                "moduleConfig": {
                    "text2vec-openai": {
                        "skip": True,
                        "vectorizePropertyName": False,
                    }
                },
            },
        ],
        "vectorizer": "text2vec-openai",
    }

    if not client.schema.exists("CachedResult"):
        client.schema.create_class(cache_obj)
        msg.warn(f"CachedResult class was created because it didn't exist.")
    else:
        # WARNING THIS DELETES ALL CACHED RESULTS AND CREATES A NEW CACHE CLASS
        client.schema.delete_class("CachedResult")
        msg.info(f"CachedResult class was removed because it already exists")
        client.schema.create_class(cache_obj)

    msg.good("Cache initialized")


if __name__ == "__main__":
    typer.run(main)
