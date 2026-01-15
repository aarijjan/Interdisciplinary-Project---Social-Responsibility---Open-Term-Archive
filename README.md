# IP - Social Responsibility

<!-- Our goal is to extend the [Open Terms Archive](https://opentermsarchive.org/en/) (OTA) with a Collection of german-language Terms.
Additionally we will be trialing and implementing a way to track compliance with new [Data Act](https://eur-lex.europa.eu/EN/legal-content/summary/rules-on-fair-access-to-and-use-of-data-data-act.html) (DA) regulations into the OTA.

For ease of communication, a section on important terminology is reproduced below:

- *Terms:* the contractual documents published by services (such as Terms of Service, Privacy Policy, Community Guidelines…) that users agree to.
- *Collection:* a set of tracked terms grouped by a specific scope (such as language, jurisdiction, industry…).
- *Declaration:* a JSON file that defines which terms to track for a service and how to track them.
- *Snapshot:* the original source document (HTML, PDF…) from which the terms will be extracted.
- *Version:* the textual content of the terms after filtering out irrelevant content (navigation menu, advertisements…) from a snapshot.


## Getting started

To get familiar with the OTA and their methodology you can visit their documentation here:

https://docs.opentermsarchive.org/

## Future Work

After the planning phase has concluded more information will be gathered and made available here. -->

## Overview

This project contains the _OTA Frontend_ application and the project files for the _OTA Engine/Automation_. Instructions to access the Server running the _OTA Engine_ as well as a set up guide for the _OTA Frontend_ and the _OTA Automation_ are available below.

---

## Setting up the OTA Frontend

### Prerequisites

Ensure the following are installed on your system:

- _Node.js_ – You can download it from: [https://nodejs.org/en/download](https://nodejs.org/en/download)
- _npm_ (comes with Node.js)

Verify the installations by running the following commands in terminal:

    node -v
    npm -v

Expected versions:

- node -v → _v24.12.0_
- npm -v → _11.6.2_

---

### Setup Instructions

#### 1. Clone the Repository

    git clone https://gitlab.hsrw.eu/31627/ip-social-responsibility.git

#### 2. Navigate to the Frontend Folder

    cd ota_frontend

Make sure you are inside the ota_frontend directory before proceeding.

---

### Install Dependencies

Run the following command to install all required dependencies:

    npm install --legacy-peer-deps

> _Note:_ The --legacy-peer-deps flag is required to avoid dependency resolution issues.

---

### Run the Development Server

Start the development server with:

    npm run dev

The application will start in development mode. Open your browser and navigate to the URL shown in the terminal (commonly http://localhost:5173).

---

### Troubleshooting

- Ensure the correct Node.js and npm versions are installed.
- If you encounter dependency errors, delete node_modules and package-lock.json, then rerun:

  npm install --legacy-peer-deps


## Accessing the OTA-Engine

The server running the Engine is accesible under the ip: 194.164.48.65

The necessary username and password will be included in a file inside the submission archive.

After logging in the engine is located in ''/home/ota_service_account'' and can be inspected.

Current progress/results of the engine can be accessed in the repositories:

- [Versions](https://github.com/cloudresiliencelab/german-versions) - Storage for the resulting plaintext archival data
- [Declarations](https://github.com/cloudresiliencelab/german-declarations) - Working repository storing the declarations and repository-workflows
- [Snapshots](https://github.com/cloudresiliencelab/german-snapshots) - Fallback repository containing the full HTML of targeted services before text extraction

## Setting up the dev environment for OTA Automation

### Prerequisites

- _Python_ – Accessible here: [https://www.python.org/downloads/](https://www.python.org/downloads/)
- _pip_ (installed along with python)

To check if the necessary tools are installed, the following commands can be run inside the cli of your choice:

    python --version
    pip --version

### Setup

#### 1. Clone repository

* _Note:_ If the frontend was previously installed, this step can be skipped.

Otherwise 

    git clone https://gitlab.hsrw.eu/31627/ip-social-responsibility

can be run to clone the repository.

#### 2. Navigate to the Automation Folder

    cd ota_extension/automation

#### 3. Install Dependencies

Run the following command to install all required dependencies:

    pip install -r requirements.txt

### Dev environment

The project files should now be executable by prefixing 'python' in front of the filename, e.g.:

    python webcrawler_tos.py





