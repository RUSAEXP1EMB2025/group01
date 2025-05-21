const REMO_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('REMO_ACCESS_TOKEN');

function getNatureRemoData(endpoint) {
  
  const headers = {
    "Content-Type" : "application/json;",
    'Authorization': 'Bearer ' + REMO_ACCESS_TOKEN,
  };

  const options = {
    "method" : "get",
    "headers" : headers,
  };

  return JSON.parse(UrlFetchApp.fetch("https://api.nature.global/1/" + endpoint, options));
}
