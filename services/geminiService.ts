import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFinancialInsights = async (transactions: Transaction[]): Promise<string> => {
  try {
    // Summarize data to send to AI to save tokens and improve focus
    const summary = transactions.reduce((acc, curr) => {
      const type = curr.type;
      if (!acc[type]) acc[type] = 0;
      acc[type] += curr.amount;
      
      if (!acc.categories[curr.category]) acc.categories[curr.category] = 0;
      acc.categories[curr.category] += curr.amount;
      
      return acc;
    }, { income: 0, expense: 0, categories: {} as Record<string, number> });

    // Include recent transactions (last 10) for context
    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .map(t => `${t.date}: ${t.title} (${t.type}) - Kz ${t.amount}`);

    const prompt = `
      Atue como um consultor financeiro especialista. Analise os seguintes dados financeiros de um usuário pessoal em Angola:
      
      Resumo:
      - Total Receitas: Kz ${summary.income.toFixed(2)}
      - Total Despesas: Kz ${summary.expense.toFixed(2)}
      - Saldo: Kz ${(summary.income - summary.expense).toFixed(2)}
      
      Gastos por Categoria:
      ${JSON.stringify(summary.categories, null, 2)}
      
      Últimas Transações:
      ${recentTransactions.join('\n')}

      Por favor, forneça:
      1. Uma breve análise da saúde financeira atual.
      2. Três dicas práticas e acionáveis para economizar ou investir melhor, baseadas especificamente nestes gastos.
      3. Identifique se há algum padrão de gasto preocupante.

      Mantenha o tom profissional, encorajador e direto. Use formatação Markdown (negrito, listas). Considere o contexto econômico se relevante, mas foque nos hábitos.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple analysis
      }
    });

    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    throw new Error("Falha ao analisar dados financeiros.");
  }
};