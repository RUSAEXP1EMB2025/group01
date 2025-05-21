// スプレッドシートにTV stateを記録する関数
function recordTVState(isTVOn) {
  const sheet = getSheet('sensor'); // ＊＊必要に応じてシート名を変更＊＊
  const lastRow = sheet.getLastRow() + 1;
  
  // テレビの状態を記録 (1: オン, 0: オフ)
  const tvState = isTVOn ? 1 : 0;

  sheet.getRange(lastRow, 6).setValue(tvState); // TV stateを6列目に記録

  Logger.log(`TV stateを記録しました: TV = ${tvState}`);
}

//スプレッドシートにチャンネルの設定を書き込む関数
function writeNumber(number) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow() + 1; // 次の行を取得
  sheet.getRange(lastRow, 5).setValue(number);
}
