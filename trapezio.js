// Rivaldo Freitas de Carvalho
// Disciplina Tópicos de Ciência e Tecnologia
// Ciência e Tecnologia - UFERSA

const Table = require('cli-table');
const plot = require('nodeplotlib');

console.log("");

const a = 0;
const n = 5;
const b = 1;
const h = 0.2;

const centralizar = (mensagem) => {
  const espacosAntes = (process.stdout.columns - mensagem.length) / 2;
  const espacosDepois = process.stdout.columns - mensagem.length - espacosAntes;
  return ' '.repeat(espacosAntes) + mensagem + ' '.repeat(espacosDepois);
};

console.log(centralizar(`i={${a},${b}}, n=${n}, h=${h}`));
console.log(centralizar("y' = - y + x"));
console.log(centralizar("y(0) = 1"));
console.log(centralizar("Solução exata: y(x) = x - 1 + 2.e⁻²"));
let x = a;
let y = 1;

function f(x, y) {
  return -y + x;
}

function eulerModificadoExp(xi, yi, h) {
  const yi_mais_1 = yi + h * (-yi + xi);
  return yi_mais_1;
}

function eulerModificadoImp(xi, yi, h) {
  const xi1 = xi + h;
  const yi1 = (yi + h * xi1) / (1 + h);
  return yi1;
}

function calcularEuleImp(a, b, n, yi, h) {
  const yValores = [];
  const xValores = [];
  for (let i = 0; i <= n; i++) {
    yValores.push(yi);
    xValores.push(a + i * h);
    yi = eulerModificadoImp(a + i * h, yi, h);
  }
  return { x: xValores, y: yValores };
}

function calcularEuleExp(a, b, n, yi, h) {
  const yValores = [];
  const xValores = [];
  for (let i = 0; i <= n; i++) {
    yValores.push(yi);
    xValores.push(a + i * h);
    yi = eulerModificadoExp(a + i * h, yi, h);
  }
  return { x: xValores, y: yValores };
}

function trapezoidalRule(xi, yi, h) {
  const xi1 = xi + h;
  const f1 = f(xi, yi);
  const f2 = f(xi1, yi + h * f1);
  const yi1 = yi + (h / 2) * (f1 + f2);
  return yi1;
}

function calcularTrapezoidal(a, b, n, yi, h) {
  const yValores = [];
  const xValores = [];
  const erroGlobal = [];
  for (let i = 0; i <= n; i++) {
    yValores.push(yi);
    xValores.push(a + i * h);
    yi = trapezoidalRule(a + i * h, yi, h);
  }
  return { x: xValores, y: yValores, erro: erroGlobal };
}
// Inicia a medição do tempo dos cálculos
console.time("Tempo de processamento dos cálculos");

const { x: xValoresImp, y: yValoresImp } = calcularEuleImp(a, b, n, 1, h);
const { x: xValores, y: yValores } = calcularEuleExp(a, b, n, 1, h);
const { x: xValoresTrap, y: yValoresTrap, erro: erroGlobalTrap } = calcularTrapezoidal(a, b, n, 1, h);

// Finaliza a medição do tempo dos cálculos
console.timeEnd("Tempo de processamento dos cálculos");

const resolucaoFuncao = 10;

// Criação dos pontos Euler explícito
const trace1 = {
  x: xValores,
  y: yValores,
  mode: 'markers',
  type: 'scatter',
  name: 'Explícito',
};

// Criação da linha da função
const trace2 = {
  x: Array.from({ length: (n * resolucaoFuncao) + 1 }, (_, i) => a + (i / resolucaoFuncao) * h),
  y: Array.from({ length: (n * resolucaoFuncao) + 1 }, (_, i) => a + (i / resolucaoFuncao) * h - 1 + 2 * Math.exp(-(a + (i / resolucaoFuncao) * h))),
  mode: 'lines',
  type: 'scatter',
  name: 'Função x-1+2.e⁻²',
};

// Criação dos pontos Euler implícito
const trace3 = {
  x: xValoresImp,
  y: yValoresImp,
  mode: 'markers',
  type: 'scatter',
  name: 'Implícito',
  marker: { color: 'red' },
};

// Criação dos pontos Trapézio
const trace4 = {
  x: xValoresTrap,
  y: yValoresTrap,
  mode: 'markers',
  type: 'scatter',
  name: 'Trapézios',
  marker: { color: 'purple' },
};

// Criação da tabela
const combinedTable = new Table({
  head: ['i', 'x (Euler Explícito)', 'y_i (Euler Explícito)', 'x (Euler Implícito)', 'y_i (Euler Implícito)', 'x (Trapézios)', 'y_i (Trapézios)'],
  style: { head: ['green'] },
  colWidths: [5, 25, 25, 25, 25, 15, 19],
  chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
});

for (let i = 0; i < yValores.length; i++) {
  combinedTable.push([
    i.toString(),
    xValores[i].toFixed(4),
    yValores[i].toFixed(4),
    xValoresImp[i].toFixed(4),
    yValoresImp[i].toFixed(4),
    xValoresTrap[i].toFixed(4),
    yValoresTrap[i].toFixed(4),
  ]);
}
// Criação do Gráfico
const layout = { title: 'Gráfico da função (método de Euler e regra dos trapézios)' };
console.log("");
console.log(centralizar("Valores para Euler explícito, Euler implícito e Método da Regra dos Trapézios"));
console.log(combinedTable.toString());
console.log("");

// Plotar o gráfico
plot.plot([trace1, trace2, trace3, trace4], layout);
