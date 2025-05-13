# Elementor Pro Form to Google Sheets Integration

A lightweight Google Apps Script that connects Elementor Pro Forms with Google Sheets, automatically storing form submissions in organized spreadsheets.

## Overview

This project provides a simple webhook integration between Elementor Pro Forms and Google Sheets. When a form is submitted on your WordPress site, the data is automatically sent to a Google Sheet, creating new sheets as needed and organizing the data according to your preferences.

## Features

- **Automatic Sheet Creation**: Creates new sheets for different forms automatically
- **Data Preservation**: Maintains existing data when adding new submissions
- **Customizable Columns**: Control column order with the `e_gs_order` field
- **Field Filtering**: Exclude specific fields with the `e_gs_exclude` field
- **Custom Sheet Naming**: Name sheets using the `e_gs_SheetName` field
- **Email Notifications**: Optional alerts for new form submissions
- **Nested Data Support**: Handles complex form data through flattening

## Setup Instructions

1. In Google Sheets, go to "Extensions" > "App Script"
2. Paste the script from `script.js` into the editor and save
3. From the "Deploy" menu, select "Deploy as web app..."
4. Choose to execute the app as yourself, and allow Anyone to execute the script
5. Click Deploy and review permissions when prompted
6. Copy the provided URL - this is your webhook endpoint
7. In Elementor Pro, add a webhook action to your form pointing to this URL

## Configuration

### Email Notifications

To enable email notifications for new submissions:

1. Set `emailNotification` to `true` in the script
2. Change `emailAddress` to your email address

### Form Field Controls

Add these fields to your Elementor form to control the integration:

- `e_gs_SheetName`: Set the name of the sheet where data will be stored
- `e_gs_order`: Comma-separated list of field names in the order you want them to appear
- `e_gs_exclude`: Comma-separated list of field names you want to exclude from the sheet

## How It Works

The script creates a webhook endpoint that receives form data from Elementor Pro. When a form is submitted:

1. The script receives the data via POST request
2. It flattens any nested data structures
3. It determines which sheet to use based on form name or custom sheet name
4. It organizes the columns according to your preferences
5. It adds the new data to the sheet
6. It sends an email notification if enabled

