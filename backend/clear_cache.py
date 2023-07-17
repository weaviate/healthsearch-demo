import weaviate  # type: ignore[import]
import typer
import os

from pathlib import Path
from wasabi import msg  # type: ignore[import]

from dotenv import load_dotenv

load_dotenv()


def main() -> None:
    msg.divider("Starting clearing cache")

    # Connect to Weaviate
    url = os.environ.get("HEALTHSEARCH_SERVER", "")
    openai_key = os.environ.get("OPENAI_API_KEY", "")
    auth_config = weaviate.AuthApiKey(
        api_key=os.environ.get("HEALTHSEARCH_API_KEY", "")
    )

    if openai_key == "" or url == "":
        msg.fail("Environment Variables not set.")
        msg.info(f"URL: {url}")
        msg.info(f"OPENAI API KEY: {openai_key}")
        return

    client = weaviate.Client(
        url=url,
        additional_headers={"X-OpenAI-Api-Key": openai_key},
        auth_client_secret=auth_config,
    )

    msg.good("Client connected to Weaviate Instance")

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
    else:
        client.schema.delete_class("CachedResult")
        client.schema.create_class(cache_obj)

    msg.good("Cache cleared")


if __name__ == "__main__":
    typer.run(main)
