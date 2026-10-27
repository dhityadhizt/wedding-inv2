var SHEET_NAME_CONFIG = "Config";
var SHEET_NAME_RSVP = "RSVP";
var SHEET_NAME_WISHES = "Wishes";

function doGet(e) {
  var params = e.parameter;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (params.action === "getData") {
    var sheet = ss.getSheetByName(SHEET_NAME_CONFIG);
    var rows = sheet.getDataRange().getValues();
    var data = {};
    for (var i = 1; i < rows.length; i++) {
      data[rows[i][0]] = rows[i][1];
    }
    return ContentService.createTextOutput(JSON.stringify({status: "success", data: data}))
                        .setMimeType(ContentService.MimeType.JSON);
  }
  
  if (params.action === "getComments") {
    var sheet = ss.getSheetByName(SHEET_NAME_WISHES);
    var rows = sheet.getDataRange().getValues();
    var comments = [];
    for (var i = rows.length - 1; i >= 1; i--) {
      comments.push({
        name: rows[i][0],
        message: rows[i][1],
        date: rows[i][2]
      });
    }
    return ContentService.createTextOutput(JSON.stringify({status: "success", comments: comments}))
                        .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var timestamp = new Date().toLocaleString();
  
  if (data.type === "rsvp") {
    var sheet = ss.getSheetByName(SHEET_NAME_RSVP);
    sheet.appendRow([timestamp, data.name, data.status, data.jumlah]);
  } else if (data.type === "guestbook") {
    var sheet = ss.getSheetByName(SHEET_NAME_WISHES);
    sheet.appendRow([data.name, data.message, timestamp]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: "success"}))
                      .setMimeType(ContentService.MimeType.JSON);
}
