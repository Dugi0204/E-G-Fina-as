"use client";
import React, { useState, useEffect } from 'react';
import { Wallet, PlusCircle, TrendingUp, TrendingDown, DollarSign, Trash2, Sun, Moon, FileText } from 'lucide-react';

export default function FinanceSystem() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState('Entrada');

  const totalIn = transactions
    .filter(t => t.type === 'Entrada')
    .reduce((acc, curr) => acc + Number(curr.value), 0);

  const totalOut = transactions
    .filter(t => t.type === 'Saída')
    .reduce((acc, curr) => acc + Number(curr.value), 0);

  const total = totalIn - totalOut;

  const handleAddTransaction = () => {
    if (!description || !value) return;
    const newTransaction = {
      id: Math.random(),
      description,
      value: Number(value),
      type,
      date: new Date().toLocaleDateString('pt-BR')
    };
    setTransactions([newTransaction, ...transactions]);
    setDescription('');
    setValue('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-4 font-sans antialiased">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center py-8 border-b border-gray-800 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Wallet size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter">E&G FINANÇAS</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Gestão de Mordomia</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-gray-900 border border-gray-800 hover:border-indigo-500 text-xs font-bold px-4 py-2 rounded-xl transition-all">
            <FileText size={14} /> SALVAR PDF
          </button>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900/50 p-6 rounded-3xl border border-emerald-500/20 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Entradas</p>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-bold">R$ {totalIn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-3xl border border-red-500/20 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Saídas</p>
              <TrendingDown size={16} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-bold">R$ {totalOut.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-500/20">
            <div className="flex justify-between items-center mb-4">
              <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest">Saldo Disponível</p>
              <DollarSign size={16} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
          </div>
        </div>

        {/* Form e Lista */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <section className="bg-gray-900/80 p-6 rounded-3xl border border-gray-800">
            <h3 className="text-gray-400 text-[10px] font-black uppercase mb-6 tracking-widest">Registrar Movimentação</h3>
            <div className="space-y-4">
              <input 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição (ex: Salário, Aluguel)" 
                className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-sm focus:border-indigo-500 outline-none transition-all"
              />
              <input 
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0,00" 
                className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-xl font-bold text-indigo-400 focus:border-indigo-500 outline-none transition-all"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => setType('Entrada')}
                  className={`flex-1 p-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${type === 'Entrada' ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-400'}`}
                >
                  Entrada
                </button>
                <button 
                  onClick={() => setType('Saída')}
                  className={`flex-1 p-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${type === 'Saída' ? 'bg-red-500 text-black' : 'bg-gray-800 text-gray-400'}`}
                >
                  Saída
                </button>
              </div>
              <button 
                onClick={handleAddTransaction}
                className="w-full bg-indigo-600 hover:bg-indigo-500 p-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-indigo-500/20 transition-all"
              >
                Salvar Registro
              </button>
            </div>
          </section>

          {/* Extrato */}
          <section>
            <h3 className="text-gray-400 text-[10px] font-black uppercase mb-6 tracking-widest">Extrato Recente</h3>
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-gray-600 text-center py-10 text-sm italic">Nenhum registro encontrado.</p>
              ) : (
                transactions.map((t) => (
                  <div key={t.id} className="bg-gray-900/30 border border-gray-800/50 p-4 rounded-2xl flex justify-between items-center group hover:border-gray-700 transition-all">
                    <div>
                      <p className="font-bold text-sm">{t.description}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{t.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-bold ${t.type === 'Entrada' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {t.type === 'Entrada' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <button onClick={() => deleteTransaction(t.id)} className="text-gray-700 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
