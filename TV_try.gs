function turnOnTVAndSetChannel() {
  const sheet = getSheet('sensor');
  const powerSignalId = "＊＊＊＊＊"; // 電源ONのSignal ID
  const endpoint = "https://api.nature.global/1/signals/";
  const headers = {
    "Authorization": "Bearer " + REMO_ACCESS_TOKEN
  };

  const lastSensorData = getLastData("sensor");
  const channelNumber = getLastValidValue(sheet, lastSensorData, 5);
  const tvState = getLastValidValue(sheet, lastSensorData, 6);

  const channel = String(channelNumber);


  // チャンネル番号ごとのシグナルIDマップ（各数字に対するシグナル）
  const CHANNEL_SIGNAL_IDS = {
    "1": "",
    "2": "",
    //"3": "",
    "4": "",
    "5": "",
    "6": "",
    //"7": "",
    "8": "",
    //"9": "",
    "10": ""
    //"11": "",
    //"12": ""
  };

  const options = {
    "method": "POST",
    "headers": headers
  }
  
  if(tvState === 1){
    sendLineMessage("テレビの電源はすでにオンです");
    return;
  }

  try {
    //APIリクエストを送信してテレビをオン
    const response = UrlFetchApp.fetch(endpoint + powerSignalId + "/send", options);
    Logger.log("テレビをオンにしました: " + response.getContentText());

    sendLineMessage("📺📺📺📺📺\nテレビがオンになりました\n📺📺📺📺📺"); // LINE通知を送信

    recordTVState(true); // テレビの状態を1として記録

    Utilities.sleep(10000); //10秒待機

    Logger.log("設定するチャンネル: " + channel);

    // チャンネル変更処理
    const signalId = CHANNEL_SIGNAL_IDS[channel];

    UrlFetchApp.fetch(endpoint + signalId + "/send", {
      "method": "POST",
      "headers": headers
    });
//  Utilities.sleep(500); // 0.5秒待機（テレビが信号を受け取れるように）
    sendLineMessage("チャンネル：" + channel);

    // 通知とログ
    recordTVState(true);

  } catch (error) {
    Logger.log("テレビの制御に失敗しました: " + error.message);
  }
}


function tv_current(result) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow(); // 最終行を取得
  sheet.getRange(lastRow + 1, 6).setValue(result ? 1 : 0); // 6列目に記録
}

/*
function tv_current(result) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const aColumnValues = sheet.getRange("A:A").getValues();

  let aLastRow = 0;
  for (let i = 0; i < aColumnValues.length; i++) {
    if (aColumnValues[i][0] !== "") {
      aLastRow = i + 1;
    }
  }

  const valueToWrite = (result === 1) ? 1 : 0;
  sheet.getRange(aLastRow + 1, 6).setValue(valueToWrite);
}
*/
