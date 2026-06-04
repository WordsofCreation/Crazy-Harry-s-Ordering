const STORAGE_KEY = 'crazyHarryParOrderList:v2';
const LEGACY_STORAGE_KEY = 'crazyHarryParOrderList:v1';

const inventorySections = [
  {
    name: 'Bread / Bakery',
    items: [
      'Sourdough loaves',
      'Bread for toast points'
    ]
  },
  {
    name: 'Meat / Seafood / Protein',
    items: [
      'Dungeness crab meat',
      'Filet mignon, 6 oz portions',
      'Filet mignon, 10 oz portions',
      'Beef tenderloin / center-cut filet',
      'Ribeye, 16 oz portions',
      'Steak Sirloin Cap Strip Choice, 12 oz',
      'Short ribs',
      'Beef bones',
      'Halibut portions',
      'Sockeye salmon, 6 oz skin-on portions',
      'Chicken breast, 7 oz portions',
      'Pancetta',
      'Bacon / lardons',
      'Prosciutto, sliced'
    ]
  },
  {
    name: 'Dairy / Eggs',
    items: [
      'Unsalted butter',
      'Heavy cream',
      'Milk',
      'Eggs',
      'Buttermilk',
      'Cream cheese',
      'Sour cream',
      'Burrata',
      'Crème fraîche',
      'Shredded mozzarella',
      'Parmesan / Parmigiano',
      'Shredded Parmesan',
      'Romano cheese',
      'Gruyère',
      'Blue cheese crumbles',
      'Sharp cheddar',
      'Vanilla ice cream'
    ]
  },
  {
    name: 'Produce',
    items: [
      'Romaine hearts',
      'Iceberg lettuce',
      'Spring mix',
      'Heirloom tomatoes',
      'Glory cherry tomatoes',
      'Radish',
      'Fresh basil',
      'Fresh chives',
      'Fresh thyme',
      'Fresh mint',
      'Fresh tarragon',
      'Italian parsley',
      'Cilantro',
      'Lemons',
      'Limes',
      'Oranges',
      'Yellow onions',
      'Red onions',
      'Green onions',
      'Shallots',
      'Peeled garlic / minced garlic',
      'Carrots',
      'Celery',
      'Mixed mushrooms',
      'Leeks',
      'Artichoke hearts',
      'Brussels sprouts',
      'Yukon Gold potatoes',
      'Russet potatoes',
      'Zucchini',
      'Yellow squash',
      'Asparagus',
      'Seasonal vegetables',
      'Bananas',
      'Fresh raspberries',
      'Fresh blackberries'
    ]
  },
  {
    name: 'Dry Goods / Pantry',
    items: [
      'Mayonnaise',
      'Dijon mustard',
      'Honey Dijon',
      'Worcestershire',
      'AP flour',
      'Panko / breadcrumbs',
      'Puff pastry, 5" x 5" sheets',
      'Sugar',
      'Brown sugar',
      'Chocolate',
      'Walnuts',
      'Dried cranberries',
      'Parmesan crisps',
      'Tomato paste',
      'Sea salt',
      'Kosher salt',
      'Finishing salt',
      'Black pepper',
      'Cayenne pepper',
      'Peppercorns',
      'Old Bay seasoning',
      'Chili flakes',
      'Star anise',
      'Cinnamon sticks',
      'Bay leaves',
      'Pickling spices',
      'Vanilla'
    ]
  },
  {
    name: 'Oils / Vinegars / Liquids / Alcohol',
    items: [
      'Avocado oil',
      'Extra virgin olive oil',
      'Fry oil / beef tallow',
      'Truffle oil',
      'Red wine vinegar',
      'White wine vinegar',
      'Balsamic vinegar',
      'Champagne vinegar',
      'Red wine / red cooking wine',
      'White wine',
      'Brandy',
      'Rum',
      'Beef stock',
      'Demi-glace / demi glaze',
      'Rind Sauce',
      'Lemon juice'
    ]
  },
  {
    name: 'Frozen',
    items: [
      'Shoestring fries'
    ]
  }
].map((section) => ({
  ...section,
  items: section.items.map((item) => ({ item }))
}));

const quantityOptions = [
  '',
  '0',
  ...Array.from({ length: 100 }, (_, index) => String(index + 1)),
  '125',
  '150',
  '175',
  '200',
  '250',
  '300',
  '400',
  '500',
  'As needed'
];

const orderQuantityIdentifiers = {
  'Sourdough loaves': '',
  'Bread for toast points': '',
  'Filet mignon, 6 oz portions': '',
  'Filet mignon, 10 oz portions': '',
  'Ribeye, 16 oz portions': '',
  'Prosciutto, sliced': '',
  'Heavy cream': 'gallons',
  'Milk': 'gallon',
  'Romaine hearts': 'large heads',
  'Iceberg lettuce': 'heads',
  'Spring mix': 'plastic containers',
  'Glory cherry tomatoes': 'small containers (multicolor ok)',
  'Radish': 'bunch',
  'Fresh basil': 'bunches',
  'Fresh chives': 'bunches',
  'Italian parsley': 'bunches',
  'Red onions': 'lb',
  'Green onions': 'bunch',
  'Shallots': 'each',
  'Peeled garlic / minced garlic': 'large container',
  'Carrots': 'Lbs',
  'Brussels sprouts': 'Lbs',
  'Yukon Gold potatoes': 'Lbs',
  'Russet potatoes': 'ea',
  'Zucchini': 'ea',
  'Bananas': 'bunch',
  'Fresh blackberries': 'small containers',
  'Cayenne pepper': 'small container',
  'Old Bay seasoning': '',
  'Star anise': 'bottle or container',
  'Cinnamon sticks': 'bottle or container',
  'Vanilla': 'container fresh',
  'Fry oil / beef tallow': 'jars',
  'White wine vinegar': 'gallon',
  'White wine': 'bottles',
  'Brandy': 'bottle',
  'Rum': 'bottle',
  'Lemon juice': 'bottle'
};

const state = {
  header: {
    date: '',
    checkedBy: ''
  },
  items: {},
  customItems: [],
  removedItems: []
};

const elements = {};
let saveTimer;
let toastTimer;
let textDocumentIsLive = false;

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function itemKey(sectionName, itemName) {
  return `${slugify(sectionName)}__${slugify(itemName)}`;
}

function defaultItemState() {
  return {
    par: '',
    onHand: '',
    orderQty: '',
    vendorNotes: '',
    needsOrdering: false
  };
}

function normalizeItemName(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function customItemId(sectionName, itemName) {
  return `${itemKey(sectionName, itemName)}__custom`;
}

function sectionNames() {
  return inventorySections.map((section) => section.name);
}

function getActiveSections() {
  const removedKeys = new Set(state.removedItems || []);
  const sectionsByName = new Map(
    inventorySections.map((section) => [
      section.name,
      {
        ...section,
        items: section.items
          .filter((item) => !removedKeys.has(itemKey(section.name, item.item)))
          .map((item) => ({ ...item, isCustom: false }))
      }
    ])
  );

  (state.customItems || []).forEach((customItem) => {
    if (!sectionsByName.has(customItem.section)) return;

    const section = sectionsByName.get(customItem.section);
    if (removedKeys.has(itemKey(customItem.section, customItem.item))) return;

    section.items.push({
      item: customItem.item,
      isCustom: true,
      customId: customItem.id
    });
  });

  return Array.from(sectionsByName.values()).filter((section) => section.items.length > 0);
}

function itemExists(sectionName, itemName) {
  const normalized = normalizeItemName(itemName).toLowerCase();
  return getActiveSections().some((section) => (
    section.name === sectionName
    && section.items.some((item) => item.item.toLowerCase() === normalized)
  ));
}

function baseItemExists(sectionName, itemName) {
  const normalized = normalizeItemName(itemName).toLowerCase();
  return inventorySections.some((section) => (
    section.name === sectionName
    && section.items.some((item) => item.item.toLowerCase() === normalized)
  ));
}

function getItemState(key) {
  if (!state.items[key]) {
    state.items[key] = defaultItemState();
  }

  state.items[key] = { ...defaultItemState(), ...state.items[key] };
  return state.items[key];
}

function populateQuantitySelect(select, selectedValue) {
  select.innerHTML = '';

  quantityOptions.forEach((optionValue) => {
    const option = document.createElement('option');
    option.value = optionValue;
    option.textContent = optionValue || 'Select';
    select.append(option);
  });

  if (selectedValue && !quantityOptions.includes(selectedValue)) {
    const savedOption = document.createElement('option');
    savedOption.value = selectedValue;
    savedOption.textContent = selectedValue;
    select.append(savedOption);
  }

  select.value = selectedValue || '';
}

function selectedValueText(label, value, emptyText) {
  return value && value.trim() ? `${label}: ${value.trim()}` : emptyText;
}

function orderPrintText(value) {
  return `Order: ${formatOrderQuantity(value)}`;
}

function hasOrderQuantity(value) {
  return Boolean(value && value.trim());
}

function isOrderItem(values) {
  return Boolean(values.needsOrdering || hasOrderQuantity(values.orderQty));
}

function updateSelectedValue(labelNode, label, value, emptyText) {
  labelNode.textContent = selectedValueText(label, value, emptyText);
  labelNode.classList.toggle('has-selection', Boolean(value && value.trim()));
}

function refreshGeneratedTextDocument() {
  if (!textDocumentIsLive) return;

  elements.textDocument.value = buildTextDocument();
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!saved) {
    state.header.date = new Date().toISOString().slice(0, 10);
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    state.header = { ...state.header, ...parsed.header };
    state.items = { ...state.items, ...parsed.items };
    state.customItems = Array.isArray(parsed.customItems) ? parsed.customItems : [];
    state.removedItems = Array.isArray(parsed.removedItems) ? parsed.removedItems : [];
  } catch (error) {
    console.warn('Could not load saved inventory progress.', error);
    state.header.date = new Date().toISOString().slice(0, 10);
  }
}

function saveState({ manual = false } = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const message = manual ? 'Progress saved' : 'Autosaved';
  setSaveStatus(message, true);
  if (manual) {
    showToast('Progress saved on this device.');
  }
}

function scheduleSave() {
  clearTimeout(saveTimer);
  setSaveStatus('Unsaved changes', false);
  saveTimer = setTimeout(() => saveState(), 350);
}

function setSaveStatus(text, saved) {
  elements.saveStatus.textContent = text;
  elements.saveStatus.classList.toggle('is-saved', saved);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    elements.toast.classList.remove('is-visible');
  }, 2800);
}

function renderSections() {
  elements.sectionsContainer.innerHTML = '';
  const sectionTemplate = document.querySelector('#section-template');
  const itemTemplate = document.querySelector('#item-template');

  getActiveSections().forEach((section) => {
    const sectionNode = sectionTemplate.content.firstElementChild.cloneNode(true);
    const toggle = sectionNode.querySelector('.section-toggle');
    const title = sectionNode.querySelector('.section-title');
    const meta = sectionNode.querySelector('.section-meta');
    const itemsList = sectionNode.querySelector('.items-list');

    title.textContent = section.name;
    meta.textContent = `${section.items.length} items`;

    toggle.addEventListener('click', () => {
      const collapsed = sectionNode.classList.toggle('is-collapsed');
      toggle.setAttribute('aria-expanded', String(!collapsed));
    });

    section.items.forEach((item) => {
      const key = itemKey(section.name, item.item);
      const values = getItemState(key);
      const itemNode = itemTemplate.content.firstElementChild.cloneNode(true);
      const name = itemNode.querySelector('.item-name');
      const par = itemNode.querySelector('.par-input');
      const parMobile = itemNode.querySelector('.item-par-mobile');
      const parSelected = itemNode.querySelector('.par-selected');
      const onHand = itemNode.querySelector('.on-hand-input');
      const onHandSelected = itemNode.querySelector('.on-hand-selected');
      const orderQty = itemNode.querySelector('.order-qty-input');
      const orderQtySelected = itemNode.querySelector('.order-qty-selected');
      const orderPrint = itemNode.querySelector('.item-order-print');
      const vendorNotes = itemNode.querySelector('.vendor-notes-input');
      const needsOrdering = itemNode.querySelector('.needs-ordering-input');
      const removeButton = itemNode.querySelector('.remove-item-button');

      itemNode.dataset.key = key;
      itemNode.dataset.section = section.name.toLowerCase();
      itemNode.dataset.item = item.item.toLowerCase();
      name.textContent = item.item;
      removeButton.setAttribute('aria-label', `Remove ${item.item}`);
      populateQuantitySelect(par, values.par);
      populateQuantitySelect(onHand, values.onHand);
      populateQuantitySelect(orderQty, values.orderQty);
      parMobile.textContent = selectedValueText('Par', values.par, 'Par: Select');
      updateSelectedValue(parSelected, 'Par selected', values.par, 'No par selected');
      updateSelectedValue(onHandSelected, 'Count selected', values.onHand, 'No count selected');
      updateSelectedValue(orderQtySelected, 'Order selected', values.orderQty, 'No order selected');
      orderPrint.textContent = orderPrintText(values.orderQty);
      vendorNotes.value = values.vendorNotes;
      needsOrdering.checked = values.needsOrdering;
      updateNeededClass(itemNode, values);

      par.addEventListener('change', () => {
        values.par = par.value;
        parMobile.textContent = selectedValueText('Par', values.par, 'Par: Select');
        updateSelectedValue(parSelected, 'Par selected', values.par, 'No par selected');
        updateNeededClass(itemNode, values);
        refreshGeneratedTextDocument();
        scheduleSave();
      });

      onHand.addEventListener('change', () => {
        values.onHand = onHand.value;
        updateSelectedValue(onHandSelected, 'Count selected', values.onHand, 'No count selected');
        updateNeededClass(itemNode, values);
        refreshGeneratedTextDocument();
        scheduleSave();
      });

      orderQty.addEventListener('change', () => {
        values.orderQty = orderQty.value;
        if (hasOrderQuantity(values.orderQty)) {
          values.needsOrdering = true;
          needsOrdering.checked = true;
        }
        updateSelectedValue(orderQtySelected, 'Order selected', values.orderQty, 'No order selected');
        orderPrint.textContent = orderPrintText(values.orderQty);
        updateNeededClass(itemNode, values);
        refreshGeneratedTextDocument();
        scheduleSave();
      });

      vendorNotes.addEventListener('input', () => {
        values.vendorNotes = vendorNotes.value;
        refreshGeneratedTextDocument();
        scheduleSave();
      });

      needsOrdering.addEventListener('change', () => {
        values.needsOrdering = needsOrdering.checked;
        updateNeededClass(itemNode, values);
        refreshGeneratedTextDocument();
        scheduleSave();
      });

      removeButton.addEventListener('click', () => removeItem(section.name, item));

      itemsList.append(itemNode);
    });

    elements.sectionsContainer.append(sectionNode);
  });
}

function updateNeededClass(itemNode, values) {
  const hasAnyCount = values.par.trim().length > 0 || values.onHand.trim().length > 0;
  itemNode.classList.toggle('is-needed', isOrderItem(values));
  itemNode.classList.toggle('is-filled', hasAnyCount);
}

function syncHeaderInputs() {
  elements.inventoryDate.value = state.header.date;
  elements.checkedBy.value = state.header.checkedBy;

  elements.inventoryDate.addEventListener('input', () => {
    state.header.date = elements.inventoryDate.value;
    scheduleSave();
  });

  elements.checkedBy.addEventListener('input', () => {
    state.header.checkedBy = elements.checkedBy.value;
    scheduleSave();
  });
}

function clearedCountState(values) {
  return {
    ...defaultItemState(),
    par: values.par,
    vendorNotes: values.vendorNotes
  };
}

function clearAllCounts() {
  const confirmed = window.confirm('Clear On Hand counts, Order Qty, and Needs Ordering checks? Saved Pars and Vendor Notes will stay locked.');
  if (!confirmed) return;

  Object.keys(state.items).forEach((key) => {
    state.items[key] = clearedCountState(getItemState(key));
  });

  document.querySelectorAll('.item-row').forEach((row) => {
    const values = getItemState(row.dataset.key);

    row.querySelector('.on-hand-input').value = '';
    row.querySelector('.on-hand-selected').textContent = 'No count selected';
    row.querySelector('.on-hand-selected').classList.remove('has-selection');
    row.querySelector('.order-qty-input').value = '';
    row.querySelector('.order-qty-selected').textContent = 'No order selected';
    row.querySelector('.order-qty-selected').classList.remove('has-selection');
    row.querySelector('.item-order-print').textContent = orderPrintText('');
    row.querySelector('.needs-ordering-input').checked = false;
    updateNeededClass(row, values);
  });

  saveState({ manual: true });
  refreshGeneratedTextDocument();
  showToast('Counts and order selections cleared. Pars and vendor notes were kept.');
}

function formatOrderQuantity(value) {
  return value && value.trim() ? value.trim() : 'not entered';
}

function getOrderQuantityIdentifier(itemName) {
  if (Object.prototype.hasOwnProperty.call(orderQuantityIdentifiers, itemName)) {
    return orderQuantityIdentifiers[itemName];
  }

  return itemName;
}

function formatOrderQuantityForItem(itemName, value) {
  const quantity = formatOrderQuantity(value);
  const identifier = getOrderQuantityIdentifier(itemName);

  if (quantity === 'not entered' || identifier === '') {
    return quantity;
  }

  return `${quantity} ${identifier}`;
}

function buildTextDocument() {
  const lines = [];

  getActiveSections().forEach((section) => {
    section.items.forEach((item) => {
      const values = getItemState(itemKey(section.name, item.item));
      if (!isOrderItem(values)) return;

      lines.push(`- ${item.item} Order: ${formatOrderQuantityForItem(item.item, values.orderQty)}`);
    });
  });

  if (lines.length === 0) {
    lines.push('No items marked as needing ordering.');
  }

  return lines.join('\n');
}

function buildPrintDocument() {
  const headerLines = [
    'CRAZY HARRY’S STEAKHOUSE ORDER LIST',
    `Date: ${state.header.date || new Date().toISOString().slice(0, 10)}`
  ];

  if (state.header.checkedBy && state.header.checkedBy.trim()) {
    headerLines.push(`Checked By: ${state.header.checkedBy.trim()}`);
  }

  return `${headerLines.join('\n')}\n\n${buildTextDocument()}`;
}

function updatePrintDocument() {
  if (elements.printOrderDocument) {
    elements.printOrderDocument.textContent = buildPrintDocument();
  }
}

function updateTextDocument({ announce = false } = {}) {
  textDocumentIsLive = true;
  elements.textDocument.value = buildTextDocument();
  updatePrintDocument();
  if (announce) {
    showToast('Text document created below. It will update as you make changes.');
  }
}

function printOrderList() {
  updateTextDocument();
  updatePrintDocument();
  window.print();
}

async function copyOrderList() {
  const orderText = buildTextDocument();
  textDocumentIsLive = true;
  elements.textDocument.value = orderText;

  try {
    await navigator.clipboard.writeText(orderText);
    showToast('Text document copied to clipboard.');
  } catch (error) {
    const fallback = window.prompt('Copy this text document:', orderText);
    if (fallback !== null) {
      showToast('Clipboard blocked. Text document shown for manual copy.');
    }
  }
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportText() {
  const text = buildTextDocument();
  const fileDate = state.header.date || new Date().toISOString().slice(0, 10);

  textDocumentIsLive = true;
  elements.textDocument.value = text;
  downloadFile(`crazy-harry-order-list-${fileDate}.txt`, text, 'text/plain;charset=utf-8');
  showToast('Text export downloaded.');
}

function exportCsv() {
  const rows = [
    ['Business', 'Date', 'Checked By', 'Section', 'Item', 'Par', 'On Hand', 'Order Qty', 'Needs Ordering', 'Order Message', 'Vendor Notes']
  ];

  getActiveSections().forEach((section) => {
    section.items.forEach((item) => {
      const values = getItemState(itemKey(section.name, item.item));
      rows.push([
        "CRAZY HARRY’S STEAKHOUSE",
        state.header.date,
        state.header.checkedBy,
        section.name,
        item.item,
        values.par,
        values.onHand,
        formatOrderQuantityForItem(item.item, values.orderQty),
        isOrderItem(values) ? 'Yes' : 'No',
        isOrderItem(values) ? `${item.item} Order: ${formatOrderQuantityForItem(item.item, values.orderQty)}` : '',
        values.vendorNotes
      ]);
    });
  });

  const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n');
  const fileDate = state.header.date || new Date().toISOString().slice(0, 10);

  downloadFile(`crazy-harry-order-list-${fileDate}.csv`, csv, 'text/csv;charset=utf-8');
  showToast('CSV export downloaded.');
}

function populateSectionSelect() {
  elements.itemSectionSelect.innerHTML = '';

  sectionNames().forEach((sectionName) => {
    const option = document.createElement('option');
    option.value = sectionName;
    option.textContent = sectionName;
    elements.itemSectionSelect.append(option);
  });
}

function addItem(event) {
  event.preventDefault();

  const section = elements.itemSectionSelect.value;
  const itemName = normalizeItemName(elements.newItemName.value);

  if (!itemName) {
    showToast('Enter an item name before adding.');
    elements.newItemName.focus();
    return;
  }

  if (itemExists(section, itemName)) {
    showToast('That item is already on this section.');
    return;
  }

  const key = itemKey(section, itemName);
  const restoringBaseItem = baseItemExists(section, itemName);

  state.removedItems = (state.removedItems || []).filter((removedKey) => removedKey !== key);

  if (!restoringBaseItem) {
    state.customItems = [
      ...(state.customItems || []),
      {
        id: customItemId(section, itemName),
        section,
        item: itemName
      }
    ];
  }

  elements.newItemName.value = '';
  renderSections();
  filterIngredients();
  refreshGeneratedTextDocument();
  saveState({ manual: true });
  showToast(`${itemName} added to ${section}.`);
}

function removeItem(sectionName, item) {
  const confirmed = window.confirm(`Remove ${item.item} from ${sectionName}? Saved counts for this item will be cleared.`);
  if (!confirmed) return;

  const key = itemKey(sectionName, item.item);
  delete state.items[key];

  if (item.isCustom) {
    state.customItems = (state.customItems || []).filter((customItem) => customItem.id !== item.customId);
  } else if (!state.removedItems.includes(key)) {
    state.removedItems.push(key);
  }

  renderSections();
  filterIngredients();
  refreshGeneratedTextDocument();
  saveState({ manual: true });
  showToast(`${item.item} removed.`);
}

function filterIngredients() {
  const query = elements.search.value.trim().toLowerCase();
  let visibleRows = 0;

  document.querySelectorAll('.ingredient-section').forEach((sectionNode) => {
    const rows = Array.from(sectionNode.querySelectorAll('.item-row'));
    const sectionTitle = sectionNode.querySelector('.section-title').textContent.toLowerCase();
    let visibleInSection = 0;

    rows.forEach((row) => {
      const matches = !query || row.dataset.item.includes(query) || row.dataset.section.includes(query) || sectionTitle.includes(query);
      row.hidden = !matches;
      if (matches) {
        visibleInSection += 1;
        visibleRows += 1;
      }
    });

    sectionNode.hidden = query.length > 0 && visibleInSection === 0;
  });

  let empty = document.querySelector('.no-results');
  if (!empty) {
    empty = document.createElement('p');
    empty.className = 'no-results';
    empty.textContent = 'No matching ingredients found.';
    elements.sectionsContainer.append(empty);
  }
  empty.hidden = visibleRows !== 0;
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch((error) => {
      console.warn('Service worker registration failed.', error);
    });
  });
}

function bindElements() {
  elements.sectionsContainer = document.querySelector('#sections-container');
  elements.inventoryDate = document.querySelector('#inventory-date');
  elements.checkedBy = document.querySelector('#checked-by');
  elements.search = document.querySelector('#ingredient-search');
  elements.clearCounts = document.querySelector('#clear-counts');
  elements.createText = document.querySelector('#create-text');
  elements.copyOrder = document.querySelector('#copy-order');
  elements.exportText = document.querySelector('#export-text');
  elements.exportCsv = document.querySelector('#export-csv');
  elements.printOrder = document.querySelector('#print-order');
  elements.saveProgress = document.querySelector('#save-progress');
  elements.saveStatus = document.querySelector('#save-status');
  elements.textDocument = document.querySelector('#text-document');
  elements.printOrderDocument = document.querySelector('#print-order-document');
  elements.itemSectionSelect = document.querySelector('#item-section-select');
  elements.newItemName = document.querySelector('#new-item-name');
  elements.addItemForm = document.querySelector('#add-item-form');
  elements.toast = document.querySelector('#toast');
}

function init() {
  bindElements();
  loadState();
  syncHeaderInputs();
  populateSectionSelect();
  renderSections();
  registerServiceWorker();

  elements.search.addEventListener('input', filterIngredients);
  elements.addItemForm.addEventListener('submit', addItem);
  elements.clearCounts.addEventListener('click', clearAllCounts);
  elements.createText.addEventListener('click', () => updateTextDocument({ announce: true }));
  elements.copyOrder.addEventListener('click', copyOrderList);
  elements.exportText.addEventListener('click', exportText);
  elements.exportCsv.addEventListener('click', exportCsv);
  elements.printOrder.addEventListener('click', printOrderList);
  elements.saveProgress.addEventListener('click', () => saveState({ manual: true }));
}

init();
