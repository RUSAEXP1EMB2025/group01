// スプレッドシートにLight stateを記録する関数
function recordLightState(isLightOn) {
  const sheet = getSheet('sensor'); // センサーデータのシートを取得
  const lastRow = sheet.getLastRow() + 1; // 次の行を取得
  // 照明の状態を記録 (1: オン, 0: オフ)
  const lightState = isLightOn ? 1 : 0;
  sheet.getRange(lastRow, 4).setValue(lightState); // Light stateを4列目に記録

  Logger.log(`Light stateを記録しました: Light = ${lightState}`);
}

//スプレッドシートにチャンネルの設定を書き込む関数
function writeNumber(number) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow() + 1; // 次の行を取得
  sheet.getRange(lastRow, 5).setValue(number);

}
