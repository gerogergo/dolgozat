function doPost(e){

  const sheet = SpreadsheetApp
  .getActiveSpreadsheet()
  .getActiveSheet();


  const data = JSON.parse(e.postData.contents);


  sheet.appendRow([

    new Date(),

    data.name,

    data.test,

    data.score,

    JSON.stringify(data.answers)

  ]);


  return ContentService
  .createTextOutput("OK");

}
