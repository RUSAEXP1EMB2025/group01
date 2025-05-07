function turnOnTVAndSetChannel() {
  const powerSignalId = "テレビ用の電源ONシグナルID"; // 電源ONのSignal ID
  const endpoint = "https://api.nature.global/1/signals/";
  const headers = {
    "Authorization": "Bearer " + REMO_ACCESS_TOKEN
  };

  // チャンネル番号ごとのシグナルIDマップ（各数字に対するシグナル）
  const CHANNEL_SIGNAL_IDS = {
    "1": "signal_id_for_1",
    "2": "signal_id_for_2",
    "3": "signal_id_for_3",
    "4": "signal_id_for_4",
    "5": "signal_id_for_5",
    "6": "signal_id_for_6",
    "7": "signal_id_for_7",
    "8": "signal_id_for_8",
    "9": "signal_id_for_9",
    "10": "signal_id_for_10",
    "11": "signal_id_for_11",
    "12": "signal_id_for_12"
  };

  try {
    // 1. テレビの電源をON
    UrlFetchApp.fetch(endpoint + powerSignalId + "/send", {
      "method": "POST",
      "headers": headers
    });
    Logger.log("テレビの電源をオンにしました");
    Utilities.sleep(7000);

    // 2. スプレッドシートのE列を取得
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const columnValues = sheet.getRange("E:E").getValues();
    let lastValue = null;

    for (let i = 0; i < columnValues.length; i++) {
      if (columnValues[i][0] !== "") {
        lastValue = columnValues[i][0];
      }
    }

    const channel = String(lastValue);
    Logger.log("設定するチャンネル: " + channel);

    // 3. チャンネル番号を入力
    for (let i = 0; i < channel.length; i++) {
      const digit = channel[i];
      const signalId = CHANNEL_SIGNAL_IDS[digit];
      if (signalId) {
        UrlFetchApp.fetch(endpoint + signalId + "/send", {
          "method": "POST",
          "headers": headers
        });
        Utilities.sleep(500); // 0.5秒待機（テレビが信号を受け取れるように）
      } else {
        Logger.log("未登録の数字: " + digit);
      }
    }

    // 4. 通知とログ
    sendLineMessage(`📺 テレビをオン＆チャンネル「${channel}」に切り替えました`);
    recordTVState(true);

  } catch (error) {
    Logger.log("テレビ制御エラー: " + error.message);
  }
}

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
  sheet.getRange(aLastRow, 6).setValue(valueToWrite);
}
