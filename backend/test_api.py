#!/usr/bin/env python3
"""
Test script for the HMPI Calculator API
"""

import requests
import json
import os

# API base URL
BASE_URL = "http://localhost:8000"

def test_root_endpoint():
    """Test the root endpoint"""
    print("🔍 Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Status: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_health_check():
    """Test health check endpoint"""
    print("\n🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Status: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_standards():
    """Test standards endpoint"""
    print("\n🔍 Testing standards endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/standards")
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        print(f"📊 Standard Limits: {len(data['standard_limits'])} metals")
        print(f"⚖️ Unit Weights: {len(data['unit_weights'])} metals")
        print(f"🚨 Risk Categories: {len(data['risk_categories'])} levels")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_direct_calculation():
    """Test direct calculation endpoint"""
    print("\n🔍 Testing direct calculation...")
    try:
        # Test data
        test_data = {
            "Lead (Pb)": 0.015,
            "Cadmium (Cd)": 0.004,
            "Mercury (Hg)": 0.0012,
            "Arsenic (As)": 0.012,
            "Chromium (Cr)": 0.08
        }
        
        response = requests.post(
            f"{BASE_URL}/calculate-direct",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        
        if data.get('success'):
            results = data['results']
            print(f"📊 HMPI Score: {results['hmpi']:.2f}")
            print(f"🚨 Risk Category: {results['risk_category']['category']}")
            print(f"⚠️ Hazard Index: {results['hazard_index']:.2f}")
            print(f"📈 Visualization: {'Generated' if results.get('visualization') else 'Failed'}")
            return True
        else:
            print(f"❌ Calculation failed: {data}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_file_upload():
    """Test file upload endpoint"""
    print("\n🔍 Testing file upload...")
    try:
        # Check if sample file exists
        sample_file = "sample_data.csv"
        if not os.path.exists(sample_file):
            print(f"❌ Sample file {sample_file} not found")
            return False
        
        # Upload file
        with open(sample_file, 'rb') as f:
            files = {'file': (sample_file, f, 'text/csv')}
            response = requests.post(f"{BASE_URL}/calculate", files=files)
        
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        
        if data.get('success'):
            stats = data['overall_statistics']
            print(f"📊 Total Samples: {stats['total_samples']}")
            print(f"📈 Average HMPI: {stats['average_hmpi']:.2f}")
            print(f"📉 Min HMPI: {stats['min_hmpi']:.2f}")
            print(f"📈 Max HMPI: {stats['max_hmpi']:.2f}")
            print(f"📊 Risk Distribution: {stats['risk_distribution']}")
            return True
        else:
            print(f"❌ File upload failed: {data}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 HMPI Calculator API Test Suite")
    print("=" * 50)
    
    tests = [
        ("Root Endpoint", test_root_endpoint),
        ("Health Check", test_health_check),
        ("Standards", test_standards),
        ("Direct Calculation", test_direct_calculation),
        ("File Upload", test_file_upload)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n{'='*20} {test_name} {'='*20}")
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print(f"\n{'='*50}")
    print("📊 TEST SUMMARY")
    print(f"{'='*50}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\n🎯 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! API is working correctly.")
    else:
        print("⚠️ Some tests failed. Check the server logs.")

if __name__ == "__main__":
    main()
