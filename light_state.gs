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
  const columnValues = sheet.getRange("E:E").getValues(); // E列の全データを取得
  let lastRow = 0;

  // 最後に書き込まれている行を調べる（空白でない最後の行）
  for (let i = 0; i < columnValues.length; i++) {
    if (columnValues[i][0] !== "") {
      lastRow = i + 1;
    }
  }

  // 最後の書き込みの1行下に数値を書き込む
  sheet.getRange(lastRow + 1, 5).setValue(number); // 5列目が「E列」
}

