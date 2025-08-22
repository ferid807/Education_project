import requests
import sys
import json
from datetime import datetime

class StudyPathAPITester:
    def __init__(self, base_url="https://studypath-guide-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.student_id = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else f"{self.api_url}/"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                    elif isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_create_student_profile(self):
        """Test creating a student profile"""
        student_data = {
            "name": "John Smith",
            "email": "john@example.com",
            "university": "MIT",
            "faculty": "Computer Science",
            "gpa": 3.8,
            "total_credits": 120,
            "completed_credits": 90,
            "achievements": ["Dean's List", "Research Publication"],
            "extracurriculars": ["Student Government", "Programming Club"],
            "preferred_countries": ["USA", "Canada", "UK"],
            "financial_situation": "needs_scholarship",
            "career_goals": "Become a software engineer specializing in AI and machine learning"
        }
        
        success, response = self.run_test(
            "Create Student Profile",
            "POST",
            "students",
            200,
            data=student_data
        )
        
        if success and 'id' in response:
            self.student_id = response['id']
            print(f"   Student ID: {self.student_id}")
            return True
        return False

    def test_get_student_profile(self):
        """Test retrieving a student profile"""
        if not self.student_id:
            print("❌ Skipping - No student ID available")
            return False
            
        return self.run_test(
            "Get Student Profile",
            "GET",
            f"students/{self.student_id}",
            200
        )[0]

    def test_update_student_profile(self):
        """Test updating a student profile"""
        if not self.student_id:
            print("❌ Skipping - No student ID available")
            return False
            
        update_data = {
            "gpa": 3.9,
            "achievements": ["Dean's List", "Research Publication", "Best Student Award"]
        }
        
        return self.run_test(
            "Update Student Profile",
            "PUT",
            f"students/{self.student_id}",
            200,
            data=update_data
        )[0]

    def test_get_universities(self):
        """Test retrieving universities"""
        success, response = self.run_test(
            "Get Universities",
            "GET",
            "universities",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} universities")
            # Check if sample universities are present
            university_names = [uni.get('name', '') for uni in response]
            expected_unis = ['MIT', 'Oxford University', 'TU Munich', 'University of Toronto']
            found_unis = [uni for uni in expected_unis if uni in university_names]
            print(f"   Sample universities found: {found_unis}")
            return True
        return success

    def test_get_universities_with_filters(self):
        """Test retrieving universities with filters"""
        # Test country filter
        success1, response1 = self.run_test(
            "Get Universities (Country Filter)",
            "GET",
            "universities",
            200,
            params={"country": "USA"}
        )
        
        # Test program filter
        success2, response2 = self.run_test(
            "Get Universities (Program Filter)",
            "GET",
            "universities",
            200,
            params={"program": "Computer Science"}
        )
        
        return success1 and success2

    def test_get_scholarships(self):
        """Test retrieving scholarships"""
        success, response = self.run_test(
            "Get Scholarships",
            "GET",
            "scholarships",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} scholarships")
            # Check if sample scholarships are present
            scholarship_names = [sch.get('name', '') for sch in response]
            expected_scholarships = ['Fulbright Scholarship', 'DAAD Scholarship', 'Rhodes Scholarship']
            found_scholarships = [sch for sch in expected_scholarships if sch in scholarship_names]
            print(f"   Sample scholarships found: {found_scholarships}")
            return True
        return success

    def test_get_scholarships_with_filters(self):
        """Test retrieving scholarships with filters"""
        # Test country filter
        success1, response1 = self.run_test(
            "Get Scholarships (Country Filter)",
            "GET",
            "scholarships",
            200,
            params={"country": "USA"}
        )
        
        # Test field filter
        success2, response2 = self.run_test(
            "Get Scholarships (Field Filter)",
            "GET",
            "scholarships",
            200,
            params={"field": "Engineering"}
        )
        
        return success1 and success2

    def test_ai_chat(self):
        """Test AI chat functionality"""
        if not self.student_id:
            print("❌ Skipping - No student ID available")
            return False
            
        chat_data = {
            "student_id": self.student_id,
            "message": "What are my chances of getting into Oxford for a master's in AI?"
        }
        
        print("   Note: AI response may take 10-15 seconds...")
        success, response = self.run_test(
            "AI Chat",
            "POST",
            "chat",
            200,
            data=chat_data
        )
        
        if success and 'response' in response:
            print(f"   AI Response length: {len(response['response'])} characters")
            print(f"   AI Response preview: {response['response'][:100]}...")
            return True
        return success

    def test_get_chat_history(self):
        """Test retrieving chat history"""
        if not self.student_id:
            print("❌ Skipping - No student ID available")
            return False
            
        success, response = self.run_test(
            "Get Chat History",
            "GET",
            f"chat/{self.student_id}",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} chat messages")
            return True
        return success

    def test_generate_recommendations(self):
        """Test generating career recommendations"""
        if not self.student_id:
            print("❌ Skipping - No student ID available")
            return False
            
        print("   Note: AI recommendations may take 10-15 seconds...")
        success, response = self.run_test(
            "Generate Career Recommendations",
            "POST",
            f"recommendations/{self.student_id}",
            200
        )
        
        if success and 'acceptance_probabilities' in response:
            print(f"   Acceptance probabilities: {response['acceptance_probabilities']}")
            print(f"   Number of improvements: {len(response.get('suggested_improvements', []))}")
            return True
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting StudyPath API Tests")
        print("=" * 50)
        
        # Basic API tests
        self.test_root_endpoint()
        
        # Student profile tests
        if self.test_create_student_profile():
            self.test_get_student_profile()
            self.test_update_student_profile()
        
        # Universities and scholarships tests
        self.test_get_universities()
        self.test_get_universities_with_filters()
        self.test_get_scholarships()
        self.test_get_scholarships_with_filters()
        
        # AI functionality tests (these take longer)
        if self.student_id:
            print("\n🤖 Testing AI Features (may take time)...")
            self.test_ai_chat()
            self.test_get_chat_history()
            self.test_generate_recommendations()
        
        # Print final results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return 1

def main():
    tester = StudyPathAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())