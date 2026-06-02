const STORAGE_KEY = 'crazyHarryParOrderList:v1';

const inventorySections = [
  {
    name: 'Bread / Bakery',
    items: [
      { item: 'Dinner rolls', par: '8 dozen' },
      { item: 'Sourdough loaves', par: '10 loaves' },
      { item: 'Burger buns', par: '6 dozen' },
      { item: 'Croutons', par: '2 cases' },
      { item: 'Panko bread crumbs', par: '3 bags' }
    ]
  },
  {
    name: 'Meat / Seafood / Protein',
    items: [
      { item: 'Ribeye steaks', par: '48 each' },
      { item: 'Filet mignon', par: '36 each' },
      { item: 'New York strip steaks', par: '48 each' },
      { item: 'Prime rib roasts', par: '4 roasts' },
      { item: 'Ground beef', par: '40 lb' },
      { item: 'Chicken breasts', par: '30 lb' },
      { item: 'Salmon fillets', par: '24 each' },
      { item: 'Shrimp', par: '20 lb' },
      { item: 'Bacon', par: '15 lb' }
    ]
  },
  {
    name: 'Dairy / Eggs',
    items: [
      { item: 'Butter', par: '24 lb' },
      { item: 'Heavy cream', par: '12 quarts' },
      { item: 'Whole milk', par: '6 gallons' },
      { item: 'Cheddar cheese', par: '15 lb' },
      { item: 'Blue cheese crumbles', par: '8 lb' },
      { item: 'Parmesan', par: '10 lb' },
      { item: 'Eggs', par: '12 dozen' },
      { item: 'Sour cream', par: '8 tubs' }
    ]
  },
  {
    name: 'Produce / Herbs',
    items: [
      { item: 'Russet potatoes', par: '4 cases' },
      { item: 'Sweet potatoes', par: '2 cases' },
      { item: 'Romaine lettuce', par: '3 cases' },
      { item: 'Mixed greens', par: '2 cases' },
      { item: 'Tomatoes', par: '2 cases' },
      { item: 'Mushrooms', par: '20 lb' },
      { item: 'Onions', par: '2 sacks' },
      { item: 'Garlic', par: '5 lb' },
      { item: 'Asparagus', par: '20 lb' },
      { item: 'Parsley', par: '12 bunches' },
      { item: 'Rosemary', par: '8 bunches' }
    ]
  },
  {
    name: 'Dry Goods / Pantry',
    items: [
      { item: 'Kosher salt', par: '2 boxes' },
      { item: 'Black pepper', par: '3 containers' },
      { item: 'Steak seasoning', par: '6 containers' },
      { item: 'Flour', par: '50 lb' },
      { item: 'Sugar', par: '25 lb' },
      { item: 'Rice', par: '25 lb' },
      { item: 'Pasta', par: '4 cases' },
      { item: 'Olive oil', par: '4 gallons' },
      { item: 'Fryer oil', par: '6 jugs' }
    ]
  },
  {
    name: 'Sauces / Condiments',
    items: [
      { item: 'Worcestershire sauce', par: '4 gallons' },
      { item: 'Steak sauce', par: '3 cases' },
      { item: 'Ketchup', par: '3 cases' },
      { item: 'Dijon mustard', par: '6 jars' },
      { item: 'Mayonnaise', par: '4 gallons' },
      { item: 'BBQ sauce', par: '3 gallons' },
      { item: 'Hot sauce', par: '1 case' },
      { item: 'Beef demi-glace', par: '2 cases' }
    ]
  },
  {
    name: 'Dessert Ingredients',
    items: [
      { item: 'Vanilla ice cream', par: '6 tubs' },
      { item: 'Chocolate sauce', par: '4 bottles' },
      { item: 'Cheesecake', par: '8 cakes' },
      { item: 'Brownie mix', par: '3 cases' },
      { item: 'Whipped cream', par: '12 cans' },
      { item: 'Berries', par: '8 flats' }
    ]
  },
  {
    name: 'Paper / Chemicals / Supplies',
    items: [
      { item: 'To-go boxes', par: '4 cases' },
      { item: 'Foil sheets', par: '2 cases' },
      { item: 'Plastic wrap', par: '6 rolls' },
      { item: 'Gloves - large', par: '6 boxes' },
      { item: 'Gloves - medium', par: '6 boxes' },
      { item: 'Sanitizer buckets tablets', par: '2 bottles' },
      { item: 'Dish soap', par: '3 jugs' },
      { item: 'Trash bags', par: '3 cases' }
    ]
  },
  {
    name: 'Other / Notes',
    items: [
      { item: 'Chef special item', par: 'As needed' },
      { item: 'Holiday menu item', par: 'As needed' },
      { item: 'Repair / smallwares note', par: 'As needed' }
    ]
  }
];

const state = {
  header: {
    date: '',
    checkedBy: ''
  },
  items: {}
};

const elements = {};
let saveTimer;
let toastTimer;

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
    onHand: '',
    orderQty: '',
    vendorNotes: '',
    needsOrdering: false
  };
}

function getItemState(key) {
  if (!state.items[key]) {
    state.items[key] = defaultItemState();
  }

  return state.items[key];
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    state.header.date = new Date().toISOString().slice(0, 10);
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    state.header = { ...state.header, ...parsed.header };
    state.items = { ...state.items, ...parsed.items };
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

  inventorySections.forEach((section) => {
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
      const par = itemNode.querySelector('.par-cell');
      const parMobile = itemNode.querySelector('.item-par-mobile');
      const onHand = itemNode.querySelector('.on-hand-input');
      const orderQty = itemNode.querySelector('.order-qty-input');
      const vendorNotes = itemNode.querySelector('.vendor-notes-input');
      const needsOrdering = itemNode.querySelector('.needs-ordering-input');

      itemNode.dataset.key = key;
      itemNode.dataset.section = section.name.toLowerCase();
      itemNode.dataset.item = item.item.toLowerCase();
      name.textContent = item.item;
      par.textContent = item.par;
      parMobile.textContent = `Par: ${item.par}`;
      onHand.value = values.onHand;
      orderQty.value = values.orderQty;
      vendorNotes.value = values.vendorNotes;
      needsOrdering.checked = values.needsOrdering;
      updateNeededClass(itemNode, values);

      onHand.addEventListener('input', () => {
        values.onHand = onHand.value;
        scheduleSave();
      });

      orderQty.addEventListener('input', () => {
        values.orderQty = orderQty.value;
        updateNeededClass(itemNode, values);
        scheduleSave();
      });

      vendorNotes.addEventListener('input', () => {
        values.vendorNotes = vendorNotes.value;
        scheduleSave();
      });

      needsOrdering.addEventListener('change', () => {
        values.needsOrdering = needsOrdering.checked;
        updateNeededClass(itemNode, values);
        scheduleSave();
      });

      itemsList.append(itemNode);
    });

    elements.sectionsContainer.append(sectionNode);
  });
}

function updateNeededClass(itemNode, values) {
  const hasOrderQty = values.orderQty.trim().length > 0;
  itemNode.classList.toggle('is-needed', hasOrderQty || values.needsOrdering);
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

function clearAllCounts() {
  const confirmed = window.confirm('Clear every On Hand count, Order Qty, Vendor Note, and Needs Ordering check?');
  if (!confirmed) return;

  Object.keys(state.items).forEach((key) => {
    state.items[key] = defaultItemState();
  });

  document.querySelectorAll('.item-row').forEach((row) => {
    row.querySelector('.on-hand-input').value = '';
    row.querySelector('.order-qty-input').value = '';
    row.querySelector('.vendor-notes-input').value = '';
    row.querySelector('.needs-ordering-input').checked = false;
    row.classList.remove('is-needed');
  });

  saveState({ manual: true });
  showToast('All counts and order notes cleared.');
}

function buildOrderLines() {
  const lines = [
    'CRAZY HARRY’S STEAKHOUSE',
    'Ingredient Order List',
    `Date: ${state.header.date || 'Not entered'}`,
    `Checked By: ${state.header.checkedBy || 'Not entered'}`,
    ''
  ];

  inventorySections.forEach((section) => {
    const sectionLines = [];

    section.items.forEach((item) => {
      const values = getItemState(itemKey(section.name, item.item));
      const hasOrderQty = values.orderQty.trim().length > 0;
      if (!hasOrderQty && !values.needsOrdering) return;

      const parts = [`- ${item.item}`];
      if (hasOrderQty) parts.push(`Order: ${values.orderQty.trim()}`);
      if (values.onHand) parts.push(`On hand: ${values.onHand}`);
      if (values.vendorNotes.trim()) parts.push(`Notes: ${values.vendorNotes.trim()}`);
      if (!hasOrderQty && values.needsOrdering) parts.push('Needs ordering');
      sectionLines.push(parts.join(' | '));
    });

    if (sectionLines.length > 0) {
      lines.push(section.name, ...sectionLines, '');
    }
  });

  if (lines.length === 5) {
    lines.push('No items selected for ordering.');
  }

  return lines.join('\n').trim();
}

async function copyOrderList() {
  const orderText = buildOrderLines();

  try {
    await navigator.clipboard.writeText(orderText);
    showToast('Order list copied to clipboard.');
  } catch (error) {
    const fallback = window.prompt('Copy this order list:', orderText);
    if (fallback !== null) {
      showToast('Clipboard blocked. Order list shown for manual copy.');
    }
  }
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function exportCsv() {
  const rows = [
    ['Business', 'Date', 'Checked By', 'Section', 'Item', 'Par', 'On Hand', 'Order Qty', 'Needs Ordering', 'Vendor Notes']
  ];

  inventorySections.forEach((section) => {
    section.items.forEach((item) => {
      const values = getItemState(itemKey(section.name, item.item));
      rows.push([
        "CRAZY HARRY’S STEAKHOUSE",
        state.header.date,
        state.header.checkedBy,
        section.name,
        item.item,
        item.par,
        values.onHand,
        values.orderQty,
        values.needsOrdering ? 'Yes' : 'No',
        values.vendorNotes
      ]);
    });
  });

  const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const fileDate = state.header.date || new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `crazy-harry-order-list-${fileDate}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast('CSV export downloaded.');
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
  elements.copyOrder = document.querySelector('#copy-order');
  elements.exportCsv = document.querySelector('#export-csv');
  elements.saveProgress = document.querySelector('#save-progress');
  elements.saveStatus = document.querySelector('#save-status');
  elements.toast = document.querySelector('#toast');
}

function init() {
  bindElements();
  loadState();
  syncHeaderInputs();
  renderSections();
  registerServiceWorker();

  elements.search.addEventListener('input', filterIngredients);
  elements.clearCounts.addEventListener('click', clearAllCounts);
  elements.copyOrder.addEventListener('click', copyOrderList);
  elements.exportCsv.addEventListener('click', exportCsv);
  elements.saveProgress.addEventListener('click', () => saveState({ manual: true }));
}

init();
