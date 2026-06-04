const fs = require('fs');
const vm = require('vm');

let appCode = fs.readFileSync('app.js', 'utf8');
appCode = appCode.replace(
  /init\(\);\s*$/,
  'globalThis.__appTest = { state, itemKey, getItemState, buildTextDocument, buildPrintDocument, exportCsv };'
);

const context = {
  console,
  localStorage: {
    getItem() {
      return null;
    },
    setItem() {}
  },
  navigator: {},
  window: {
    addEventListener() {},
    print() {}
  },
  document: {},
  setTimeout() {
    return 0;
  },
  clearTimeout() {},
  URL,
  Blob
};

vm.createContext(context);
vm.runInContext(appCode, context);
vm.runInContext(`
  elements.toast = { textContent: '', classList: { add() {}, remove() {} } };
  elements.textDocument = { value: '' };
  elements.printOrderDocument = { textContent: '' };
  downloadFile = (filename, content, type) => { globalThis.__download = { filename, content, type }; };
`, context);

const app = context.__appTest;
app.state.header = { date: '2026-06-04', checkedBy: 'Chef Test' };

const breadKey = app.itemKey('Bread / Bakery', 'Sourdough loaves');
app.state.items[breadKey] = {
  ...app.getItemState(breadKey),
  orderQty: '2',
  needsOrdering: false
};

const creamKey = app.itemKey('Dairy / Eggs', 'Heavy cream');
app.state.items[creamKey] = {
  ...app.getItemState(creamKey),
  orderQty: '3',
  needsOrdering: true
};

const textDocument = app.buildTextDocument();
if (!textDocument.includes('- Sourdough loaves Order: 2')) {
  throw new Error('Order quantity without checkbox missing from generated text document.');
}
if (!textDocument.includes('- Heavy cream Order: 3 gallons')) {
  throw new Error('Checked order item missing from generated text document.');
}
if ((textDocument.match(/Order:/g) || []).length !== 2) {
  throw new Error(`Expected 2 order lines, got:\n${textDocument}`);
}

const printDocument = app.buildPrintDocument();
if (!printDocument.includes('Date: 2026-06-04')) {
  throw new Error('Print document date header missing.');
}
if (!printDocument.includes('Checked By: Chef Test')) {
  throw new Error('Print document checked-by header missing.');
}

app.exportCsv();
const csv = context.__download.content;
if (!csv.includes('"Order Message"')) {
  throw new Error('CSV Order Message column missing.');
}
if (!csv.includes('"Sourdough loaves Order: 2"')) {
  throw new Error('CSV missing auto-marked order message.');
}
if (!csv.includes('"Heavy cream Order: 3 gallons"')) {
  throw new Error('CSV missing checked order message.');
}

console.log('Order message, print document, and CSV export checks passed.');
