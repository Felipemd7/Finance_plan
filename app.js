// Multi-month data structure
let allMonthsData = {
  "2025-09": {
    mesNome: "Setembro 2025",
    despesas: [
      { categoria: 'Invariável', descricao: 'Aluguel', situacao: 'Paga', expectativa: 1020.58, realidade: 1020.58 },
      { categoria: 'Invariável', descricao: 'Condomínio', situacao: 'Paga', expectativa: 351.04, realidade: 351.04 },
      { categoria: 'Invariável', descricao: 'Internet', situacao: 'Paga', expectativa: 89.99, realidade: 91.88 },
      { categoria: 'Invariável', descricao: 'Rastreador', situacao: 'Paga', expectativa: 59.90, realidade: 59.90 },
      { categoria: 'Invariável', descricao: 'Amazon music unlimited', situacao: 'Paga', expectativa: 21.90, realidade: 21.90 },
      { categoria: 'Variável', descricao: 'Água', situacao: 'Paga', expectativa: 85.00, realidade: 93.79 },
      { categoria: 'Variável', descricao: 'Combustível', situacao: 'Paga', expectativa: 500.00, realidade: 508.85 },
      { categoria: 'Variável', descricao: 'Gás', situacao: 'Paga', expectativa: 70.00, realidade: 36.40 },
      { categoria: 'Variável', descricao: 'Lazer', situacao: 'Paga', expectativa: 200.00, realidade: 440.59 },
      { categoria: 'Variável', descricao: 'Luz', situacao: 'Paga', expectativa: 350.00, realidade: 398.37 },
      { categoria: 'Variável', descricao: 'Supermercado', situacao: 'Paga', expectativa: 1000.00, realidade: 1143.35 },
      { categoria: 'Extra', descricao: 'Eventualidades', situacao: 'Paga', expectativa: 300.00, realidade: 239.61 }
    ],
    acompanhamento: {
      combustivel: [
        { local: 'Posto Cristo Rei', valor: 29.95 },
        { local: 'Posto Express', valor: 57.18 },
        { local: 'Posto Express', valor: 223.60 },
        { local: 'Posto Icaraí', valor: 20.00 },
        { local: 'Posto Cacique', valor: 62.82 },
        { local: 'Posto Planalto 13', valor: 57.40 },
        { local: 'Posto Planalto 22', valor: 57.90 }
      ],
      supermercado: [
        { local: 'Ferreira', quantia: 25.47 },
        { local: 'No Merkado', quantia: 5.49 },
        { local: 'Ifood', quantia: 184.23 },
        { local: 'Mercantil', quantia: 31.46 },
        { local: 'Ferreira', quantia: 29.18 },
        { local: 'Petrolínio', quantia: 9.36 },
        { local: 'Ferreira', quantia: 46.24 },
        { local: 'Petrolínio', quantia: 14.46 },
        { local: 'Mercantil', quantia: 13.96 },
        { local: 'Frigorífico', quantia: 47.00 },
        { local: 'Atacadão', quantia: 176.98 },
        { local: 'Pomar hortfrut', quantia: 102.38 },
        { local: 'Pomar hortfrut', quantia: 139.55 },
        { local: 'Pomar hortfrut', quantia: 116.88 },
        { local: 'Ferreira', quantia: 38.28 },
        { local: 'Tudo é festa', quantia: 71.00 },
        { local: 'Ferreira', quantia: 63.75 },
        { local: 'Petrolínio', quantia: 16.18 },
        { local: 'No Merkado', quantia: 11.50 }
      ],
      lazer: [
        { local: 'Dan e Dani', gasto: 47.52 },
        { local: 'Dan e Dani', gasto: 23.80 },
        { local: 'A bolaria', gasto: 36.00 },
        { local: 'Jocelia Alves', gasto: 31.00 },
        { local: 'Espesticos', gasto: 102.39 },
        { local: 'Iphome', gasto: 75.68 },
        { local: 'Bobs', gasto: 19.00 },
        { local: 'Tatu burger', gasto: 75.80 },
        { local: 'Pizza aqui em casa', gasto: 29.40 }
      ]
    },
    eventualidades: [
      { descricao: 'Luminárias', valor: 77.28 },
      { descricao: 'Paygo Bola de Ouro', valor: 31.00 },
      { descricao: 'Estacionamento', valor: 4.00 },
      { descricao: 'Le biscuit', valor: 55.00 },
      { descricao: 'Estacionamento', valor: 11.00 },
      { descricao: 'Farmácia', valor: 61.33 },
      { descricao: 'Restituir para o Felipe', valor: 104.28 },
      { descricao: 'Restituir para a Geni', valor: 200.54 }
    ]
  }
};

// Currently selected month
let currentMonth = "2025-09";

// Temporary storage for imported data
let importedData = null;

// Auto-backup preference (stored in memory only)
let autoBackupEnabled = false;
let lastBackupTime = null;

// Charts references
let planejamentoRealidadeChart = null;
let resumoCategoriaChart = null;
let pieChart = null;
let desviosDashboardChart = null;
let desviosChart = null;
let categoriaChart = null;

// Disable datalabels by default for all charts
Chart.register(ChartDataLabels);
Chart.defaults.set('plugins.datalabels', {
  display: false
});

// Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Get current month data
function getCurrentMonthData() {
  return allMonthsData[currentMonth];
}

// Month selector
function setupMonthSelector() {
  const selector = document.getElementById('month-selector');
  if (!selector) return;
  
  selector.innerHTML = '';
  
  Object.keys(allMonthsData).forEach(monthKey => {
    const option = document.createElement('option');
    option.value = monthKey;
    option.textContent = allMonthsData[monthKey].mesNome;
    if (monthKey === currentMonth) {
      option.selected = true;
    }
    selector.appendChild(option);
  });
  
  selector.addEventListener('change', (e) => {
    currentMonth = e.target.value;
    updateAll();
    showToast(`Visualizando ${allMonthsData[currentMonth].mesNome}`, 'success');
  });
}

// Add new month
function addNewMonth() {
  const monthName = prompt('Nome do novo mês (ex: Outubro 2025):');
  if (!monthName) return;
  
  const monthKey = prompt('Chave do mês (ex: 2025-10):');
  if (!monthKey || allMonthsData[monthKey]) {
    showToast('Chave inválida ou mês já existe!', 'error');
    return;
  }
  
  allMonthsData[monthKey] = {
    mesNome: monthName,
    despesas: [],
    acompanhamento: {
      combustivel: [],
      supermercado: [],
      lazer: []
    },
    eventualidades: []
  };
  
  currentMonth = monthKey;
  setupMonthSelector();
  updateAll();
  showToast(`Mês ${monthName} criado com sucesso!`, 'success');
}

// Delete current month
function deleteCurrentMonth() {
  if (Object.keys(allMonthsData).length === 1) {
    showToast('Não é possível excluir o único mês!', 'error');
    return;
  }
  
  if (confirm(`Deseja realmente excluir o mês ${allMonthsData[currentMonth].mesNome}?`)) {
    delete allMonthsData[currentMonth];
    currentMonth = Object.keys(allMonthsData)[0];
    setupMonthSelector();
    updateAll();
    showToast('Mês excluído com sucesso!', 'success');
  }
}

// Navigation
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');
  
  if (navItems.length === 0 || views.length === 0) {
    console.error('Navigation elements not found');
    return;
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewId = item.dataset.view;
      
      if (!viewId) return;
      
      const targetView = document.getElementById(viewId);
      if (!targetView) {
        console.error('View not found:', viewId);
        return;
      }
      
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      views.forEach(view => view.classList.remove('active'));
      targetView.classList.add('active');
      
      if (viewId === 'dashboard') {
        updateDashboard();
      } else if (viewId === 'relatorios') {
        updateReports();
      } else if (viewId === 'acompanhamento') {
        updateTrackingTables();
      } else if (viewId === 'eventualidades') {
        updateEventualidadesTable();
      } else if (viewId === 'dados') {
        updateDataStatus();
      }
    });
  });
}

// Setup tabs
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabButtons.length === 0 || tabContents.length === 0) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(`tab-${tabId}`).classList.add('active');
    });
  });
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) {
    console.log('Toast:', type, message);
    return;
  }
  
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Update Dashboard
function updateDashboard() {
  updateSummaryCards();
  updateExpensesTable();
  updatePlanejamentoRealidadeChart();
  updateResumoCategoriaChart();
  updatePieChart();
  updateDesviosDashboardChart();
}

// Update summary cards
function updateSummaryCards() {
  const data = getCurrentMonthData();
  const totalExpectativa = data.despesas.reduce((sum, d) => sum + d.expectativa, 0);
  const totalRealidade = data.despesas.reduce((sum, d) => sum + d.realidade, 0);
  const diferenca = totalRealidade - totalExpectativa;
  const desvioPercentual = totalExpectativa > 0 ? ((diferenca / totalExpectativa) * 100).toFixed(2) : 0;
  
  const totalExpectativaEl = document.getElementById('total-expectativa');
  const totalRealidadeEl = document.getElementById('total-realidade');
  
  if (totalExpectativaEl) totalExpectativaEl.textContent = formatCurrency(totalExpectativa);
  if (totalRealidadeEl) totalRealidadeEl.textContent = formatCurrency(totalRealidade);
  
  const diferencaEl = document.getElementById('total-diferenca');
  if (diferencaEl) {
    diferencaEl.textContent = formatCurrency(diferenca);
    diferencaEl.className = 'summary-value';
    if (diferenca < 0) {
      diferencaEl.classList.add('positive');
    } else if (diferenca > 0) {
      diferencaEl.classList.add('negative');
    }
  }
  
  const desvioEl = document.getElementById('desvio-percentual');
  if (desvioEl) {
    desvioEl.textContent = `${desvioPercentual}%`;
    desvioEl.className = 'summary-value';
    if (diferenca < 0) {
      desvioEl.classList.add('positive');
    } else if (diferenca > 0) {
      desvioEl.classList.add('negative');
    }
  }
}

// Update expenses table
function updateExpensesTable() {
  const tbody = document.getElementById('expenses-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const data = getCurrentMonthData();
  data.despesas.forEach((despesa, index) => {
    const diferenca = despesa.realidade - despesa.expectativa;
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
      <td>${despesa.categoria}</td>
      <td>${despesa.descricao}</td>
      <td><span class="status-badge ${despesa.situacao.toLowerCase()}">${despesa.situacao}</span></td>
      <td>${formatCurrency(despesa.expectativa)}</td>
      <td>${formatCurrency(despesa.realidade)}</td>
      <td style="color: ${diferenca < 0 ? 'var(--color-success)' : diferenca > 0 ? 'var(--color-error)' : 'var(--color-text)'}">
        ${formatCurrency(diferenca)}
      </td>
      <td>
        <button class="btn btn--sm btn--danger" onclick="deleteExpense(${index})" title="Excluir">
          🗑️
        </button>
      </td>
    `;
    
    tbody.appendChild(tr);
  });
}

// Search expenses
function setupSearch() {
  const searchInput = document.getElementById('search-expenses');
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#expenses-tbody tr');
    
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });
}

// Sort table
let sortDirection = {};
function sortTable(columnIndex) {
  const table = document.getElementById('expenses-table');
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  const direction = sortDirection[columnIndex] === 'asc' ? 'desc' : 'asc';
  sortDirection[columnIndex] = direction;
  
  rows.sort((a, b) => {
    const aText = a.cells[columnIndex].textContent.trim();
    const bText = b.cells[columnIndex].textContent.trim();
    
    const aNum = parseFloat(aText.replace(/[^0-9,-]/g, '').replace(',', '.'));
    const bNum = parseFloat(bText.replace(/[^0-9,-]/g, '').replace(',', '.'));
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return direction === 'asc' ? aNum - bNum : bNum - aNum;
    }
    
    return direction === 'asc' 
      ? aText.localeCompare(bText)
      : bText.localeCompare(aText);
  });
  
  tbody.innerHTML = '';
  rows.forEach(row => tbody.appendChild(row));
}

// Delete expense
function deleteExpense(index) {
  if (confirm('Deseja realmente excluir esta despesa?')) {
    getCurrentMonthData().despesas.splice(index, 1);
    updateDashboard();
    showToast('Despesa excluída com sucesso!', 'success');
  }
}

// Chart 1: Planejamento vs Realidade - All expenses horizontal bar
function updatePlanejamentoRealidadeChart() {
  const ctx = document.getElementById('planejamento-realidade-chart');
  if (!ctx) return;
  
  const data = getCurrentMonthData();
  // Sort by realidade descending
  const sortedDespesas = [...data.despesas].sort((a, b) => b.realidade - a.realidade);
  
  const labels = sortedDespesas.map(d => d.descricao);
  const expectativaData = sortedDespesas.map(d => d.expectativa);
  const realidadeData = sortedDespesas.map(d => d.realidade);
  
  if (planejamentoRealidadeChart) {
    planejamentoRealidadeChart.destroy();
  }
  
  planejamentoRealidadeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Expectativa',
          data: expectativaData,
          backgroundColor: '#3b82f6',
          borderRadius: 4
        },
        {
          label: 'Realidade',
          data: realidadeData,
          backgroundColor: '#f97316',
          borderRadius: 4
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 12 },
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatCurrency(context.parsed.x);
            }
          }
        },
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'end',
          formatter: function(value) {
            if (value === 0) return '';
            return 'R$ ' + value.toFixed(2).replace('.', ',');
          },
          font: {
            weight: 'bold',
            size: 10
          },
          color: '#1f2937'
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'R$ ' + value.toFixed(0);
            }
          }
        }
      }
    }
  });
}

// Chart 2: Resumo por Categoria
function updateResumoCategoriaChart() {
  const ctx = document.getElementById('resumo-categoria-chart');
  if (!ctx) return;
  
  const data = getCurrentMonthData();
  const categories = {};
  data.despesas.forEach(d => {
    if (!categories[d.categoria]) {
      categories[d.categoria] = { expectativa: 0, realidade: 0 };
    }
    categories[d.categoria].expectativa += d.expectativa;
    categories[d.categoria].realidade += d.realidade;
  });
  
  const labels = Object.keys(categories);
  const expectativaData = labels.map(cat => categories[cat].expectativa);
  const realidadeData = labels.map(cat => categories[cat].realidade);
  
  if (resumoCategoriaChart) {
    resumoCategoriaChart.destroy();
  }
  
  resumoCategoriaChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Expectativa',
          data: expectativaData,
          backgroundColor: '#3b82f6',
          borderRadius: 6
        },
        {
          label: 'Realidade',
          data: realidadeData,
          backgroundColor: '#f97316',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 12 },
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
            }
          }
        },
        datalabels: {
          display: true,
          anchor: 'end',
          align: 'end',
          formatter: function(value) {
            if (value === 0) return '';
            return 'R$ ' + value.toFixed(2).replace('.', ',');
          },
          font: {
            weight: 'bold',
            size: 11
          },
          color: '#1f2937'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      }
    }
  });
}

// Chart 3: Distribuição das Despesas - Pie chart with percentages
function updatePieChart() {
  const ctx = document.getElementById('pie-chart');
  if (!ctx) return;
  
  const monthData = getCurrentMonthData();
  const labels = monthData.despesas.map(d => d.descricao);
  const data = monthData.despesas.map(d => d.realidade);
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
  
  if (pieChart) {
    pieChart.destroy();
  }
  
  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 8,
            font: {
              size: 10
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = formatCurrency(context.parsed);
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        },
        datalabels: {
          display: true,
          formatter: function(value, context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            // Only show if percentage is above 3%
            if (parseFloat(percentage) < 3) return '';
            return percentage + '%';
          },
          color: '#fff',
          font: {
            weight: 'bold',
            size: 13
          },
          textStrokeColor: '#000',
          textStrokeWidth: 2
        }
      }
    }
  });
}

// Chart 4: Desvios do Planejamento - Dashboard version
function updateDesviosDashboardChart() {
  const ctx = document.getElementById('desvios-dashboard-chart');
  if (!ctx) return;
  
  const data = getCurrentMonthData();
  // Calculate deviations and sort by absolute value
  const desviosData = data.despesas.map(d => ({
    descricao: d.descricao,
    desvio: d.realidade - d.expectativa
  })).sort((a, b) => Math.abs(b.desvio) - Math.abs(a.desvio));
  
  const labels = desviosData.map(d => d.descricao);
  const desvios = desviosData.map(d => d.desvio);
  
  if (desviosDashboardChart) {
    desviosDashboardChart.destroy();
  }
  
  desviosDashboardChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Desvio (R$)',
        data: desvios,
        backgroundColor: desvios.map(d => d < 0 ? '#10b981' : '#ef4444'),
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed.x;
              return 'Desvio: ' + (value >= 0 ? '+' : '') + formatCurrency(value);
            }
          }
        },
        datalabels: {
          display: true,
          anchor: 'end',
          align: function(context) {
            return context.dataset.data[context.dataIndex] < 0 ? 'start' : 'end';
          },
          formatter: function(value) {
            if (value === 0) return '';
            const sign = value >= 0 ? '+' : '';
            return sign + 'R$ ' + value.toFixed(2).replace('.', ',');
          },
          font: {
            weight: 'bold',
            size: 10
          },
          color: function(context) {
            return context.dataset.data[context.dataIndex] < 0 ? '#10b981' : '#ef4444';
          }
        }
      },
      scales: {
        x: {
          ticks: {
            callback: function(value) {
              return 'R$ ' + value.toFixed(0);
            }
          },
          grid: {
            drawBorder: true,
            color: function(context) {
              if (context.tick.value === 0) {
                return '#000';
              }
              return 'rgba(0, 0, 0, 0.1)';
            },
            lineWidth: function(context) {
              if (context.tick.value === 0) {
                return 2;
              }
              return 1;
            }
          }
        }
      }
    }
  });
}

// Add expense form
function setupAddExpenseForm() {
  const form = document.getElementById('add-expense-form');
  if (!form) return;
  
  const expectativaInput = document.getElementById('expectativa');
  const realidadeInput = document.getElementById('realidade');
  const diferencaDisplay = document.getElementById('diferenca-display');
  
  if (!expectativaInput || !realidadeInput || !diferencaDisplay) return;
  
  function updateDiferenca() {
    const expectativa = parseFloat(expectativaInput.value) || 0;
    const realidade = parseFloat(realidadeInput.value) || 0;
    const diferenca = realidade - expectativa;
    
    diferencaDisplay.textContent = formatCurrency(diferenca);
    diferencaDisplay.style.color = diferenca < 0 ? 'var(--color-success)' : diferenca > 0 ? 'var(--color-error)' : 'var(--color-text)';
  }
  
  expectativaInput.addEventListener('input', updateDiferenca);
  realidadeInput.addEventListener('input', updateDiferenca);
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const categoriaEl = document.getElementById('categoria');
    const descricaoEl = document.getElementById('descricao');
    const situacaoEl = document.getElementById('situacao');
    const expectativaEl = document.getElementById('expectativa');
    const realidadeEl = document.getElementById('realidade');
    
    if (!categoriaEl || !descricaoEl || !situacaoEl || !expectativaEl || !realidadeEl) {
      showToast('Erro: Formulário incompleto!', 'error');
      return;
    }
    
    const newExpense = {
      categoria: categoriaEl.value,
      descricao: descricaoEl.value,
      situacao: situacaoEl.value,
      expectativa: parseFloat(expectativaEl.value),
      realidade: parseFloat(realidadeEl.value)
    };
    
    if (!newExpense.categoria || !newExpense.descricao || !newExpense.situacao || isNaN(newExpense.expectativa) || isNaN(newExpense.realidade)) {
      showToast('Por favor, preencha todos os campos corretamente!', 'error');
      return;
    }
    
    getCurrentMonthData().despesas.push(newExpense);
    
    form.reset();
    if (diferencaDisplay) diferencaDisplay.textContent = formatCurrency(0);
    
    showToast('Despesa adicionada com sucesso!', 'success');
    
    const dashboardNav = document.querySelector('.nav-item[data-view="dashboard"]');
    if (dashboardNav) dashboardNav.click();
  });
}

// Reset form
function resetForm() {
  const form = document.getElementById('add-expense-form');
  const display = document.getElementById('diferenca-display');
  
  if (form) form.reset();
  if (display) display.textContent = formatCurrency(0);
}

// Setup tracking tables
function updateTrackingTables() {
  updateCombustivelTable();
  updateSupermercadoTable();
  updateLazerTable();
}

function updateCombustivelTable() {
  const tbody = document.getElementById('combustivel-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const data = getCurrentMonthData();
  let total = 0;
  data.acompanhamento.combustivel.forEach((item, index) => {
    total += item.valor;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.local}</td>
      <td>${formatCurrency(item.valor)}</td>
      <td>
        <button class="btn btn--sm btn--danger" onclick="deleteTracking('combustivel', ${index})" title="Excluir">
          🗑️
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  const totalElement = document.getElementById('combustivel-total');
  if (totalElement) {
    totalElement.textContent = formatCurrency(total);
  }
}

function updateSupermercadoTable() {
  const tbody = document.getElementById('supermercado-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const data = getCurrentMonthData();
  let total = 0;
  data.acompanhamento.supermercado.forEach((item, index) => {
    total += item.quantia;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.local}</td>
      <td>${formatCurrency(item.quantia)}</td>
      <td>
        <button class="btn btn--sm btn--danger" onclick="deleteTracking('supermercado', ${index})" title="Excluir">
          🗑️
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  const totalElement = document.getElementById('supermercado-total');
  if (totalElement) {
    totalElement.textContent = formatCurrency(total);
  }
}

function updateLazerTable() {
  const tbody = document.getElementById('lazer-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const data = getCurrentMonthData();
  let total = 0;
  data.acompanhamento.lazer.forEach((item, index) => {
    total += item.gasto;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.local}</td>
      <td>${formatCurrency(item.gasto)}</td>
      <td>
        <button class="btn btn--sm btn--danger" onclick="deleteTracking('lazer', ${index})" title="Excluir">
          🗑️
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  const totalElement = document.getElementById('lazer-total');
  if (totalElement) {
    totalElement.textContent = formatCurrency(total);
  }
}

// Delete tracking item
function deleteTracking(type, index) {
  if (confirm('Deseja realmente excluir este item?')) {
    getCurrentMonthData().acompanhamento[type].splice(index, 1);
    updateTrackingTables();
    showToast('Item excluído com sucesso!', 'success');
  }
}

// Modal for adding tracking items
let currentModalType = '';

function openAddModal(type) {
  currentModalType = type;
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const label1 = document.getElementById('modal-label-1');
  const label2 = document.getElementById('modal-label-2');
  
  if (!modal || !title || !label1 || !label2) return;
  
  if (type === 'combustivel') {
    title.textContent = 'Adicionar Gasto com Combustível';
    label1.textContent = 'Local';
    label2.textContent = 'Valor (R$)';
  } else if (type === 'supermercado') {
    title.textContent = 'Adicionar Gasto com Supermercado';
    label1.textContent = 'Local';
    label2.textContent = 'Quantia (R$)';
  } else if (type === 'lazer') {
    title.textContent = 'Adicionar Gasto com Lazer';
    label1.textContent = 'Local';
    label2.textContent = 'Gasto (R$)';
  }
  
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('modal');
  const form = document.getElementById('modal-form');
  
  if (modal) modal.classList.remove('active');
  if (form) form.reset();
}

function setupModalForm() {
  const form = document.getElementById('modal-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const input1 = document.getElementById('modal-input-1');
    const input2 = document.getElementById('modal-input-2');
    
    if (!input1 || !input2) {
      showToast('Erro: Formulário inválido!', 'error');
      return;
    }
    
    const local = input1.value;
    const valor = parseFloat(input2.value);
    
    if (!local || isNaN(valor) || valor <= 0) {
      showToast('Por favor, preencha todos os campos corretamente!', 'error');
      return;
    }
    
    const data = getCurrentMonthData();
    if (currentModalType === 'combustivel') {
      data.acompanhamento.combustivel.push({ local, valor });
    } else if (currentModalType === 'supermercado') {
      data.acompanhamento.supermercado.push({ local, quantia: valor });
    } else if (currentModalType === 'lazer') {
      data.acompanhamento.lazer.push({ local, gasto: valor });
    }
    
    updateTrackingTables();
    closeModal();
    showToast('Item adicionado com sucesso!', 'success');
  });
}

// Eventualidades
function updateEventualidadesTable() {
  const tbody = document.getElementById('eventualidades-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const data = getCurrentMonthData();
  let total = 0;
  data.eventualidades.forEach((item, index) => {
    total += item.valor;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.descricao}</td>
      <td>${formatCurrency(item.valor)}</td>
      <td>
        <button class="btn btn--sm btn--danger" onclick="deleteEventualidade(${index})" title="Excluir">
          🗑️
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  const totalElement = document.getElementById('eventualidades-total');
  if (totalElement) {
    totalElement.textContent = formatCurrency(total);
  }
  
  const monthData = getCurrentMonthData();
  const extraExpense = monthData.despesas.find(d => d.categoria === 'Extra');
  const budgetWarning = document.getElementById('budget-warning');
  
  if (extraExpense && total > extraExpense.expectativa) {
    budgetWarning.textContent = `⚠️ Atenção: Total de eventualidades (${formatCurrency(total)}) excede o orçamento previsto (${formatCurrency(extraExpense.expectativa)})`;
    budgetWarning.classList.add('show');
  } else {
    budgetWarning.classList.remove('show');
  }
}

function deleteEventualidade(index) {
  if (confirm('Deseja realmente excluir esta eventualidade?')) {
    getCurrentMonthData().eventualidades.splice(index, 1);
    updateEventualidadesTable();
    showToast('Eventualidade excluída com sucesso!', 'success');
  }
}

function openAddEventualidade() {
  const descricao = prompt('Descrição da eventualidade:');
  if (!descricao) return;
  
  const valorStr = prompt('Valor (R$):');
  const valor = parseFloat(valorStr);
  
  if (isNaN(valor) || valor <= 0) {
    showToast('Valor inválido!', 'error');
    return;
  }
  
  getCurrentMonthData().eventualidades.push({ descricao, valor });
  updateEventualidadesTable();
  showToast('Eventualidade adicionada com sucesso!', 'success');
}

// Reports
function updateReports() {
  updateDesviosChart();
  updateCategoriaChart();
  updateStatsGrid();
}

function updateDesviosChart() {
  const ctx = document.getElementById('desvios-chart');
  if (!ctx) return;
  
  const data = getCurrentMonthData();
  const labels = data.despesas.map(d => d.descricao);
  const desvios = data.despesas.map(d => d.realidade - d.expectativa);
  
  if (desviosChart) {
    desviosChart.destroy();
  }
  
  desviosChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Desvio (R$)',
        data: desvios,
        backgroundColor: desvios.map(d => d < 0 ? '#10b981' : '#ef4444'),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed.x;
              return 'Desvio: ' + (value >= 0 ? '+' : '') + formatCurrency(value);
            }
          }
        },
        datalabels: {
          display: true,
          anchor: 'end',
          align: function(context) {
            return context.dataset.data[context.dataIndex] < 0 ? 'start' : 'end';
          },
          formatter: function(value) {
            if (value === 0) return '';
            const sign = value >= 0 ? '+' : '';
            return sign + 'R$ ' + value.toFixed(2).replace('.', ',');
          },
          font: {
            weight: 'bold',
            size: 11
          },
          color: function(context) {
            return context.dataset.data[context.dataIndex] < 0 ? '#10b981' : '#ef4444';
          }
        }
      },
      scales: {
        x: {
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      }
    }
  });
}

function updateCategoriaChart() {
  const ctx = document.getElementById('categoria-chart');
  if (!ctx) return;
  
  const monthData = getCurrentMonthData();
  const categories = {};
  monthData.despesas.forEach(d => {
    if (!categories[d.categoria]) {
      categories[d.categoria] = 0;
    }
    categories[d.categoria] += d.realidade;
  });
  
  const labels = Object.keys(categories);
  const chartData = Object.values(categories);
  const colors = ['#1FB8CD', '#FFC185', '#B4413C'];
  
  if (categoriaChart) {
    categoriaChart.destroy();
  }
  
  categoriaChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: chartData,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = formatCurrency(context.parsed);
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        },
        datalabels: {
          display: true,
          formatter: function(value, context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return percentage + '%';
          },
          color: '#fff',
          font: {
            weight: 'bold',
            size: 14
          },
          textStrokeColor: '#000',
          textStrokeWidth: 2
        }
      }
    }
  });
}

function updateStatsGrid() {
  const statsGrid = document.getElementById('stats-grid');
  if (!statsGrid) return;
  
  const data = getCurrentMonthData();
  const totalExpectativa = data.despesas.reduce((sum, d) => sum + d.expectativa, 0);
  const totalRealidade = data.despesas.reduce((sum, d) => sum + d.realidade, 0);
  const totalPago = data.despesas.filter(d => d.situacao === 'Paga').length;
  const totalPendente = data.despesas.filter(d => d.situacao === 'Pendente').length;
  const totalAtrasada = data.despesas.filter(d => d.situacao === 'Atrasada').length;
  
  statsGrid.innerHTML = `
    <div class="stat-item">
      <div class="stat-label">Total de Despesas</div>
      <div class="stat-value">${data.despesas.length}</div>
    </div>
    <div class="stat-item">
      <div class="stat-label">Despesas Pagas</div>
      <div class="stat-value">${totalPago}</div>
    </div>
    <div class="stat-item">
      <div class="stat-label">Despesas Pendentes</div>
      <div class="stat-value">${totalPendente}</div>
    </div>
    <div class="stat-item">
      <div class="stat-label">Despesas Atrasadas</div>
      <div class="stat-value">${totalAtrasada}</div>
    </div>
    <div class="stat-item">
      <div class="stat-label">Média por Despesa</div>
      <div class="stat-value">${formatCurrency(totalRealidade / data.despesas.length)}</div>
    </div>
    <div class="stat-item">
      <div class="stat-label">Economia Total</div>
      <div class="stat-value" style="color: ${totalExpectativa - totalRealidade > 0 ? 'var(--color-success)' : 'var(--color-error)'}">
        ${formatCurrency(totalExpectativa - totalRealidade)}
      </div>
    </div>
  `;
}

// Export CSV
function exportCSV() {
  let csv = 'Categoria,Descrição,Situação,Expectativa,Realidade,Diferença\n';
  
  const data = getCurrentMonthData();
  data.despesas.forEach(d => {
    const diferenca = d.realidade - d.expectativa;
    csv += `${d.categoria},${d.descricao},${d.situacao},${d.expectativa.toFixed(2)},${d.realidade.toFixed(2)},${diferenca.toFixed(2)}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `despesas_${currentMonth}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  showToast('Arquivo CSV exportado com sucesso!', 'success');
}

// Excel Import Functions
function openImportModal() {
  const modal = document.getElementById('import-modal');
  if (modal) modal.classList.add('active');
}

function closeImportModal() {
  const modal = document.getElementById('import-modal');
  const fileInput = document.getElementById('excel-file-input');
  const preview = document.getElementById('import-preview');
  
  if (modal) modal.classList.remove('active');
  if (fileInput) fileInput.value = '';
  if (preview) preview.style.display = 'none';
  importedData = null;
}

function handleExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  console.log('File selected:', file.name);
  
  if (!window.XLSX) {
    showToast('Erro: Biblioteca XLSX não carregada. Recarregue a página.', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      console.log('Reading Excel file...');
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      console.log('Sheet names:', workbook.SheetNames);
      
      const despesasSheet = workbook.Sheets['DESPESAS'];
      if (!despesasSheet) {
        showToast('Planilha "DESPESAS" não encontrada!', 'error');
        return;
      }
      
      const despesasData = [];
      const range = XLSX.utils.decode_range(despesasSheet['!ref']);
      console.log('DESPESAS range:', range);
      
      // Read despesas - start from row 2 (index 2)
      for (let row = 2; row <= range.e.r; row++) {
        const categoria = getCellValue(despesasSheet, 0, row);
        const descricao = getCellValue(despesasSheet, 1, row);
        
        // Skip if empty row or total row
        if (!categoria || !descricao) continue;
        if (categoria.toLowerCase().includes('total')) continue;
        if (descricao.toLowerCase().includes('total')) continue;
        
        const situacao = getCellValue(despesasSheet, 2, row);
        const expectativa = parseNumber(getCellValue(despesasSheet, 3, row));
        const realidade = parseNumber(getCellValue(despesasSheet, 4, row));
        
        // Only add if we have valid data
        if (expectativa !== null || realidade !== null) {
          despesasData.push({
            categoria: categoria,
            descricao: descricao,
            situacao: situacao || 'Paga',
            expectativa: expectativa || 0,
            realidade: realidade || 0
          });
        }
      }
      
      console.log('Despesas found:', despesasData.length);
      
      // Read acompanhamento (if exists)
      const acompSheet = workbook.Sheets['ACOMPANHAMENTO'];
      const combustivel = [];
      const supermercado = [];
      const lazer = [];
      
      if (acompSheet) {
        const acompRange = XLSX.utils.decode_range(acompSheet['!ref']);
        console.log('ACOMPANHAMENTO range:', acompRange);
        
        // Skip header row (row 0)
        for (let row = 1; row <= acompRange.e.r; row++) {
          // Combustível (columns A-B / 0-1)
          const combLocal = getCellValue(acompSheet, 0, row);
          const combValor = parseNumber(getCellValue(acompSheet, 1, row));
          if (combLocal && combValor !== null && 
              !combLocal.toLowerCase().includes('combustível') &&
              !combLocal.toLowerCase().includes('total') &&
              !combLocal.toLowerCase().includes('saldo')) {
            combustivel.push({ local: combLocal, valor: combValor });
          }
          
          // Supermercado (columns C-D / 2-3)
          const superLocal = getCellValue(acompSheet, 2, row);
          const superQuantia = parseNumber(getCellValue(acompSheet, 3, row));
          if (superLocal && superQuantia !== null &&
              !superLocal.toLowerCase().includes('supermercado') &&
              !superLocal.toLowerCase().includes('total') &&
              !superLocal.toLowerCase().includes('saldo')) {
            supermercado.push({ local: superLocal, quantia: superQuantia });
          }
          
          // Lazer (columns E-F / 4-5)
          const lazerLocal = getCellValue(acompSheet, 4, row);
          const lazerGasto = parseNumber(getCellValue(acompSheet, 5, row));
          if (lazerLocal && lazerGasto !== null &&
              !lazerLocal.toLowerCase().includes('lazer') &&
              !lazerLocal.toLowerCase().includes('total') &&
              !lazerLocal.toLowerCase().includes('saldo')) {
            lazer.push({ local: lazerLocal, gasto: lazerGasto });
          }
        }
        
        console.log('Combustivel:', combustivel.length, 'Supermercado:', supermercado.length, 'Lazer:', lazer.length);
      } else {
        console.log('ACOMPANHAMENTO sheet not found - will use empty arrays');
      }
      
      // Read eventualidades from DESPESAS sheet (columns H-I / 7-8)
      const eventualidades = [];
      for (let row = 2; row <= range.e.r; row++) {
        const eventDesc = getCellValue(despesasSheet, 7, row);
        const eventValor = parseNumber(getCellValue(despesasSheet, 8, row));
        
        // Skip header and empty rows
        if (eventDesc && eventValor !== null &&
            !eventDesc.toLowerCase().includes('eventualidades') &&
            !eventDesc.toLowerCase().includes('total') &&
            !eventDesc.toLowerCase().includes('observações')) {
          eventualidades.push({ descricao: eventDesc, valor: eventValor });
        }
      }
      
      console.log('Eventualidades found:', eventualidades.length);
      
      // Store imported data
      importedData = {
        despesas: despesasData,
        acompanhamento: {
          combustivel: combustivel,
          supermercado: supermercado,
          lazer: lazer
        },
        eventualidades: eventualidades
      };
      
      console.log('Import data prepared:', importedData);
      
      // Show preview
      const previewContent = document.getElementById('preview-content');
      const importPreview = document.getElementById('import-preview');
      const monthNameInput = document.getElementById('import-month-name');
      
      if (previewContent) {
        previewContent.innerHTML = `
          <div style="background-color: var(--color-bg-3); padding: var(--space-16); border-radius: var(--radius-base); margin-bottom: var(--space-16);">
            <p style="margin: var(--space-8) 0;">✓ <strong>${despesasData.length}</strong> despesas encontradas</p>
            <p style="margin: var(--space-8) 0;">✓ <strong>${combustivel.length}</strong> registros de combustível</p>
            <p style="margin: var(--space-8) 0;">✓ <strong>${supermercado.length}</strong> registros de supermercado</p>
            <p style="margin: var(--space-8) 0;">✓ <strong>${lazer.length}</strong> registros de lazer</p>
            <p style="margin: var(--space-8) 0;">✓ <strong>${eventualidades.length}</strong> eventualidades</p>
          </div>
        `;
      }
      
      // Try to extract month name from filename
      if (monthNameInput) {
        const fileName = file.name;
        // Try to extract month from filename (e.g., JULHO-DE-2025)
        const match = fileName.match(/(JANEIRO|FEVEREIRO|MARÇO|ABRIL|MAIO|JUNHO|JULHO|AGOSTO|SETEMBRO|OUTUBRO|NOVEMBRO|DEZEMBRO).*?(\d{4})/i);
        if (match) {
          const month = match[1].charAt(0) + match[1].slice(1).toLowerCase();
          const year = match[2];
          monthNameInput.value = `${month} ${year}`;
        }
      }
      
      if (importPreview) importPreview.style.display = 'block';
      
      showToast('Arquivo processado com sucesso!', 'success');
      
    } catch (error) {
      console.error('Erro ao processar Excel:', error);
      showToast('Erro ao processar o arquivo Excel: ' + error.message, 'error');
    }
  };
  
  reader.readAsArrayBuffer(file);
}

function getCellValue(sheet, col, row) {
  const cellAddress = XLSX.utils.encode_cell({ c: col, r: row });
  const cell = sheet[cellAddress];
  return cell ? cell.v : null;
}

function parseNumber(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  
  // Remove currency symbols, spaces, and convert comma to dot
  const str = String(value).replace(/[R$\s]/g, '').replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

// Generate month ID from month name (e.g., "Julho 2025" -> "2025-07")
function generateMonthId(monthName) {
  const monthMap = {
    'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
    'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
    'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
  };
  
  const parts = monthName.toLowerCase().trim().split(' ');
  if (parts.length < 2) return null;
  
  const month = parts[0];
  const year = parts[1];
  
  const monthNum = monthMap[month];
  if (!monthNum) return null;
  
  return `${year}-${monthNum}`;
}

function confirmImport() {
  console.log('confirmImport called');
  
  if (!importedData) {
    showToast('Nenhum dado para importar!', 'error');
    return;
  }
  
  const monthNameInput = document.getElementById('import-month-name');
  if (!monthNameInput) {
    console.error('Month name input not found');
    return;
  }
  
  const monthName = monthNameInput.value.trim();
  if (!monthName) {
    showToast('Por favor, informe o nome do mês!', 'error');
    return;
  }
  
  console.log('Month name:', monthName);
  
  // Generate month ID from name
  let monthKey = generateMonthId(monthName);
  if (!monthKey) {
    // If auto-generation fails, ask user
    monthKey = prompt('Não foi possível gerar o ID automaticamente. Informe a chave do mês (ex: 2025-10):');
    if (!monthKey) return;
  }
  
  console.log('Month key:', monthKey);
  
  // Check if month already exists
  if (allMonthsData[monthKey]) {
    if (!confirm('Este mês já existe. Deseja substituir os dados?')) {
      return;
    }
  }
  
  // Add new month with imported data
  allMonthsData[monthKey] = {
    mesNome: monthName,
    despesas: importedData.despesas || [],
    acompanhamento: {
      combustivel: importedData.acompanhamento?.combustivel || [],
      supermercado: importedData.acompanhamento?.supermercado || [],
      lazer: importedData.acompanhamento?.lazer || []
    },
    eventualidades: importedData.eventualidades || []
  };
  
  console.log('Data added to allMonthsData:', allMonthsData[monthKey]);
  
  // Set as current month
  currentMonth = monthKey;
  
  // Update UI
  setupMonthSelector();
  updateAll();
  closeImportModal();
  
  showToast(`Dados importados com sucesso para ${monthName}!`, 'success');
  console.log('Import completed successfully');
  
  // Check auto-backup preference
  if (autoBackupEnabled) {
    console.log('Auto-backup is enabled, downloading backup...');
    setTimeout(() => autoBackup(), 500);
  } else {
    console.log('Auto-backup is disabled, showing prompt...');
    setTimeout(() => showBackupPrompt(), 500);
  }
}

// Month Comparison
function openMonthComparison() {
  const modal = document.getElementById('comparison-modal');
  const select1 = document.getElementById('compare-month-1');
  const select2 = document.getElementById('compare-month-2');
  
  if (!modal || !select1 || !select2) return;
  
  select1.innerHTML = '';
  select2.innerHTML = '';
  
  Object.keys(allMonthsData).forEach(monthKey => {
    const option1 = document.createElement('option');
    option1.value = monthKey;
    option1.textContent = allMonthsData[monthKey].mesNome;
    select1.appendChild(option1);
    
    const option2 = document.createElement('option');
    option2.value = monthKey;
    option2.textContent = allMonthsData[monthKey].mesNome;
    select2.appendChild(option2);
  });
  
  modal.classList.add('active');
}

function closeComparisonModal() {
  const modal = document.getElementById('comparison-modal');
  const result = document.getElementById('comparison-result');
  
  if (modal) modal.classList.remove('active');
  if (result) result.innerHTML = '';
}

function generateComparison() {
  const select1 = document.getElementById('compare-month-1');
  const select2 = document.getElementById('compare-month-2');
  
  if (!select1 || !select2) return;
  
  const month1Key = select1.value;
  const month2Key = select2.value;
  
  if (month1Key === month2Key) {
    showToast('Selecione meses diferentes!', 'error');
    return;
  }
  
  const data1 = allMonthsData[month1Key];
  const data2 = allMonthsData[month2Key];
  
  const total1 = data1.despesas.reduce((sum, d) => sum + d.realidade, 0);
  const total2 = data2.despesas.reduce((sum, d) => sum + d.realidade, 0);
  const diff = total2 - total1;
  const percChange = total1 > 0 ? ((diff / total1) * 100).toFixed(2) : 0;
  
  const resultDiv = document.getElementById('comparison-result');
  resultDiv.innerHTML = `
    <div class="card">
      <div class="card__body">
        <h4>Comparação: ${data1.mesNome} vs ${data2.mesNome}</h4>
        <div class="summary-cards" style="margin-top: 20px;">
          <div class="card summary-card">
            <div class="card__body">
              <div class="summary-label">${data1.mesNome}</div>
              <div class="summary-value">${formatCurrency(total1)}</div>
            </div>
          </div>
          <div class="card summary-card">
            <div class="card__body">
              <div class="summary-label">${data2.mesNome}</div>
              <div class="summary-value">${formatCurrency(total2)}</div>
            </div>
          </div>
          <div class="card summary-card">
            <div class="card__body">
              <div class="summary-label">Diferença</div>
              <div class="summary-value ${diff < 0 ? 'positive' : 'negative'}">
                ${formatCurrency(diff)} (${percChange}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Reset data
function resetData() {
  if (confirm('Deseja realmente resetar o mês atual para valores vazios?')) {
    allMonthsData[currentMonth] = {
      mesNome: allMonthsData[currentMonth].mesNome,
      despesas: [],
      acompanhamento: {
        combustivel: [],
        supermercado: [],
        lazer: []
      },
      eventualidades: []
    };
    updateAll();
    showToast('Dados do mês resetados!', 'success');
  }
}

// Clear all data
function clearAllData() {
  if (confirm('Deseja realmente limpar TODOS os meses? Esta ação não pode ser desfeita!')) {
    Object.keys(allMonthsData).forEach(monthKey => {
      allMonthsData[monthKey] = {
        mesNome: allMonthsData[monthKey].mesNome,
        despesas: [],
        acompanhamento: {
          combustivel: [],
          supermercado: [],
          lazer: []
        },
        eventualidades: []
      };
    });
    updateAll();
    showToast('Todos os dados foram limpos!', 'success');
  }
}

// Update all views
function updateAll() {
  updateDashboard();
  updateTrackingTables();
  updateEventualidadesTable();
  updateReports();
}

// ========== BACKUP AND RESTORE FUNCTIONS ==========

// Download backup as JSON
function downloadBackup() {
  const backupData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    currentMonth: currentMonth,
    months: allMonthsData
  };
  
  const dataStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `orcamento-backup-${timestamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  lastBackupTime = new Date();
  updateDataStatus();
  showToast('Backup baixado com sucesso!', 'success');
  console.log('Backup downloaded:', timestamp);
}

// Handle restore file upload
function handleRestoreUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.name.endsWith('.json')) {
    showToast('Por favor, selecione um arquivo JSON válido!', 'error');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const backupData = JSON.parse(e.target.result);
      
      // Validate backup structure
      if (!backupData.months || !backupData.currentMonth) {
        showToast('Arquivo de backup inválido!', 'error');
        return;
      }
      
      // Confirm restoration
      const monthCount = Object.keys(backupData.months).length;
      if (!confirm(`Deseja restaurar ${monthCount} mês(es)? Isso substituirá todos os dados atuais.`)) {
        return;
      }
      
      // Restore data
      allMonthsData = backupData.months;
      currentMonth = backupData.currentMonth;
      
      // Update UI
      setupMonthSelector();
      updateAll();
      updateDataStatus();
      
      showToast('Dados restaurados com sucesso!', 'success');
      console.log('Data restored from backup:', backupData.exportDate);
      
      // Switch to dashboard
      const dashboardNav = document.querySelector('.nav-item[data-view="dashboard"]');
      if (dashboardNav) dashboardNav.click();
      
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      showToast('Erro ao restaurar backup: ' + error.message, 'error');
    }
  };
  
  reader.readAsText(file);
  
  // Reset file input
  event.target.value = '';
}

// Auto-backup after import
function autoBackup() {
  downloadBackup();
}

// Toggle auto-backup preference
function toggleAutoBackup() {
  const checkbox = document.getElementById('auto-backup-toggle');
  if (checkbox) {
    autoBackupEnabled = checkbox.checked;
    console.log('Auto-backup:', autoBackupEnabled ? 'enabled' : 'disabled');
  }
}

// Save auto-backup preference from modal checkbox
function saveAutoBackupPreference() {
  const checkbox = document.getElementById('always-auto-backup');
  if (checkbox) {
    autoBackupEnabled = checkbox.checked;
    
    // Update the toggle in data management page
    const toggle = document.getElementById('auto-backup-toggle');
    if (toggle) toggle.checked = autoBackupEnabled;
    
    console.log('Auto-backup preference saved:', autoBackupEnabled);
  }
}

// Show backup prompt modal
function showBackupPrompt() {
  const modal = document.getElementById('backup-prompt-modal');
  if (modal) modal.classList.add('active');
}

// Close backup prompt modal
function closeBackupPrompt() {
  const modal = document.getElementById('backup-prompt-modal');
  if (modal) modal.classList.remove('active');
}

// Do backup and close modal
function doBackupAndClose() {
  downloadBackup();
  closeBackupPrompt();
}

// Update data status in management page
function updateDataStatus() {
  const monthsCount = Object.keys(allMonthsData).length;
  let totalExpenses = 0;
  Object.values(allMonthsData).forEach(month => {
    totalExpenses += month.despesas.length;
  });
  
  const monthsEl = document.getElementById('status-months');
  const expensesEl = document.getElementById('status-expenses');
  const lastBackupEl = document.getElementById('status-last-backup');
  
  if (monthsEl) monthsEl.textContent = monthsCount;
  if (expensesEl) expensesEl.textContent = totalExpenses;
  if (lastBackupEl) {
    if (lastBackupTime) {
      const minutes = Math.floor((new Date() - lastBackupTime) / 60000);
      if (minutes < 1) {
        lastBackupEl.textContent = 'Agora mesmo';
      } else if (minutes < 60) {
        lastBackupEl.textContent = `Há ${minutes} minuto(s)`;
      } else {
        lastBackupEl.textContent = lastBackupTime.toLocaleString('pt-BR');
      }
    } else {
      lastBackupEl.textContent = 'Nunca';
    }
  }
  
  // Update auto-backup toggle
  const toggle = document.getElementById('auto-backup-toggle');
  if (toggle) toggle.checked = autoBackupEnabled;
}

// Export all data as CSV
function exportAllAsExcel() {
  let csv = 'Mês,Categoria,Descrição,Situação,Expectativa,Realidade,Diferença\n';
  
  Object.keys(allMonthsData).forEach(monthKey => {
    const monthData = allMonthsData[monthKey];
    monthData.despesas.forEach(d => {
      const diferenca = d.realidade - d.expectativa;
      csv += `${monthData.mesNome},${d.categoria},${d.descricao},${d.situacao},${d.expectativa.toFixed(2)},${d.realidade.toFixed(2)},${diferenca.toFixed(2)}\n`;
    });
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().split('T')[0];
  link.download = `orcamento-completo-${timestamp}.csv`;
  link.click();
  
  showToast('CSV exportado com sucesso!', 'success');
}

// Initialize app
function init() {
  console.log('Inicializando aplicação...');
  
  try {
    setupMonthSelector();
    console.log('Month selector configurado');
    
    setupNavigation();
    console.log('Navegação configurada');
    
    setupTabs();
    console.log('Tabs configuradas');
    
    setupSearch();
    console.log('Busca configurada');
    
    setupAddExpenseForm();
    console.log('Formulário de despesas configurado');
    
    setupModalForm();
    console.log('Formulário modal configurado');
    
    updateAll();
    console.log('Dados atualizados - Aplicação pronta!');
    
    // Update data status if on data management page
    updateDataStatus();
    
    showToast('Aplicação carregada com sucesso! Lembre-se de fazer backup regularmente.', 'success');
  } catch (error) {
    console.error('Erro na inicialização:', error);
    showToast('Erro ao carregar a aplicação: ' + error.message, 'error');
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}