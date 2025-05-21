function turnOnTVAndSetChannel() {
  const sheet = getSheet('sensor');
  const powerSignalId = "785a8447-8575-49e4-acda-1ad0ea09b84e"; // 電源ONのSignal ID
  const endpoint = "https://api.nature.global/1/signals/";
  const headers = {
    "Authorization": "Bearer " + REMO_ACCESS_TOKEN
  };

  const lastSensorData = getLastData("sensor");
  const channelNumber = getLastValidValue(sheet, lastSensorData, 5);
  const tvState = getLastValidValue(sheet, lastSensorData, 6);

  var channel = String(channelNumber);
  if (channel < 1 || channel > 12 || isNaN(channel)) {
    channel = 1;
    writeNumber(channel);
  }


  // チャンネル番号ごとのシグナルIDマップ（各数字に対するシグナル）
  const CHANNEL_SIGNAL_IDS = {
    "1": "c85ff8d7-2224-4d01-8d86-25c748726737",
    "2": "2630279c-9d6a-4a3e-b456-ff43270a0874",
    //"3": "",
    "4": "34e49357-827f-4da8-8439-105d02209ebf",
    "5": "b61d6e21-027b-42e9-9148-243371adeff3",
    "6": "0793845a-6afe-421c-8094-17f18e9bc1e9",
    //"7": "",
    "8": "70403807-fa93-45a6-9ece-06e134b712e3",
    //"9": "",
    "10": "d1649a2d-2f97-4bfe-b743-fa09a0d2a50e"
    //"11": "",
    //"12": ""
  };

  const options = {
    "method": "POST",
    "headers": headers
  }
  
  if(tvState === 1){
    sendLineMessage("テレビの電源はすでにオンです");
    recordTVState(true); // テレビの状態を1として記録
    return;
  }

  try {
    //APIリクエストを送信してテレビをオン
    const response = UrlFetchApp.fetch(endpoint + powerSignalId + "/send", options);
    Logger.log("テレビをオンにしました: " + response.getContentText());

    recordTVState(true); // テレビの状態を1として記録

    sendLineMessage("📺📺📺📺📺\nテレビがオンになりました\nチャンネル：" + channel +"\n📺📺📺📺📺"); // LINE通知を送信

    Utilities.sleep(5000); //5秒待機

    Logger.log("設定するチャンネル: " + channel);

    // チャンネル変更処理
    const signalId = CHANNEL_SIGNAL_IDS[channel];

    UrlFetchApp.fetch(endpoint + signalId + "/send", {
      "method": "POST",
      "headers": headers
    });

  } catch (error) {
    Logger.log("テレビの制御に失敗しました: " + error.message);
  }
}


function tv_current(result) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow(); // 最終行を取得
  sheet.getRange(lastRow + 1, 6).setValue(result ? 1 : 0); // 6列目に記録
}
