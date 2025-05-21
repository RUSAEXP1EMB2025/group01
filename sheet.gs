const SPREADSHEET_ID = '1bYfrhsn6i-FJJuUgE-8FjdYz1ukKDGLnJ5daETlG9Ac'

function getSheet(name) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    throw new Error('シートが見つかりません');
  }

  return sheet;
}

function getLastData(name) {
  return getSheet(name).getDataRange().getValues().length;
}
