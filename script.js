const display = document.getElementById('display');

let current = '0';      // число, яке зараз вводиться
let previous = null;    // попереднє число
let operator = null;    // обрана операція
let resetNext = false;  // чи почати нове число при наступному введенні

function updateDisplay() {
  display.textContent = current;
}

function inputNumber(num) {
  if (resetNext || current === '0' || current === 'Помилка') {
    current = num;
    resetNext = false;
  } else {
    current += num;
  }
}

function inputDot() {
  if (resetNext || current === 'Помилка') {
    current = '0.';
    resetNext = false;
  } else if (!current.includes('.')) {
    current += '.';
  }
}

function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? null : a / b;
  }
}

function formatResult(value) {
  if (value === null || !isFinite(value)) return 'Помилка';
  // Прибираємо похибки на кшталт 0.1 + 0.2 = 0.30000000000000004
  return String(parseFloat(value.toPrecision(12)));
}

function chooseOperator(op) {
  if (current === 'Помилка') return;
  if (operator && !resetNext) {
    evaluate();
    if (current === 'Помилка') return;
  }
  previous = parseFloat(current);
  operator = op;
  resetNext = true;
}

function evaluate() {
  if (operator === null || previous === null) return;
  const result = calculate(previous, parseFloat(current), operator);
  current = formatResult(result);
  previous = null;
  operator = null;
  resetNext = true;
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  resetNext = false;
}

function backspace() {
  if (resetNext || current === 'Помилка') {
    current = '0';
    resetNext = false;
    return;
  }
  current = current.length > 1 ? current.slice(0, -1) : '0';
  if (current === '-') current = '0';
}

function percent() {
  if (current === 'Помилка') return;
  current = formatResult(parseFloat(current) / 100);
}

document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const { num, op, action } = btn.dataset;

  if (num !== undefined) inputNumber(num);
  else if (op) chooseOperator(op);
  else if (action === 'dot') inputDot();
  else if (action === 'equals') evaluate();
  else if (action === 'clear') clearAll();
  else if (action === 'backspace') backspace();
  else if (action === 'percent') percent();

  updateDisplay();
});

// Підтримка клавіатури
document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (/^[0-9]$/.test(key)) inputNumber(key);
  else if (['+', '-', '*', '/'].includes(key)) chooseOperator(key);
  else if (key === '.' || key === ',') inputDot();
  else if (key === 'Enter' || key === '=') { e.preventDefault(); evaluate(); }
  else if (key === 'Escape') clearAll();
  else if (key === 'Backspace') backspace();
  else if (key === '%') percent();
  else return;

  updateDisplay();
});
