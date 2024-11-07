# Multicore Courseware Platform

This repository contains the code for a multicore courseware platform, consisting of both frontend and backend components.

## Frontend

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd multicore-courseware-frontend
   ```

2. Update the environment variables in the `.env` file with your configuration values.

3. Install dependencies:
   ```bash
   npm install
   ```

### Usage

Start the development server:
   ```bash
   npm start
   ```

## Backend

### Installation

1. Navigate to the backend directory:
   ```bash
   cd multicore_courseware_backend
   ```

2. Set up a virtual environment:
   ```bash
   python3 -m venv <myenv-name>
   ```

3. Activate the virtual environment:
   - For Windows:
     ```bash
     <myenv-name>\Scripts\activate
     ```
   - For Linux:
     ```bash
     source <myenv-name>/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Database Setup

Apply migrations:
   ```bash
   python3 manage.py makemigrations
   python3 manage.py migrate
   ```

### Usage
No Need to createsuperuser - database file is also shared (below is its admin panel credentials)

Run the server:
   ```bash
   python3 manage.py runserver
   ```

### Admin Panel

Access the admin panel:
   - URL: http://localhost/admin
   - Username: <admin-username> // it is shamshad mobile number
   - Password: admin

## JupyterHub Setup (TLJH)

### Installation - For Linux server 

1. Install Python and required packages:
   ```bash
   sudo apt install python3 python3-dev git curl
   ```

2. Run the TLJH bootstrap script:
   ```bash
   curl -L https://tljh.jupyter.org/bootstrap.py | sudo -E python3 - --admin <admin-user-name>
   ```

3. Access JupyterHub via the public IP address.
