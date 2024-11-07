from django.shortcuts import render
from rest_framework.views import APIView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from undetected_chromedriver import Chrome, ChromeOptions
import time
import json
import base64
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import requests
import os
from .models import CourseFile
# Create your views here.

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Retrieve the value of BASE_JHUB_URL
base_jhub_url = os.getenv('BASE_JHUB_URL')
jhub_admin_token = os.getenv('JHUB_ADMIN_TOKEN')


## util function to help upload notebook to server
def encode_file_to_base64(file_path):
    try:
        # Read the file in binary mode
        with open(file_path, 'rb') as file:
            # Read the content of the file
            file_content = file.read()
            # Encode the file content to Base64
            encoded_content = base64.b64encode(file_content)
            # Convert the encoded bytes to a string
            encoded_string = encoded_content.decode('utf-8')
            return encoded_string
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

import threading
from requests.exceptions import JSONDecodeError

def notebook_upload_req(encoded_string, token, username, notebook_name):
    url = f"{base_jhub_url}/user/{username}/api/contents/{notebook_name}"
    headers = {
        'Authorization': f"token {token}",
        'Content-Type': 'application/json',
    }

    # Get CSRF token from the Django server
    csrf_token = requests.get(f"{base_jhub_url}")
    csrf_token_value = csrf_token.cookies.get('_xsrf')

    # Include CSRF token in headers
    headers['_xsrf'] = csrf_token_value

    data = {
        "type": "file",
        "format": "base64",
        "name": "",
        "content": encoded_string,
        "path": ""
    }

    try:
        response = requests.put(url, headers=headers, json=data)
        response.raise_for_status()  # Raise an exception for HTTP errors
        if response.ok:
            print("Notebook uploaded successfully.")
        else:
            print("Failed to upload notebook:", response.json())
    except JSONDecodeError as e:
        print("JSON decoding error occurred:", str(e))
        print("Response content:", response.content)
    except requests.exceptions.RequestException as e:
        print("Request error occurred:", str(e))
        # Handle other request-related errors here

def _start_server(base_jhub_url, first_name, headers):
    start_server_response = requests.post(f"{base_jhub_url}/hub/api/users/{first_name}/server", headers=headers)
    return start_server_response

def uploadNotebook(username, course):
    # Extracting token from the request header
    token = f"{jhub_admin_token}"

    headers = {
        'Authorization': f"token {jhub_admin_token}",
        'Content-Type': 'application/json',
    }

    # Fetch CSRF token from Django server
    csrf_token = requests.get(f"{base_jhub_url}/get-csrf-token/")
    csrf_token_value = csrf_token.cookies.get('_xsrf')

    # Include CSRF token in headers
    headers['_xsrf'] = csrf_token_value

    # Start the JupyterHub server in a separate thread
    start_server_thread = threading.Thread(target=_start_server, args=(base_jhub_url, username, headers))
    start_server_thread.start()
    start_server_thread.join()  # Wait for the thread to complete

    
    # Fetch file paths related to the course from the database
    course_files = CourseFile.objects.filter(course=course)
    print(course_files)

    file_paths_and_names = []
    for course_file in course_files:
        # file_path = course_file.file.path  # Absolute file path
        file_name = course_file.file.name  # Relative file path (including upload_to directory)
        file_path = './media/' + file_name
        file_name = file_name.split('/')[1]
        file_paths_and_names.append((file_path, file_name))

    def upload_thread(file_path, notebook_name):
        encoded_string = encode_file_to_base64(file_path)
        if encoded_string:
            notebook_upload_req(encoded_string, token, username, notebook_name)
    
    threads = []
    for file_path_and_file_name in file_paths_and_names:
        thread = threading.Thread(target=upload_thread,
                                   args=(file_path_and_file_name[0] ,file_path_and_file_name[1]))
        threads.append(thread)
        thread.start()
    
    for thread in threads:
        thread.join()

    return True


class UploadNotebookAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Extracting token from the request header
        user = self.request.user
        username = user.first_name.lower()

        ## encoded data
        token = f"{jhub_admin_token}"

        headers = {
            'Authorization': f"token {jhub_admin_token}",
            'Content-Type': 'application/json',
        }

        # Fetch CSRF token from Django server
        csrf_token = requests.get(f"{base_jhub_url}/get-csrf-token/")
        csrf_token_value = csrf_token.cookies.get('_xsrf')

        # Include CSRF token in headers
        headers['_xsrf'] = csrf_token_value

        # Start the JupyterHub server in a separate thread
        start_server_thread = threading.Thread(target=_start_server, args=(base_jhub_url, username, headers))
        start_server_thread.start()
        start_server_thread.join()  # Wait for the thread to complete

        
        file_path = "./notebooks/your_notebook.ipynb"  # Update with the path to your file
        encoded_string = encode_file_to_base64(file_path)
        if encoded_string:
            notebook_upload_req(encoded_string, token, username)

        # Perform your processing here...
        try:
            return Response({"message": "Data received successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def get_cookies(request):
    # URL of the webpage
    url = f'{base_jhub_url}/hub/login?next='

    # Create ChromeOptions object to configure the WebDriver
    options = ChromeOptions()

    # Set options for the WebDriver
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--headless")  # Run Chrome in headless mode

    # Create a new instance of the undetected Chrome WebDriver
    driver = Chrome(options=options)

    # Open the URL in the browser
    driver.get(url)
    time.sleep(5)

    # Find the username and password input fields and submit button
    username_field = driver.find_element('id', 'username_input')
    password_field = driver.find_element('id', 'password_input')
    submit_button = driver.find_element('id', 'login_submit')

    # Enter username and password
    username_field.send_keys('shamshad')
    password_field.send_keys('password')

    # Click the submit button
    submit_button.click()

    # Wait for the login process to complete
    time.sleep(5)  # Adjust this delay as needed

    # Get the cookies
    cookies = driver.get_cookies()
    print(cookies)

    # Close the browser
    driver.quit()

    # Serialize the cookies data
    serialized_cookies = json.dumps(cookies)

    return JsonResponse(serialized_cookies, safe=False)



class GetCookiesAPIView(APIView):
    def post(self, request):
        # Call the get_cookies function to obtain cookies
        cookies = get_cookies(request)

        # Serialize the cookies data
        return cookies
    

    
class GetCorsAPIView(APIView): 
    def get(self, request):
        # Assuming you have obtained the CSRF token value somehow
        csrf_token = requests.get(f'{base_jhub_url}/csrf')
        csrf_token_value = csrf_token.cookies.get('_xsrf')
        print(csrf_token_value)

        return JsonResponse({'_xsrf': csrf_token_value})
    

import requests
def createJhubUser(username) :

    # Define the request body
    body = {
        "usernames": [
            f"{username}"
        ],
        "admin": False
    }

    # Define the URL
    url = f"{base_jhub_url}/hub/api/users"

    # Define headers with CSRF token
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"token {jhub_admin_token}"  # Replace YOUR_CSRF_TOKEN_HERE with your CSRF token
    }

    # Make the POST request
    response = requests.post(url, json=body, headers=headers)

    # Check if the request was successful
    if response.status_code == 201:
        print("User created successfully for JupyterHub")
        return True
    else:
        print(f"Error: {response.status_code} - {response.reason}")
        return False
    
import threading


class GetJhubUserTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def _start_server(self, base_jhub_url, first_name, headers):
        start_server_response = requests.post(f"{base_jhub_url}/hub/api/users/{first_name}/server", headers=headers)
        return start_server_response

    def get(self, request):
        first_name = request.user.first_name.lower()

        url = f"{base_jhub_url}/hub/api/users/{first_name.lower()}/tokens"

        headers = {
            'Authorization': f"token {jhub_admin_token}",
            'Content-Type': 'application/json',
        }

        # Fetch CSRF token from Django server
        csrf_token = requests.get(f"{base_jhub_url}/get-csrf-token/")
        csrf_token_value = csrf_token.cookies.get('_xsrf')

        # Include CSRF token in headers
        headers['_xsrf'] = csrf_token_value

        # Start the JupyterHub server in a separate thread
        start_server_thread = threading.Thread(target=self._start_server, args=(base_jhub_url, first_name, headers))
        start_server_thread.start()
        start_server_thread.join()  # Wait for the thread to complete

        
        data = {
            "expires_in": 3600,
            "note": "string",
            "roles": [
                "user"
            ]
        }

        response = requests.post(url, headers=headers, json=data)

        if response.ok:
            token = response.json().get('token')
            return Response({'token': token, 'first_name': first_name}, status=response.status_code)
        else:
            return Response(response.json(), status=response.status_code)