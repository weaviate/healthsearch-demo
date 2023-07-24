#!/bin/bash

# Import the 100 supplements dataset into Weaviate
python import_data_to_weaviate.py ./data/dataset_100_supplements_with_vectors.json
# Start the FastAPI app
uvicorn api:app --reload --host 0.0.0.0 --port 8000