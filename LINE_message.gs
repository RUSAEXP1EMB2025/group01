const LINE_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_ACCESS_TOKEN');
const userId = "＊＊LINEユーザーID＊＊"; // **変えるとこ** 送信先ユーザーのID

function getTVState() {
  const sheet = getSheet('sensor'); // 必要に応じてシート名を変更
  const lastRow = sheet.getLastRow();
  if (lastRow === 0) return 0; // データがない場合はオフと見なす

  const tvState = sheet.getRange(lastRow, 6).getValue(); // 6列目：TVの状態
  return tvState;
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
    sendLineMessage("recordSensorData() の動作を停止しました。"); // 確認メッセージを送信
    stopRecordSensorData(); // トリガーを停止
  } else if (userMessage === "動作") {
    sendLineMessage("recordSensorData() の動作を再開しました。"); // 確認メッセージを送信
    startRecordSensorData(); // トリガーを再開
  } else if (userMessage === "オン" && getTVState() == 0) {
    turnOnTVAndSetChannel()
    sendLineMessage("テレビの電源をつけました"); 
  } else if (userMessage === "オン" && getTVState() == 1) {
    sendLineMessage("テレビの電源はすでについています"); 
  } else if (userMessage === "オフ" && getTVState() == 0) {
    endLineMessage("テレビの電源はすでに消えています"); 
  }else if (userMessage === "オフ" && getTVState() == 1) {
    turnOffTV();
    endLineMessage("テレビの電源を消しました"); 
  }else if (userMessage === "家を出ました") {
    sendLineMessage("テレビの電源は　ON OFF　どちらですか？");
  }else if (userMessage === "ONだったよ") {
    sendLineMessage("ONに設定しました");
    tv_current(1)
  }else if (userMessage === "OFFだったよ") {
    sendLineMessage("OFFに設定しました");
    tv_current(0)
  }else if (userMessage === "1チャンネルにして") {
    writeNumber(1);
    sendLineMessage("1チャンネルに設定しました"); 
  }else if (userMessage === "2チャンネルにして") {
    writeNumber(2);
    sendLineMessage("2チャンネルに設定しました"); 
  }else if (userMessage === "3チャンネルにして") {
    writeNumber(3);
    sendLineMessage("3チャンネルに設定しました"); 
  }else if (userMessage === "4チャンネルにして") {
    writeNumber(4);
    sendLineMessage("4チャンネルに設定しました"); 
  }else if (userMessage === "5チャンネルにして") {
    writeNumber(5);
    sendLineMessage("5チャンネルに設定しました"); 
  }else if (userMessage === "6チャンネルにして") {
    writeNumber(6);
    sendLineMessage("6チャンネルに設定しました"); 
  }else if (userMessage === "7チャンネルにして") {
    writeNumber(7);
    sendLineMessage("7チャンネルに設定しました"); 
  }else if (userMessage === "8チャンネルにして") {
    writeNumber(8);
    sendLineMessage("8チャンネルに設定しました"); 
  }else if (userMessage === "9チャンネルにして") {
    writeNumber(9);
    sendLineMessage("9チャンネルに設定しました"); 
  }else if (userMessage === "10チャンネルにして") {
    writeNumber(10);
    sendLineMessage("10チャンネルに設定しました"); 
  }else if (userMessage === "11チャンネルにして") {
    writeNumber(11);
    sendLineMessage("11チャンネルに設定しました"); 
  }else if (userMessage === "12チャンネルにして") {
    writeNumber(12);
    sendLineMessage("12チャンネルに設定しました"); 
  } else if (userMessage === '統計を取得') {
    const hourCount = analyzeSensorTimes();
    const maxHour = getMaxHour(hourCount);
    const replyText = `一番多かったのは「${maxHour}時台」です。`;

    replyToLine(replyToken, replyText);
  }
}


