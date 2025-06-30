#!/usr/bin/env python3
"""
Test script for the Resume Editor Backend API
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")

def test_ai_enhance():
    """Test the AI enhancement endpoint"""
    print("\n🤖 Testing AI enhancement...")
    
    test_cases = [
        {
            "section": "summary",
            "content": "Experienced developer with 5 years in web development"
        },
        {
            "section": "experience", 
            "content": "Developed web applications. Worked with React and Python. Improved system performance."
        },
        {
            "section": "skills",
            "content": "Python, JavaScript, React, FastAPI, SQL"
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            response = requests.post(f"{BASE_URL}/ai-enhance", json=test_case)
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Test {i} passed ({test_case['section']})")
                print(f"   Original: {test_case['content']}")
                print(f"   Enhanced: {result['enhanced_content']}")
            else:
                print(f"❌ Test {i} failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Test {i} error: {e}")

def test_save_and_retrieve_resume():
    """Test saving and retrieving a resume"""
    print("\n💾 Testing resume save and retrieve...")
    
    # Sample resume data
    resume_data = {
        "personal_info": {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+1-555-0123"
        },
        "summary": "Test summary for API testing",
        "experience": [
            {
                "title": "Software Developer",
                "company": "Test Company",
                "duration": "2020-2023",
                "description": "Developed and maintained software applications"
            }
        ],
        "education": [
            {
                "degree": "Computer Science",
                "institution": "Test University",
                "duration": "2016-2020",
                "description": "Studied computer science fundamentals"
            }
        ],
        "skills": ["Python", "JavaScript", "React", "FastAPI"]
    }
    
    try:
        # Save resume
        response = requests.post(f"{BASE_URL}/save-resume", json=resume_data)
        if response.status_code == 200:
            result = response.json()
            resume_id = result["resume_id"]
            print(f"✅ Resume saved successfully")
            print(f"   Resume ID: {resume_id}")
            
            # Retrieve resume
            time.sleep(0.1)  # Small delay to ensure save is complete
            retrieve_response = requests.get(f"{BASE_URL}/resume/{resume_id}")
            if retrieve_response.status_code == 200:
                retrieved_data = retrieve_response.json()
                print("✅ Resume retrieved successfully")
                print(f"   Name: {retrieved_data['data']['personal_info']['name']}")
                return resume_id
            else:
                print(f"❌ Resume retrieval failed: {retrieve_response.status_code}")
        else:
            print(f"❌ Resume save failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Resume save/retrieve error: {e}")
    
    return None

def test_list_resumes():
    """Test listing all resumes"""
    print("\n📋 Testing resume listing...")
    try:
        response = requests.get(f"{BASE_URL}/resumes")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Resume listing successful")
            print(f"   Total resumes: {result['count']}")
            if result['count'] > 0:
                print("   Recent resumes:")
                for resume_id, info in list(result['resumes'].items())[:3]:
                    print(f"     - {resume_id}: {info['personal_info'].get('name', 'Unknown')}")
        else:
            print(f"❌ Resume listing failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Resume listing error: {e}")

def test_root_endpoint():
    """Test the root endpoint"""
    print("\n🏠 Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            result = response.json()
            print("✅ Root endpoint working")
            print(f"   API: {result['message']}")
            print(f"   Version: {result['version']}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")

def main():
    """Run all tests"""
    print("🚀 Starting Resume Editor Backend API Tests")
    print("=" * 50)
    
    # Check if server is running
    try:
        requests.get(f"{BASE_URL}/health", timeout=5)
    except Exception:
        print("❌ Server is not running!")
        print("   Please start the server with: python main.py")
        return
    
    # Run tests
    test_root_endpoint()
    test_health_check()
    test_ai_enhance()
    test_save_and_retrieve_resume()
    test_list_resumes()
    
    print("\n" + "=" * 50)
    print("🏁 Tests completed!")
    print("\n💡 Visit http://localhost:8000/docs for interactive API documentation")

if __name__ == "__main__":
    main()
