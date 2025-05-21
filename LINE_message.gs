const LINE_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_ACCESS_TOKEN');
const userId = "＊＊"; // **変えるとこ** 送信先ユーザーのID

function getTVState() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastSensorData = getLastData("sensor");
  const lastTVState = getLastValidValue(sheet, lastSensorData, 6);

  if (lastTVState !== 0 && lastTVState !== 1){
    sendLineMessage("テレビの状態が未入力です");
    return NULL;
  }

  return lastTVState;
}

function sendLineMessage(message) {
  const url = "https://api.line.me/v2/bot/message/push";

  const payload = {
    "to": userId,
    "messages": [
      {
        "type": "text", // メッセージタイプ
        "text": message // 送信するメッセージ内容
      }
    ]
  };

  const options = {
    "method": "POST",
    "headers": {
      "Authorization": "Bearer " + LINE_ACCESS_TOKEN,
      "Content-Type": "application/json"
    },
    "payload": JSON.stringify(payload)
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log("LINEメッセージ送信成功: " + response.getContentText());
  } catch (error) {
    Logger.log("LINEメッセージ送信失敗: " + error.message);
  }
}



function doPost(e) { //LINEから停止,動作を受け取りトリガーを操作する
  const userMessage = JSON.parse(e.postData.contents).events[0].message.text; // ユーザーのメッセージ内容を取得 

  if (userMessage === "停止") {
    sendLineMessage("トリガーが停止しました。"); // 確認メッセージを送信
    stopRecordSensorData(); // トリガーを停止
  } else if (userMessage === "作動") {
    sendLineMessage("トリガーが作動しました。"); // 確認メッセージを送信
    startRecordSensorData(); // トリガーを再開
    sendLineMessage("現在テレビの電源は オン オフ どちらですか？\n「オンです」or「オフです」");
  } else if (userMessage === "オンです") {
    sendLineMessage("現在のテレビの状態を オン に設定しました");
    tv_current(1)
  } else if (userMessage === "オフです") {
    sendLineMessage("現在のテレビの状態を オフ に設定しました");
    tv_current(0)
  } else if (userMessage === "オン") {
    turnOnTVAndSetChannel()
  } else if (userMessage === "オフ") {
    turnOffTV();
    
  }else if (userMessage === "1" || userMessage === "１") {
    writeNumber(1);
    sendLineMessage("1チャンネルに設定しました"); 
  }else if (userMessage === "2" || userMessage === "２") {
    writeNumber(2);
    sendLineMessage("2チャンネルに設定しました"); 
  }else if (userMessage === "3" || userMessage === "３") {
    writeNumber(3);
    sendLineMessage("3チャンネルに設定しました"); 
  }else if (userMessage === "4" || userMessage === "４") {
    writeNumber(4);
    sendLineMessage("4チャンネルに設定しました"); 
  }else if (userMessage === "5" || userMessage === "５") {
    writeNumber(5);
    sendLineMessage("5チャンネルに設定しました"); 
  }else if (userMessage === "6" || userMessage === "６") {
    writeNumber(6);
    sendLineMessage("6チャンネルに設定しました"); 
  }else if (userMessage === "7" || userMessage === "７") {
    writeNumber(7);
    sendLineMessage("7チャンネルに設定しました"); 
  }else if (userMessage === "8" || userMessage === "８") {
    writeNumber(8);
    sendLineMessage("8チャンネルに設定しました"); 
  }else if (userMessage === "9" || userMessage === "９") {
    writeNumber(9);
    sendLineMessage("9チャンネルに設定しました"); 
  }else if (userMessage === "10" || userMessage === "１０") {
    writeNumber(10);
    sendLineMessage("10チャンネルに設定しました"); 
  }else if (userMessage === "11" || userMessage === "１１") {
    writeNumber(11);
    sendLineMessage("11チャンネルに設定しました"); 
  }else if (userMessage === "12" || userMessage === "１２") {
    writeNumber(12);
    sendLineMessage("12チャンネルに設定しました"); 

  } else if (userMessage === '統計') {
    sendHourData();
  } else if(userMessage === "オン。"){
    turnOnLight();
  } else if(userMessage === "オフ。"){
    turnOffLight();
  } else if(userMessage === "センサ"){
    recordSensorData();
    sendLineMessage("センサ取得");
  }
}
