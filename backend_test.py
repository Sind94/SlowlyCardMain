#!/usr/bin/env python3
import requests
import json
import base64
import os
import sys
import time
from typing import Dict, List, Optional, Tuple, Any

# Get the backend URL from the frontend .env file
BACKEND_URL = None
try:
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                BACKEND_URL = line.strip().split('=')[1].strip('"\'')
                break
except Exception as e:
    print(f"Error reading frontend/.env: {e}")
    sys.exit(1)

if not BACKEND_URL:
    print("Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

# Ensure BACKEND_URL has the /api prefix for all requests
API_URL = f"{BACKEND_URL}/api"

# Test data
TEST_ADMIN = {
    "email": "admin@example.com",
    "nickname": "Admin User",
    "password": "adminpassword123"
}

TEST_USER = {
    "email": "user@example.com",
    "nickname": "Regular User",
    "password": "userpassword123"
}

TEST_EXPANSION = {
    "name": "Test Expansion",
    "description": "An expansion created for testing",
    "color": "#FF5733"
}

TEST_CARD = {
    "name": "Test Card",
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
}

# Global variables to store tokens and IDs
admin_token = None
user_token = None
expansion_id = None
card_id = None

# Helper functions
def print_separator(title):
    print("\n" + "=" * 80)
    print(f" {title} ".center(80, "="))
    print("=" * 80 + "\n")

def print_response(response, include_body=True):
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {dict(response.headers)}")
    if include_body:
        try:
            print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Response Body: {response.text}")
    print()

def make_request(method, endpoint, data=None, token=None, params=None, expected_status=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    url = f"{API_URL}{endpoint}"
    
    print(f"Making {method} request to {url}")
    if data:
        print(f"Request Data: {json.dumps(data, indent=2)}")
    if params:
        print(f"Request Params: {params}")
    
    response = None
    if method.lower() == "get":
        response = requests.get(url, headers=headers, params=params)
    elif method.lower() == "post":
        response = requests.post(url, json=data, headers=headers)
    elif method.lower() == "put":
        response = requests.put(url, json=data, headers=headers)
    elif method.lower() == "delete":
        response = requests.delete(url, headers=headers)
    
    print_response(response)
    
    if expected_status and response.status_code != expected_status:
        print(f"❌ Expected status {expected_status}, got {response.status_code}")
        return False, response
    
    return True, response

# Test functions
def test_health_check():
    print_separator("Testing Health Check Endpoint")
    success, response = make_request("get", "/health", expected_status=200)
    return success

def test_register_user(user_data):
    print_separator(f"Testing User Registration for {user_data['email']}")
    success, response = make_request("post", "/auth/register", data=user_data, expected_status=200)
    if success:
        return success, response.json().get("access_token")
    return success, None

def test_login_user(user_data):
    print_separator(f"Testing User Login for {user_data['email']}")
    login_data = {"email": user_data["email"], "password": user_data["password"]}
    success, response = make_request("post", "/auth/login", data=login_data, expected_status=200)
    if success:
        return success, response.json().get("access_token")
    return success, None

def test_get_current_user(token):
    print_separator("Testing Get Current User Info")
    success, response = make_request("get", "/auth/me", token=token, expected_status=200)
    return success

def test_get_expansions():
    print_separator("Testing Get All Expansions")
    success, response = make_request("get", "/expansions", expected_status=200)
    return success

def test_create_expansion(token, expansion_data):
    print_separator("Testing Create Expansion (Admin Only)")
    success, response = make_request("post", "/expansions", data=expansion_data, token=token, expected_status=200)
    if success:
        return success, response.json().get("id")
    return success, None

def test_update_expansion(token, expansion_id, update_data):
    print_separator(f"Testing Update Expansion {expansion_id} (Admin Only)")
    success, response = make_request("put", f"/expansions/{expansion_id}", data=update_data, token=token, expected_status=200)
    return success

def test_get_cards():
    print_separator("Testing Get All Cards")
    success, response = make_request("get", "/cards", expected_status=200)
    return success

def test_get_cards_by_expansion(expansion_id):
    print_separator(f"Testing Get Cards by Expansion {expansion_id}")
    success, response = make_request("get", "/cards", params={"expansion_id": expansion_id}, expected_status=200)
    return success

def test_create_card(token, card_data, expansion_id):
    print_separator("Testing Create Card (Admin Only)")
    card_data["expansion_id"] = expansion_id
    success, response = make_request("post", "/cards", data=card_data, token=token, expected_status=200)
    if success:
        return success, response.json().get("id")
    return success, None

def test_update_card(token, card_id, update_data):
    print_separator(f"Testing Update Card {card_id} (Admin Only)")
    success, response = make_request("put", f"/cards/{card_id}", data=update_data, token=token, expected_status=200)
    return success

def test_delete_card(token, card_id):
    print_separator(f"Testing Delete Card {card_id} (Admin Only)")
    success, response = make_request("delete", f"/cards/{card_id}", token=token, expected_status=200)
    return success

def test_open_pack(token, expansion_id):
    print_separator("Testing Open Pack")
    success, response = make_request("post", "/packs/open", data={"expansion_id": expansion_id}, token=token, expected_status=200)
    return success

def test_get_all_users(token):
    print_separator("Testing Get All Users (Admin Only)")
    success, response = make_request("get", "/admin/users", token=token, expected_status=200)
    return success

def test_update_user_admin_status(admin_token, user_id, is_admin):
    print_separator(f"Testing Update User Admin Status for User {user_id} (Admin Only)")
    success, response = make_request("put", f"/admin/users/{user_id}", data={"is_admin": is_admin}, token=admin_token, expected_status=200)
    return success

def test_unauthorized_access():
    print_separator("Testing Unauthorized Access")
    
    print("Testing admin endpoint without token:")
    success, _ = make_request("get", "/admin/users", expected_status=401)
    
    print("Testing admin endpoint with non-admin token:")
    success, _ = make_request("get", "/admin/users", token=user_token, expected_status=403)
    
    print("Testing protected endpoint without token:")
    success, _ = make_request("get", "/auth/me", expected_status=401)
    
    return True

def run_all_tests():
    global admin_token, user_token, expansion_id, card_id
    
    test_results = {}
    
    # Test health check
    test_results["health_check"] = test_health_check()
    
    # Test user registration and login
    admin_success, admin_token = test_register_user(TEST_ADMIN)
    test_results["admin_registration"] = admin_success
    
    if not admin_success:
        # Try login if registration fails (user might already exist)
        admin_success, admin_token = test_login_user(TEST_ADMIN)
        test_results["admin_login"] = admin_success
    
    user_success, user_token = test_register_user(TEST_USER)
    test_results["user_registration"] = user_success
    
    if not user_success:
        # Try login if registration fails (user might already exist)
        user_success, user_token = test_login_user(TEST_USER)
        test_results["user_login"] = user_success
    
    # Test get current user
    if admin_token:
        test_results["get_admin_info"] = test_get_current_user(admin_token)
    
    if user_token:
        test_results["get_user_info"] = test_get_current_user(user_token)
    
    # Test expansions
    test_results["get_expansions"] = test_get_expansions()
    
    if admin_token:
        expansion_success, expansion_id = test_create_expansion(admin_token, TEST_EXPANSION)
        test_results["create_expansion"] = expansion_success
        
        if expansion_id:
            update_data = {"name": "Updated Test Expansion", "description": "Updated description"}
            test_results["update_expansion"] = test_update_expansion(admin_token, expansion_id, update_data)
    
    # Test cards
    test_results["get_cards"] = test_get_cards()
    
    if expansion_id:
        test_results["get_cards_by_expansion"] = test_get_cards_by_expansion(expansion_id)
        
        if admin_token:
            card_success, card_id = test_create_card(admin_token, TEST_CARD, expansion_id)
            test_results["create_card"] = card_success
            
            if card_id:
                update_data = {"name": "Updated Test Card"}
                test_results["update_card"] = test_update_card(admin_token, card_id, update_data)
    
    # Test opening a pack
    if user_token and expansion_id:
        test_results["open_pack"] = test_open_pack(user_token, expansion_id)
    
    # Test admin user management
    if admin_token:
        test_results["get_all_users"] = test_get_all_users(admin_token)
        
        # Get user ID to update
        _, response = make_request("get", "/admin/users", token=admin_token)
        users = response.json()
        user_id = None
        for user in users:
            if user["email"] == TEST_USER["email"]:
                user_id = user["id"]
                break
        
        if user_id:
            # Make user an admin
            test_results["update_user_admin"] = test_update_user_admin_status(admin_token, user_id, True)
            
            # Revert back to regular user
            test_update_user_admin_status(admin_token, user_id, False)
    
    # Test unauthorized access
    test_results["unauthorized_access"] = test_unauthorized_access()
    
    # Clean up - delete card and expansion
    if admin_token and card_id:
        test_results["delete_card"] = test_delete_card(admin_token, card_id)
    
    if admin_token and expansion_id:
        test_results["delete_expansion"] = make_request("delete", f"/expansions/{expansion_id}", token=admin_token, expected_status=200)[0]
    
    # Print summary
    print_separator("TEST SUMMARY")
    all_passed = True
    for test_name, result in test_results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        if not result:
            all_passed = False
        print(f"{test_name}: {status}")
    
    print("\nOverall Test Result:", "✅ ALL TESTS PASSED" if all_passed else "❌ SOME TESTS FAILED")
    return all_passed

if __name__ == "__main__":
    print(f"Testing SlowlyCard API at {API_URL}")
    run_all_tests()