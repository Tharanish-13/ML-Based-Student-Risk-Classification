import requests
import json

BASE_URL = "http://localhost:8001"

# Helper to get auth token
def get_token():
    # Assuming there's a test user or we can register one.
    # For now, let's try to login with a known user (if any) or register one.
    email = "test@example.com"
    password = "password123"
    
    # Try login
    # UserLogin expects email and password
    response = requests.post(f"{BASE_URL}/login", json={"email": email, "password": password})
    if response.status_code == 200:
        return response.json()["access_token"]
    
    # Register if login fails
    requests.post(f"{BASE_URL}/register", json={"name": "Test User", "email": email, "password": password})
    response = requests.post(f"{BASE_URL}/login", json={"email": email, "password": password})
    if response.status_code == 200:
        return response.json()["access_token"]
    return None

def test_risk_flow():
    token = get_token()
    if not token:
        print("Failed to get auth token. backend might not be running or auth failed.")
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create Student
    print("Testing Student Creation...")
    student_data = {
        "name": "Risk Test Student",
        "attendance": 50,
        "marks": 50,
        "assignments": 5,
        "study_hours": 2
    }
    
    response = requests.post(f"{BASE_URL}/students/", json=student_data, headers=headers)
    if response.status_code != 200:
        print(f"Failed to create student: {response.text}")
        return

    created_student = response.json()
    student_id = created_student["id"]
    risk = created_student.get("risk_level")
    print(f"Created Student Risk: {risk}")
    
    if risk == "Pending" or risk is None:
        print("FAILURE: Risk was not predicted on creation.")
    else:
        print("SUCCESS: Risk predicted on creation.")

    # 2. Update Student
    print("\nTesting Student Update...")
    # Update to high values to hopefully change risk
    update_data = {
        "name": "Risk Test Student Updated",
        "attendance": 90,
        "marks": 90,
        "assignments": 10,
        "study_hours": 10
    }
    
    response = requests.put(f"{BASE_URL}/students/{student_id}", json=update_data, headers=headers)
    if response.status_code != 200:
        print(f"Failed to update student: {response.text}")
        return
        
    updated_student = response.json()
    new_risk = updated_student.get("risk_level")
    print(f"Updated Student Risk: {new_risk}")
    
    if new_risk == risk:
        print("WARNING: Risk did not change. This might be correct if model is stable, but verify values.")
    else:
        print("SUCCESS: Risk updated on modification.")
        
    # Cleanup
    requests.delete(f"{BASE_URL}/students/{student_id}", headers=headers)
    print("\nCleanup done.")

if __name__ == "__main__":
    test_risk_flow()
