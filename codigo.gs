var SHEET_NAME = 'Inscricoes';

function doGet(e) {
  return jsonResponse({ status: 'API funcionando' });
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    if (payload.action !== 'inscrever') {
      return jsonResponse({ success: false, message: 'Ação inválida.' });
    }

    var sheet = getSheet();
    var dados = sheet.getDataRange().getValues();

    // Verifica CPF duplicado (coluna índice 2)
    for (var i = 1; i < dados.length; i++) {
      if (String(dados[i][2]).trim() === String(payload.cpf).trim()) {
        return jsonResponse({ success: false, message: 'Este CPF já está inscrito.' });
      }
    }

    var agora = new Date();
    sheet.appendRow([
      Utilities.formatDate(agora, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss'),
      payload.nome            || '',
      payload.cpf             || '',
      payload.email           || '',
      payload.contato         || '',
      payload.funcao          || '',
      payload.nte             || '',
      payload.municipio       || '',
      payload.tipoDeslocamento || '',
      payload.quilometragem   || '',
      payload.valorTransporte || '',
      payload.banco           || '',
      payload.agencia         || '',
      payload.conta           || '',
      payload.tipoConta       || '',
      payload.tipoChavePix    || '',
      payload.chavePix        || ''
    ]);

    return jsonResponse({ success: true });

  } catch (err) {
    return jsonResponse({ success: false, message: 'Erro interno: ' + err.message });
  }
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    var headers = [
      'Data/Hora', 'Nome', 'CPF', 'E-mail', 'Contato', 'Função',
      'NTE', 'Município', 'Tipo de Deslocamento', 'Quilometragem (km)',
      'Valor de Transporte (R$)', 'Banco', 'Agência', 'Conta',
      'Tipo de Conta', 'Tipo de Chave PIX', 'Chave PIX'
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#1a3a8a')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    var widths = [150, 220, 120, 200, 130, 200, 80, 160, 190, 130, 150, 150, 90, 100, 120, 150, 200];
    widths.forEach(function(w, i) { sheet.setColumnWidth(i + 1, w); });
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
