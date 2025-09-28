#!/usr/bin/env python3
"""
Script to run the HMPI Calculator API server
"""

import uvicorn
import os
import sys

def main():
    """Run the FastAPI server"""
    print("🚀 Starting HMPI Calculator API Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔧 ReDoc Documentation: http://localhost:8000/redoc")
    print("=" * 50)
    
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
