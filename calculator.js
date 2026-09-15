'use strict';

function numberFormat(number, decimals = 0, decimalPoint = '.', thousandsSeparator = ',') {
  const value = Number(number);
  const safeValue = Number.isFinite(value) ? value : 0;
  const [integer, fraction] = safeValue.toFixed(decimals).split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  return fraction ? `${formattedInteger}${decimalPoint}${fraction}` : formattedInteger;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const Calculator = (options = {}) => {
  const settings = {
    boxAmount: 10,
    boxAmountMin: 4,
    boxMainId: 'calcMainBox',
    boxId1: 'calcBox1',
    boxId2: 'calcBox2',
    ...options
  };
  const minimumAmount = Number.parseInt(settings.boxAmountMin ?? settings.boxAmount, 10);
  settings.boxAmountMin = Number.isFinite(minimumAmount) && minimumAmount > 0 ? minimumAmount : 4;
  const content = Array.isArray(settings.CALCULTATORDATA) ? settings.CALCULTATORDATA : [];

  const state = {
    use: { box1: false, box2: false },
    content,
    box1: createBoxState(),
    box2: createBoxState()
  };

  function createBoxState() {
    return {
      inputSearch: '',
      contentTemp: content,
      content: [],
      values: { total: 0, totalValue: 0 },
      amount: settings.boxAmountMin
    };
  }

  function validBox(box) {
    return box === 'box1' || box === 'box2';
  }

  function render() {
    const calculator = document.getElementById('calculator');
    if (calculator) calculator.innerHTML = compileTemplate();
  }

  function searchContent(query = '', box) {
    if (!validBox(box)) return;
    const normalizedQuery = String(query).trim().toLowerCase();
    state[box].inputSearch = query;
    state[box].contentTemp = normalizedQuery
      ? state.content.filter(item => String(item.name ?? '').toLowerCase().includes(normalizedQuery))
      : state.content;
    const boxElement = document.getElementById(box === 'box1' ? settings.boxId1 : settings.boxId2);
    if (boxElement && state.use[box]) {
      boxElement.innerHTML = compileContentAll(box);
    }
  }

  function addContentItem(index, box) {
    if (!validBox(box)) return;
    const item = state[box].contentTemp[Number(index)];
    if (!item) return;
    state[box].content.push(item);
    state[box].values.total += Number(item.price) || 0;
    state[box].values.totalValue += Number(item.value) || 0;
    state.use[box] = false;
    state[box].amount = Math.max(settings.boxAmountMin, state[box].content.length + 1);
    render();
  }

  function removeContentItem(index, box) {
    if (!validBox(box)) return;
    const item = state[box].content[Number(index)];
    if (!item) return;
    state[box].content.splice(Number(index), 1);
    state[box].values.total -= Number(item.price) || 0;
    state[box].values.totalValue -= Number(item.value) || 0;
    state[box].amount = Math.max(settings.boxAmountMin, state[box].amount - 1);
    render();
  }

  function toggleSearch(box) {
    if (!validBox(box)) return;
    state.use[box] = !state.use[box];
    render();
  }

  function compileContentAll(box) {
    if (!validBox(box)) return '';
    let result = `<table data-action="toggle-search" data-box="${box}" class="calculator"><tbody><tr><td style="padding:80px">&lt;</td></tr></tbody></table>`;
    state[box].contentTemp.forEach((item, index) => {
      result += itemTemplate(item, box, index, true);
    });
    return result;
  }

  function compileContent(box) {
    const boxState = state[box];
    let result = '';
    for (let index = 0; index < boxState.amount; index += 1) {
      if (boxState.content[index]) {
        result += itemTemplate(boxState.content[index], box, index, false);
      } else if (index === boxState.content.length) {
        result += `<table data-action="toggle-search" data-box="${box}" class="calculator"><tbody><tr><td style="padding:80px">+</td></tr></tbody></table>`;
      } else {
        result += '<table class="calculator"><tbody><tr><td style="padding:80px"></td></tr></tbody></table>';
      }
    }
    return result;
  }

  function itemTemplate(item, box, index, adding) {
    const action = adding ? 'add-item' : 'remove-item';
    return `<table data-action="${action}" data-index="${index}" data-box="${box}" class="calculator fruit">
      <tbody>
        <tr><td>${escapeHtml(item.name)}</td></tr>
        <tr><td><img src="${escapeHtml(item.pic)}" class="let2" alt="${escapeHtml(item.name)}"></td></tr>
        <tr><td style="background-color: #45466a;border-top: 1px solid #31324c;border-bottom: 1px solid #31324c;" class="value2">${escapeHtml(item.csign)} ${numberFormat(item.price, 0, ',', ',')}</td></tr>
        <tr><td class="permvalue2">${numberFormat(item.value ?? 0, 0, ',', ',')}</td></tr>
      </tbody>
    </table>`;
  }

  function totalTemplate(box) {
    const values = state[box].values;
    return `<table style="background-color: #45466a;border: 1px solid #31324c;margin: 20px auto;width: 100%;">
      <tbody>
        <tr><td style="padding:8px">Total:</td><td class="value2" style="text-align:center;padding:8px">${numberFormat(values.total, 0, ',', ',')}</td></tr>
        <tr><td style="padding:8px">Price:</td><td class="permvalue2" style="text-align:center;padding:8px">$${numberFormat(values.totalValue, 0, ',', ',')}</td></tr>
      </tbody>
    </table>`;
  }

  function boxTemplate(box, title, id) {
    const search = state.use[box]
      ? `<input type="text" data-action="search" data-box="${box}" class="search_input_calculator" placeholder="Quick Search..." value="${escapeHtml(state[box].inputSearch)}">`
      : '';
    const items = state.use[box] ? compileContentAll(box) : compileContent(box);
    return `<div class="blok"><h3 class="fullh4">${title}</h3>${search}<div id="${id}" class="sub_block">${items}</div>${totalTemplate(box)}</div>`;
  }

  function compileTemplate() {
    return `<div id="${escapeHtml(settings.boxMainId)}" class="cont">${boxTemplate('box1', 'YOU', settings.boxId1)}${boxTemplate('box2', 'THEM', settings.boxId2)}</div>`;
  }

  function initialize() {
    document.addEventListener('click', event => {
      const target = event.target.closest('[data-action]');
      if (!target) return;
      const { action, box, index } = target.dataset;
      if (action === 'toggle-search') toggleSearch(box);
      if (action === 'add-item') addContentItem(index, box);
      if (action === 'remove-item') removeContentItem(index, box);
    });
    document.addEventListener('input', event => {
      const target = event.target.closest('[data-action="search"]');
      if (target) searchContent(target.value, target.dataset.box);
    });
    window.addItem = toggleSearch;
    window.addItemBox = addContentItem;
    window.removeItem = removeContentItem;
    window.searchItem = searchContent;
    return compileTemplate();
  }

  return initialize();
};

const calculatorData = typeof CALCULATORDATA === 'undefined' ? [] : CALCULATORDATA;
const cal = Calculator({ boxAmount: 4, CALCULTATORDATA: calculatorData });
const calculatorElement = document.getElementById('calculator');
if (calculatorElement) calculatorElement.innerHTML = cal;