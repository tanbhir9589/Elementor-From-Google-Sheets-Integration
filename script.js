/*
Google Apps Script for Elementor Pro Form webhook integration.

Setup Instructions:
1. In Google Sheets, go to "Extensions" > "App Script".
2. Paste this script into the editor and save.
3. Deploy as a web app, allowing anyone to execute.
4. Use the provided URL as the webhook in your Elementor form.

Features:
- Name the sheet using "e_gs_SheetName" field in your form.
- Set column order with "e_gs_order" field.
- Exclude columns using "e_gs_exclude" field.
*/


/*
 * Elementor Pro Form to Google Sheets Integration
 * MIT License - Free to use, modify and distribute
 * No warranty or liability provided
 */

// Config
let emailNotification = false;
let emailAddress = "Change_to_your_Email";

// Constants
const EXCLUDE_PROPERTY = 'e_gs_exclude';
const ORDER_PROPERTY = 'e_gs_order';
const SHEET_NAME_PROPERTY = 'e_gs_SheetName';

let postedData = [];
let isNewSheet = false;

function doGet() {
  return HtmlService.createHtmlOutput("Webhook URL received");
}

function doPost(e) {
  postedData = JSON.parse(JSON.stringify(e.parameter));
  insertToSheet(postedData);
  return HtmlService.createHtmlOutput("Post request received");
}

const flattenObject = (obj) => {
  let result = {};
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    if (typeof obj[key] !== 'object') result[key] = obj[key];
    else {
      let flat = flattenObject(obj[key]);
      for (let subKey in flat) {
        if (flat.hasOwnProperty(subKey)) result[`${key}.${subKey}`] = flat[subKey];
      }
    }
  }
  return result;
};

const stringToArray = (str) => str.split(",").map(s => s.trim());

const getFormSheet = (sheetName) => {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getSheetByName(sheetName)) {
    ss.insertSheet(sheetName);
    isNewSheet = true;
  }
  return ss.getSheetByName(sheetName);
};

const getHeaders = (sheet, keys) => {
  let headers = isNewSheet ? [] : sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return excludeColumns(getColumnsOrder([...headers, ...keys.filter(k => !headers.includes(k))]));
};

const getValues = (headers, data) => headers.map(h => data[h]);

const insertRow = (sheet, row, values, bold = false) => {
  sheet.getRange(row, 1, 1, values.length).setValues([values])
    .setFontWeight(bold ? "bold" : "normal").setHorizontalAlignment("center");
};

const insertToSheet = (data) => {
  const flat = flattenObject(data);
  const sheet = getFormSheet(getSheetName(data));
  const headers = getHeaders(sheet, Object.keys(flat))
    .filter(h => ![EXCLUDE_PROPERTY, ORDER_PROPERTY, SHEET_NAME_PROPERTY].includes(h));
  const values = getValues(headers, flat);

  insertRow(sheet, 1, headers, true);
  insertRow(sheet, sheet.getLastRow() + 1, values);

  if (emailNotification) sendNotification(data, sheet.getUrl());
};

const getSheetName = (data) => data[SHEET_NAME_PROPERTY] || data["form_name"];

const getColumnsOrder = (headers) => {
  if (!postedData[ORDER_PROPERTY]) return headers;
  let order = stringToArray(postedData[ORDER_PROPERTY]).filter(h => headers.includes(h));
  return [...order, ...headers.filter(h => !order.includes(h))];
};

const excludeColumns = (headers) => {
  if (!postedData[EXCLUDE_PROPERTY]) return headers;
  return headers.filter(h => !stringToArray(postedData[EXCLUDE_PROPERTY]).includes(h));
};

const sendNotification = (data, url) => {
  MailApp.sendEmail(emailAddress,
    "New Elementor Pro Form Submission",
    `Form: ${data['form_name']}\nSheet URL: ${url}`,
    { name: 'Elementor Webhook Notifier' });
};








