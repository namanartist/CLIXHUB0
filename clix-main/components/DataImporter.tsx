import React, { useState } from 'react';
import { Upload, FileCode, Link, Database, Check, AlertCircle, X, Download } from 'lucide-react';
import { db } from '../db';

interface DataImporterProps {
  onClose: () => void;
  onImportComplete?: () => void;
}

export const DataImporter: React.FC<DataImporterProps> = ({ onClose, onImportComplete }) => {
  const [importType, setImportType] = useState<'users' | 'clubs' | 'events' | 'registrations'>('users');
  const [method, setMethod] = useState<'csv' | 'json' | 'url'>('csv');
  const [rawText, setRawText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const parseCsv = (csvText: string): any[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const obj: Record<string, any> = {};
      headers.forEach((h, idx) => {
        if (h) obj[h] = values[idx] || '';
      });
      return obj;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setRawText(event.target?.result as string || '');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    setStatus('loading');
    setMessage('');
    try {
      let items: any[] = [];
      if (method === 'url') {
        if (!urlInput) throw new Error('Please enter a valid dataset URL');
        const res = await fetch(urlInput);
        items = await res.json();
      } else if (method === 'json') {
        items = JSON.parse(rawText);
      } else {
        items = parseCsv(rawText);
      }

      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('No valid records found to import');
      }

      // Process batch save
      let importedCount = 0;
      for (const item of items) {
        if (importType === 'users') {
          await db.saveUser(item);
        } else if (importType === 'clubs') {
          await db.addClub(item);
        } else if (importType === 'events') {
          await db.saveEvent(item);
        } else if (importType === 'registrations') {
          await db.saveRegistration(item);
        }
        importedCount++;
      }

      setStatus('success');
      setMessage(`Successfully imported ${importedCount} ${importType} to Supabase database!`);
      if (onImportComplete) onImportComplete();
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Import failed. Please check format and try again.');
    }
  };

  const handleFullSeed = async () => {
    setStatus('loading');
    setMessage('');
    try {
      const res = await db.seedDatabase();
      setStatus('success');
      setMessage(res?.message || 'Successfully uploaded and seeded all collections into Supabase database!');
      if (onImportComplete) onImportComplete();
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Full seed failed. Please check backend database connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Universal Data Importer</h3>
              <p className="text-xs text-slate-400">Import CSV, JSON, or external web data directly to Supabase</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Target Collection */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Select Target Collection</label>
            <div className="grid grid-cols-4 gap-2">
              {(['users', 'clubs', 'events', 'registrations'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setImportType(t)}
                  className={`py-2.5 px-3 rounded-xl font-medium text-xs capitalize transition ${
                    importType === t
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Import Method */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Import Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setMethod('csv')}
                className={`py-2.5 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition ${
                  method === 'csv' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" /> CSV Upload
              </button>
              <button
                onClick={() => setMethod('json')}
                className={`py-2.5 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition ${
                  method === 'json' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-4 h-4" /> Raw JSON
              </button>
              <button
                onClick={() => setMethod('url')}
                className={`py-2.5 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition ${
                  method === 'url' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Link className="w-4 h-4" /> Web URL
              </button>
            </div>
          </div>

          {/* Input Area */}
          {method === 'csv' && (
            <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center transition bg-slate-950/40">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-200">Click to select CSV file or paste CSV text below</p>
              <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="mt-3 text-xs text-slate-400" />
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="id,name,email,globalRole&#10;usr_1,Rahul Verma,rahul@mitsgwl.ac.in,Student"
                className="w-full mt-4 h-28 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {method === 'json' && (
            <div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder='[{"name": "CodeCell", "category": "Technical"}]'
                className="w-full h-44 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {method === 'url' && (
            <div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://api.mycollege.edu/dataset/events.json"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Status Feedback */}
          {status === 'success' && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-medium">
              <Check className="w-4 h-4 flex-shrink-0" /> {message}
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {message}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold">
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={status === 'loading'}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 text-xs font-bold shadow-lg shadow-blue-500/20 transition disabled:opacity-50"
            >
              {status === 'loading' ? 'Importing Data...' : 'Import to Supabase'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
