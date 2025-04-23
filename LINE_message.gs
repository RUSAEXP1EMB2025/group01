const LINE_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_ACCESS_TOKEN');
const userId = "ラインのユーザーID"; // 送信先ユーザーのID


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
    sendLineMessage("recordSensorData() の動作を停止しました。"); // 確認メッセージを送信
    stopRecordSensorData(); // トリガーを停止
  } else if (userMessage === "動作") {
    sendLineMessage("recordSensorData() の動作を再開しました。"); // 確認メッセージを送信
    startRecordSensorData(); // トリガーを再開
  } else if (userMessage === "オン") {
    turnOnLight();
  } else if (userMessage === "オフ") {
    turnOffLight();
  }
}




