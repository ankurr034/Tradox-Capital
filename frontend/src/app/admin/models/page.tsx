"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, Shield, Loader2, Save } from 'lucide-react';

export default function AdminModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [riskLevel, setRiskLevel] = useState('MEDIUM');
  const [allocations, setAllocations] = useState<{symbol: string, targetPercentage: string}[]>([{symbol: '', targetPercentage: ''}]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/admin/models');
      if (res.ok) {
        setModels(await res.json());
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  const handleAddAllocation = () => {
    setAllocations([...allocations, { symbol: '', targetPercentage: '' }]);
  };

  const handleAllocationChange = (index: number, field: string, value: string) => {
    const newAlloc = [...allocations];
    newAlloc[index] = { ...newAlloc[index], [field]: value };
    setAllocations(newAlloc);
  };

  const handleRemoveAllocation = (index: number) => {
    const newAlloc = [...allocations];
    newAlloc.splice(index, 1);
    setAllocations(newAlloc);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const total = allocations.reduce((acc, curr) => acc + parseFloat(curr.targetPercentage || '0'), 0);
    if (Math.abs(total - 100) > 0.1) {
      alert("Allocations must sum to 100%");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, riskLevel, allocations })
      });
      if (res.ok) {
        setName('');
        setDescription('');
        setRiskLevel('MEDIUM');
        setAllocations([{symbol: '', targetPercentage: ''}]);
        fetchModels();
      }
    } catch (e) {} finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Model Portfolios</h1>
          <p className="text-theme-muted font-semibold mt-1">Define standard investment strategies for clients.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Model Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-black mb-6">New Strategy</h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">Strategy Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">Risk Level</label>
                <select 
                  value={riskLevel}
                  onChange={(e) => setRiskLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 font-bold"
                >
                  <option value="LOW">Conservative (Low Risk)</option>
                  <option value="MEDIUM">Balanced (Medium Risk)</option>
                  <option value="HIGH">Aggressive (High Risk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted mb-1.5">Description</label>
                <textarea 
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 font-semibold text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted">Allocations (%)</label>
                  <div className={`text-xs font-bold ${allocations.reduce((acc, curr) => acc + parseFloat(curr.targetPercentage || '0'), 0) === 100 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    Total: {allocations.reduce((acc, curr) => acc + parseFloat(curr.targetPercentage || '0'), 0)}%
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  {allocations.map((alloc, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Symbol"
                        required
                        value={alloc.symbol}
                        onChange={(e) => handleAllocationChange(idx, 'symbol', e.target.value.toUpperCase())}
                        className="w-1/2 px-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none text-sm font-bold"
                      />
                      <input 
                        type="number" 
                        placeholder="%"
                        required
                        min="0"
                        max="100"
                        step="0.1"
                        value={alloc.targetPercentage}
                        onChange={(e) => handleAllocationChange(idx, 'targetPercentage', e.target.value)}
                        className="w-1/3 px-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 outline-none text-sm font-bold"
                      />
                      <button type="button" onClick={() => handleRemoveAllocation(idx)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button type="button" onClick={handleAddAllocation} className="w-full py-1.5 rounded-lg border border-dashed border-blue-500 text-blue-500 font-bold text-xs hover:bg-blue-500/5">
                  + Add Asset
                </button>
              </div>

              <button 
                type="submit"
                disabled={saving}
                className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Create Strategy
              </button>
            </form>
          </div>
        </div>

        {/* Existing Models */}
        <div className="lg:col-span-2 space-y-6">
          {models.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-theme-muted font-bold shadow-sm">
              No model portfolios created yet.
            </div>
          ) : (
            models.map(model => (
              <div key={model.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-black">{model.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-black ${
                      model.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                      model.riskLevel === 'MEDIUM' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                    }`}>
                      {model.riskLevel}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-theme-muted mb-4">{model.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {model.allocations.map((alloc: any) => (
                      <div key={alloc.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        <span className="font-bold text-xs">{alloc.symbol}</span>
                        <span className="text-[10px] font-black text-theme-muted">{alloc.targetPercentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
