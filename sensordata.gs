function recordSensorData() {
  try {
    const deviceData = getNatureRemoData("devices"); // データ取得
    if (!deviceData || !deviceData[0].newest_events) {
      throw new Error("Nature Remoからのデータが取得できませんでした");
    }
    const lastSensorData = getLastData("sensor");   // 最終行取得

    var currentTime = new Date(); // 現在時刻
    var lastMotionTime = new Date(deviceData[0].newest_events.mo.created_at); // 人感センサーの反応時刻
    var motionDetected = (currentTime - lastMotionTime) <= 60000 ? 1 : 0; // 過去1分以内なら1、それ以外は0

    

    var arg = {
      il: deviceData[0].newest_events.il.val, // 照度
      mo: motionDetected // 反応（1または0）
    };

    const sheet = getSheet('sensor');
    const lastLightState = sheet.getRange(lastSensorData, 4).getValue(); // 1行上のLight stateを取得

    if (motionDetected === 1) {
      if(lastLightState === 0){
        turnOnLight(); // オンにする処理を呼び出し
      } else if(lastLightState === 1){
        turnOffLight();
      }
    } else {
      recordLightState(lastLightState); // 取得したLight stateを記録 
    }
    
    
    setSensorData(arg, lastSensorData + 1); // スプレッドシートに記録
    Logger.log("データ記録成功: " + new Date());


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



