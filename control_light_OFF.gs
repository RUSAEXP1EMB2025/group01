// 照明をオフにする関数
function turnOffLight() {
  const signalId = "シグナルID"; // 事前に控えたSignal IDをここに設定
  const endpoint = "https://api.nature.global/1/signals/" + signalId + "/send"; // Signalを送信するAPIエンドポイント

  const options = {
    "method": "POST",
    "headers": {
      "Authorization": "Bearer " + REMO_ACCESS_TOKEN // アクセストークンを設定
    }
  };

  try {
    // APIリクエストを送信して照明をオフ
    const response = UrlFetchApp.fetch(endpoint, options);
    Logger.log("照明をオフにしました: " + response.getContentText());

    sendLineMessage("⚫⚫⚫⚫⚫\n照明がオフになりました\n⚫⚫⚫⚫⚫"); // LINE通知を送信

    recordLightState(false);

  } catch (error) {
    Logger.log("照明の制御に失敗しました: " + error.message);
  }
}
