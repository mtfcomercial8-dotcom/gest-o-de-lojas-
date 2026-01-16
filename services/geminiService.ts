import { Transaction } from '../types';

// Função local que simula uma análise financeira baseada em regras matemáticas simples
export const generateFinancialInsights = async (transactions: Transaction[]): Promise<string> => {
  // Simula um pequeno tempo de processamento para UX
  await new Promise(resolve => setTimeout(resolve, 800));

  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;

  // Encontrar a categoria com maior gasto
  const expensesByCategory: Record<string, number> = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
  });

  const sortedCategories = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : 'Nenhuma';
  const topCategoryAmount = sortedCategories.length > 0 ? sortedCategories[0][1] : 0;

  // Lógica de Geração de Texto
  let healthStatus = "";
  let healthColor = "";
  let advice = "";

  if (savingsRate >= 20) {
    healthStatus = "Saudável";
    advice = "Excelente trabalho! Você está poupando mais de 20% da sua renda. Considere investir esse excedente em fundos de renda fixa ou ações para multiplicar seu patrimônio.";
  } else if (savingsRate > 0) {
    healthStatus = "Equilibrada";
    advice = "Você está no azul, mas sua margem de manobra é pequena. Tente rever gastos supérfluos para aumentar sua reserva de segurança.";
  } else {
    healthStatus = "Crítica";
    advice = "Atenção! Suas despesas superaram suas receitas. É urgente cortar gastos não essenciais e evitar novas dívidas.";
  }

  // Formatar valores para Kz
  const formatKz = (val: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val);

  return `### Relatório Financeiro Inteligente

**Status Atual: ${healthStatus}**

${advice}

**Resumo de Métricas:**
* **Receita Total:** ${formatKz(income)}
* **Despesa Total:** ${formatKz(expense)}
* **Taxa de Poupança:** ${savingsRate.toFixed(1)}%

**Análise de Gastos:**
Sua maior categoria de despesa é **${topCategory}**, consumindo um total de **${formatKz(topCategoryAmount)}**.

**Recomendações Automáticas:**
1. Defina um teto máximo para gastos com **${topCategory}** no próximo mês.
2. Se não possuir reserva de emergência, priorize guardar pelo menos 5% da renda.
3. Revise suas assinaturas e gastos recorrentes para encontrar desperdícios.
`;
};