// 照明をオンにする関数
function turnOnLight() {
  const signalId = "シグナルID"; // ＊＊変えるとこ＊＊ 事前に控えたSignal IDをここに設定
  const endpoint = "https://api.nature.global/1/signals/" + signalId + "/send"; // Signalを送信するAPIエンドポイント

  const options = {
    "method": "POST",
    "headers": {
      "Authorization": "Bearer " + REMO_ACCESS_TOKEN // アクセストークンを設定
    }
  };

  try {
    // APIリクエストを送信して照明をオン
    const response = UrlFetchApp.fetch(endpoint, options);
    Logger.log("照明をオンにしました: " + response.getContentText());

    sendLineMessage("💡💡💡💡💡\n照明がオンになりました\n💡💡💡💡💡"); // LINE通知を送信

    recordLightState(true);

  } catch (error) {
    Logger.log("照明の制御に失敗しました: " + error.message);
  }
}
