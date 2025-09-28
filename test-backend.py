#!/usr/bin/env python3
"""
Quick test script to verify backend is working
"""

import requests
import time
import sys

def test_backend():
    """Test if backend is running"""
    print("🔍 Testing backend connection...")
    
    max_attempts = 5
    for attempt in range(max_attempts):
        try:
            response = requests.get("http://localhost:8000/health", timeout=5)
            if response.status_code == 200:
                print("✅ Backend is running!")
                print(f"📊 Response: {response.json()}")
                return True
        except requests.exceptions.ConnectionError:
            print(f"⏳ Attempt {attempt + 1}/{max_attempts}: Backend not ready yet...")
            time.sleep(2)
        except Exception as e:
            print(f"❌ Error: {e}")
            return False
    
    print("❌ Backend is not running. Please start it with:")
    print("   cd backend")
    print("   venv\\Scripts\\python main-simple.py")
    return False

def test_calculation():
    """Test direct calculation"""
    print("\n🧪 Testing HMPI calculation...")
    
    try:
        sample_data = {
            "Lead (Pb)": 0.015,
            "Cadmium (Cd)": 0.004,
            "Mercury (Hg)": 0.0012,
            "Arsenic (As)": 0.012,
            "Chromium (Cr)": 0.08
        }
        
        response = requests.post(
            "http://localhost:8000/calculate-direct",
            json=sample_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Calculation successful!")
            print(f"📊 HMPI Score: {result['results']['hmpi']:.2f}")
            print(f"🚨 Risk Category: {result['results']['risk_category']['category']}")
            print(f"⚠️ Hazard Index: {result['results']['hazard_index']:.2f}")
            return True
        else:
            print(f"❌ Calculation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing calculation: {e}")
        return False

if __name__ == "__main__":
    print("🚀 HMPI Backend Test")
    print("=" * 30)
    
    if test_backend():
        test_calculation()
    else:
        sys.exit(1)
