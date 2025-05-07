function recordSensorData() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const deviceData = getNatureRemoData("devices"); // データ取得
    if (!deviceData || !deviceData[0].newest_events) {
      throw new Error("Nature Remoからのデータが取得できませんでした");
    }
    const lastSensorData = getLastData("sensor");   // ＊＊sensor を自分のシート名に変える＊＊

    var currentTime = new Date(); // 現在時刻
    var lastMotionTime = new Date(deviceData[0].newest_events.mo.created_at); // 人感センサーの反応時刻
    var motionDetected = (currentTime - lastMotionTime) <= 60000 ? 1 : 0; // 過去1分以内なら1、それ以外は0

    

    var arg = {
      il: deviceData[0].newest_events.il.val, // 照度
      mo: motionDetected // 反応（1または0）
    };


    const lastLightState = getLastValidValue(sheet, lastSensorData, 4);
    const lastChannelState = getLastValidValue(sheet, lastSensorData, 5);


    if (motionDetected === 1) { // 電源のオンオフを記録
      if(lastLightState === 0){
        turnOnLight(); // オンにする処理を呼び出し
      } else if(lastLightState === 1){
        turnOffLight();
      }
    } else {
      sheet.getRange(lastSensorData+1, 4).setValue(lastLightState); // Light stateを4列目に記録
    }
    
    sheet.getRange(lastSensorData+1, 5).setValue(lastChannelState); // 取得したチャンネル番号を記録
    
    setSensorData(arg, lastSensorData + 1); // スプレッドシートに記録
    Logger.log("データ記録成功: " + new Date());
    // F列の最終行の値を取得して、一つ下にコピー
    const fColumnValues = sheet.getRange("F:F").getValues();
    let fLastRow = 0;
    for (let i = 0; i < fColumnValues.length; i++) {
      if (fColumnValues[i][0] !== "") {
      fLastRow = i + 1;
  }
}
if (fLastRow > 0) {
  const lastFValue = fColumnValues[fLastRow - 1][0];
  sheet.getRange(lastSensorData + 1, 6).setValue(lastFValue); // F列 = 6列目
}

  } catch (error) {
    Logger.log("エラー発生: データ取得または記録に失敗しました - " + error.message);
  }

}


function setSensorData(data, row) { //時刻,センサ,照度 を記録
  getSheet('sensor').getRange(row, 1, 1, 3).setValues([[new Date(), data.mo, data.il]]);
}


function stopRecordSensorData() { //トリガー停止
  const triggers = ScriptApp.getProjectTriggers(); // プロジェクト内の全てのトリガーを取得

  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === "recordSensorData") {
      ScriptApp.deleteTrigger(trigger); // recordSensorDataのトリガーを削除
      Logger.log("recordSensorData() のトリガーを停止しました。");
    }
  });
}


function startRecordSensorData() { //トリガー作成
  const triggers = ScriptApp.getProjectTriggers(); // プロジェクト内のトリガーを確認

  const isTriggerSet = triggers.some(trigger => trigger.getHandlerFunction() === "recordSensorData");
  if (!isTriggerSet) {
    ScriptApp.newTrigger("recordSensorData")
      .timeBased()
      .everyMinutes(1)
      .create(); // 1分毎のトリガーを作成
    Logger.log("recordSensorData() のトリガーを再開しました。");
  } else {
    Logger.log("recordSensorData() のトリガーは既に存在しています。");
  }
}

function getLastValidValue(sheet, startRow, column) {
  let row = startRow;
  let value;

  while (row > 0) { // 行番号が1以上であることを保証
    value = sheet.getRange(row, column).getValue();
    if (value !== "" && value !== null) {
      return value; // 有効な値が見つかったら返す
    }
    row--; // さらに上の行をチェック
  }
  
  return 0; // すべて空だった場合のデフォルト値
}


