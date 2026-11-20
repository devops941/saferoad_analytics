import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import PROJECT_NAME, API_V1_PREFIX, CORS_ORIGINS
from app.api.endpoints import router as api_router

app = FastAPI(
    title=PROJECT_NAME,
    description="FastAPI Backend for SafeRoad Analytics - Descriptive Road Accident Analysis for Madurai District, Tamil Nadu",
    version="1.0.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "project": PROJECT_NAME,
        "district": "Madurai District, Tamil Nadu, India",
        "status": "operational",
        "docs_url": "/docs",
        "api_v1": f"{API_V1_PREFIX}/health"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    reload = os.getenv("ENVIRONMENT", "development") != "production"
    uvicorn.run("main:app", host=host, port=port, reload=reload)
