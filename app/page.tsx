"use client"
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Trash2, Save, CreditCard, RefreshCw, Sun, Moon, CheckCircle2, History } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function EGFinancasV33() {
  const [transacoes, setTransacoes] = useState([]);
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [cat, setCat] = useState('💰 Salário');
  const [quem, setQuem] = useState('Eduardo');
  const [tipo, setTipo] = useState('Gasto');
  const [metodo, setMetodo] = useState('Pix');
  const [tema, setTema] = useState('dark');
  const [montado, setMontado] = useState(false);

  const CORES_CATEGORIAS = {
    "💰 Salário": "#10b981", "✨ Vistoria": "#34d399", "🧹 Limpeza": "#10b981",
    "🍴 Alimentação": "#f87171", "🏠 Casa": "#fb923c", "🌐 Internet": "#60a5fa",
    "🕊️ Dizímos": "#a78bfa", "⚡ Energia": "#fbbf24", "🎓 Faculdade": "#818cf8",
    "💵 Financiamento": "#f472b6", "🔥 Gás": "#fb923c", "🎡 Lazer": "#fb7185",
    "🛒 Mercado": "#facc15", "🚧 Obra": "#71717a", "🏥 Saúde": "#ef4444", "🚕 Transporte": "#38bdf8"
  };

  const METODOS = {
    "Pix": { cor: "text-cyan-500", bg: "bg-cyan-500/10" },
    "Crédito": { cor: "text-indigo-500", bg: "bg-indigo-500/10" },
    "Débito": { cor: "text-blue-500", bg: "bg-blue-500/10" },
    "Dinheiro": { cor: "text-emerald-500", bg: "bg-emerald-500/10" }
  };

  useEffect(() => {
    setMontado(true);
    const salvo = localStorage.getItem('eg-v33-db');
    if (salvo) setTransacoes(JSON.parse(salvo));
    const temaSalvo = localStorage.getItem('eg-tema');
    if (temaSalvo) setTema(temaSalvo);
  }, []);

  useEffect(() => {
    if (montado) {
      localStorage.setItem('eg-v33-db', JSON.stringify(transacoes));
      localStorage.setItem('eg-tema', tema);
    }
  }, [transacoes, tema, montado]);

  if (!montado) return null;

  const adicionar = () => {
    if (!desc || !valor) return;
    const n = { 
      id: Date.now(), desc, valor: parseFloat(valor), cat, quem, tipo, metodo,
      data: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    };
    setTransacoes([n, ...transacoes]);
    setDesc(''); setValor('');
  };

  const resetarBanco = () => {
    if (window.confirm("⚠️ ATENÇÃO: Isso apagará TODOS os registros permanentemente. Deseja zerar o mês?")) {
      setTransacoes([]);
      localStorage.removeItem('eg-v33-db');
    }
  };

  const ent = transacoes.filter(t => t.tipo === 'Entrada').reduce((a, t) => a + t.valor, 0);
  const gas = transacoes.filter(t => t.tipo === 'Gasto').reduce((a, t) => a + t.valor, 0);

  const formatGrafico = (tipoF) => {
    const dados = transacoes.filter(t => t.tipo === tipoF);
    return [...new Set(dados.map(t => t.cat))].map(c => ({
      name: c, value: dados.filter(t => t.cat === c).reduce((a, t) => a + t.valor, 0)
    }));
  };

  const formatarMoeda = (v) => {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const tClass = tema === 'dark' ? { bg: 'bg-[#050507]', card: 'bg-[#111115]', text: 'text-white', border: 'border-white/5', input: 'bg-black text-white' } 
                                 : { bg: 'bg-zinc-50', card: 'bg-white', text: 'text-zinc-900', border: 'border-zinc-200', input: 'bg-zinc-100 text-black' };

  return (
    <div className={`min-h-screen ${tClass.bg} ${tClass.text} p-4 font-sans transition-all duration-300`}>
      {/* ESTILO PARA PDF - CORREÇÃO DO "TORTO" */}
      <style>{`
        @media print {
          @page { margin: 15mm; size: auto; }
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-card { 
            background: white !important; 
            color: black !important; 
            border: 1px solid #eee !important; 
            box-shadow: none !important;
            break-inside: avoid;
            margin-bottom: 20px !important;
          }
          .lg\\:col-span-8 { width: 100% !important; }
          .grid { display: block !important; }
          .flex { display: flex !important; }
          h1, p, span { color: black !important; }
          .recharts-responsive-container { height: 300px !important; width: 100% !important; }
        }
      `}</style>

      <header className={`max-w-7xl mx-auto flex justify-between items-center mb-8 ${tClass.card} p-6 rounded-[2rem] border ${tClass.border} shadow-2xl print-card`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><LayoutDashboard size={24}/></div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter italic uppercase leading-none">E&G Finanças</h1>
            <p className="text-[9px] font-bold opacity-40 uppercase tracking-[0.3em] mt-1">Gestão de Mordomia</p>
          </div>
        </div>
        <div className="flex items-center gap-4 no-print">
          <button onClick={() => setTema(tema === 'dark' ? 'light' : 'dark')} className={`p-4 rounded-2xl border ${tClass.border} hover:scale-105 transition-all`}>
            {tema === 'dark' ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-indigo-600"/>}
          </button>
          <button onClick={() => window.print()} className="bg-indigo-600 px-8 py-4 rounded-2xl text-[11px] font-black flex items-center gap-2 text-white shadow-xl hover:bg-indigo-500 transition-all">
            <Save size={18}/> SALVAR PDF
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RESUMO SUPERIOR */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${tClass.card} border-l-8 border-[#10b981] p-8 rounded-[2.5rem] shadow-xl print-card`}>
            <span className="text-[11px] font-black text-[#10b981] uppercase tracking-widest">Entradas</span>
            <p className="text-4xl font-black mt-2">{formatarMoeda(ent)}</p>
          </div>
          <div className={`${tClass.card} border-l-8 border-[#ef4444] p-8 rounded-[2.5rem] shadow-xl print-card`}>
            <span className="text-[11px] font-black text-[#ef4444] uppercase tracking-widest">Saídas</span>
            <p className="text-4xl font-black mt-2 text-[#ef4444]">{formatarMoeda(gas)}</p>
          </div>
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl text-white print-card">
            <span className="text-[11px] font-black text-white/60 uppercase tracking-widest print:text-black">Saldo Disponível</span>
            <p className="text-4xl font-black mt-2">{formatarMoeda(ent - gas)}</p>
          </div>
        </div>

        {/* COLUNA DE CADASTRO (SOME NO PDF) */}
        <div className="lg:col-span-4 no-print space-y-6">
          <div className={`${tClass.card} p-8 rounded-[2.5rem] border ${tClass.border} shadow-2xl`}>
            <h3 className="text-xs font-black opacity-30 uppercase mb-8">Registrar Movimentação</h3>
            <div className="space-y-5">
              <input className={`w-full ${tClass.input} p-5 rounded-2xl text-sm border-none focus:ring-2 focus:ring-indigo-500 outline-none`} placeholder="O que foi?" value={desc} onChange={e => setDesc(e.target.value)} />
              <input className={`w-full ${tClass.input} p-5 rounded-2xl text-4xl font-black border-none focus:ring-2 focus:ring-indigo-500 outline-none`} type="number" placeholder="0,00" value={valor} onChange={e => setValor(e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <select className={`${tClass.input} p-4 rounded-xl text-xs font-bold border-none`} value={quem} onChange={e => setQuem(e.target.value)}><option value="Eduardo">Eduardo</option><option value="Giovanna">Giovanna</option></select>
                <select className={`${tClass.input} p-4 rounded-xl text-xs font-bold border-none`} value={tipo} onChange={e => setTipo(e.target.value)}><option value="Gasto">Saída</option><option value="Entrada">Entrada</option></select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select className={`${tClass.input} p-4 rounded-xl text-xs font-bold border-none`} value={metodo} onChange={e => setMetodo(e.target.value)}><option value="Pix">Pix</option><option value="Crédito">Crédito</option><option value="Débito">Débito</option><option value="Dinheiro">Dinheiro</option></select>
                <select className={`${tClass.input} p-4 rounded-xl text-xs font-bold border-none`} value={cat} onChange={e => setCat(e.target.value)}>{Object.keys(CORES_CATEGORIAS).map(c => <option key={c} value={c}>{c}</option>)}</select>
              </div>
              <button onClick={adicionar} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3"><CheckCircle2 size={20}/> SALVAR REGISTRO</button>
              
              <button onClick={resetarBanco} className="w-full mt-4 py-3 border border-red-500/20 hover:border-red-500/50 text-red-500/40 hover:text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <RefreshCw size={14}/> Iniciar Novo Mês (Zerar)
              </button>
            </div>
          </div>
        </div>

        {/* COLUNA DE GRÁFICOS E EXTRATO */}
        <div className="lg:col-span-8 space-y-8 print:w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block">
            <div className={`${tClass.card} p-8 rounded-[2.5rem] border ${tClass.border} h-[450px] flex flex-col items-center shadow-xl print-card`}>
              <span className="text-[11px] font-black text-[#ef4444] uppercase mb-8">Divisão de Saídas</span>
              {formatGrafico('Gasto').length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={formatGrafico('Gasto')} cx="50%" cy="45%" innerRadius={60} outerRadius={85} dataKey="value" paddingAngle={5}>
                      {formatGrafico('Gasto').map((entry) => <Cell key={entry.name} fill={CORES_CATEGORIAS[entry.name]} stroke="none" />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="m-auto opacity-20 text-[10px] font-black uppercase">Sem dados</div>}
            </div>

            <div className={`${tClass.card} p-8 rounded-[2.5rem] border ${tClass.border} h-[450px] flex flex-col items-center shadow-xl print-card`}>
              <span className="text-[11px] font-black text-[#10b981] uppercase mb-8">Origem de Entradas</span>
              {formatGrafico('Entrada').length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={formatGrafico('Entrada')} cx="50%" cy="45%" innerRadius={60} outerRadius={85} dataKey="value" paddingAngle={5}>
                      {formatGrafico('Entrada').map((entry) => <Cell key={entry.name} fill={CORES_CATEGORIAS[entry.name]} stroke="none" />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="m-auto opacity-20 text-[10px] font-black uppercase">Sem dados</div>}
            </div>
          </div>
          
          <div className={`${tClass.card} rounded-[2.5rem] border ${tClass.border} shadow-2xl mb-20 overflow-hidden print-card`}>
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <span className="text-[11px] font-black opacity-30 uppercase tracking-widest">Extrato Detalhado</span>
              <History size={18} className="opacity-30 no-print"/>
            </div>
            <div className="p-6 space-y-4">
              {transacoes.map(t => (
                <div key={t.id} className={`${tema==='dark'?'bg-black/40':'bg-zinc-50'} p-6 rounded-3xl border ${tClass.border} flex flex-col md:flex-row justify-between items-center gap-4 print:border-zinc-100 print:mb-2`}>
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl print:bg-zinc-100" style={{backgroundColor: `${CORES_CATEGORIAS[t.cat]}20`, color: CORES_CATEGORIAS[t.cat]}}>{t.cat.substring(0,2)}</div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-tight">{t.desc}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[9px] font-black uppercase px-3 py-1 bg-white/5 rounded-lg opacity-60 print:text-zinc-500">{t.quem}</span>
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg flex items-center gap-1 ${METODOS[t.metodo].bg} ${METODOS[t.metodo].cor} print:text-zinc-500`}><CreditCard size={10}/> {t.metodo}</span>
                        <span className="text-[9px] font-bold opacity-30 mt-1 ml-1">{t.data}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 w-full md:w-auto justify-between">
                    <span className={`text-xl font-black ${t.tipo === 'Entrada' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                      {t.tipo==='Entrada'?'+':'-'} {formatarMoeda(t.valor)}
                    </span>
                    <button onClick={() => setTransacoes(transacoes.filter(x => x.id !== t.id))} className="text-red-500/10 hover:text-red-500 transition-all p-2 no-print"><Trash2 size={20}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}