import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Loader2, AlertCircle, FileText } from 'lucide-react';
import { InsightState } from '../types';

interface AIAdvisorProps {
  insightState: InsightState;
  onGenerate: () => void;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ insightState, onGenerate }) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="text-emerald-400" size={24} />
            <h2 className="text-xl font-bold">Relatório Analítico</h2>
          </div>
          {!insightState.loading && !insightState.content && (
            <button 
              onClick={onGenerate}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-all backdrop-blur-sm"
            >
              Gerar Relatório
            </button>
          )}
        </div>

        {insightState.loading && (
          <div className="py-12 flex flex-col items-center justify-center text-slate-300">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>Processando dados financeiros...</p>
          </div>
        )}

        {insightState.error && (
          <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-lg flex gap-3 text-red-200 items-start">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p className="text-sm">{insightState.error}</p>
          </div>
        )}

        {insightState.content && !insightState.loading && (
          <div className="bg-white/5 rounded-xl p-5 backdrop-blur-md border border-white/10 max-h-[400px] overflow-y-auto custom-scrollbar">
            <div className="prose prose-invert prose-sm max-w-none">
              {/* Render Markdown content safely */}
              <div className="whitespace-pre-wrap font-light leading-relaxed">
                  {insightState.content.split('\n').map((line, i) => {
                      if (line.startsWith('#')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-emerald-200">{line.replace(/#/g, '')}</h3>;
                      if (line.startsWith('*') && line.includes(':')) {
                         const parts = line.split(':');
                         return <li key={i} className="ml-4 mb-1"><span className="font-semibold text-slate-200">{parts[0].replace(/\*/g, '')}:</span>{parts[1]}</li>;
                      }
                      if (line.startsWith('-') || line.startsWith('*')) return <li key={i} className="ml-4">{line.replace(/[-*]/, '')}</li>;
                      if (line.match(/^\d\./)) return <div key={i} className="font-medium mt-2 text-emerald-100">{line}</div>;
                      return <p key={i} className="mb-2">{line.replace(/\*\*/g, '')}</p>;
                  })}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
               <button 
                onClick={onGenerate}
                className="text-xs text-emerald-300 hover:text-white transition-colors flex items-center gap-1"
              >
                <Sparkles size={12} /> Atualizar dados
              </button>
            </div>
          </div>
        )}

        {!insightState.content && !insightState.loading && !insightState.error && (
          <p className="text-slate-300 text-sm opacity-80 leading-relaxed">
            Clique em "Gerar Relatório" para processar seus dados locais e receber um resumo da sua saúde financeira, análise de categorias e dicas personalizadas.
          </p>
        )}
      </div>
    </div>
  );
};