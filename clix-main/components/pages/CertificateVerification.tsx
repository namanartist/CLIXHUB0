import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../../db';
import { CertificateBatch, IssuedCertificate } from '../../types';
import { PublicLightShell } from '../ui/PublicLightShell';
import { printHtmlDocument } from '../../lib/printDocument';
import {
  ShieldCheck,
  AlertTriangle,
  Search,
  Award,
  History,
  CheckCircle2,
  Printer,
} from 'lucide-react';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const buildVerificationPrintHtml = (cert: IssuedCertificate, batch: CertificateBatch): string => {
  const chain = batch.approvalChain
    .map(
      step =>
        `<li style="margin-bottom:8px;"><strong>${escapeHtml(step.approverName)}</strong> — ${escapeHtml(step.role)} (${step.approvedAt ? new Date(step.approvedAt).toLocaleString() : 'N/A'})</li>`
    )
    .join('');

  const verificationUrl = `${window.location.origin}/verify-cert?id=${encodeURIComponent(cert.serialNumber)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(verificationUrl)}`;

  return `
    <div style="position:relative;font-family:Georgia,serif;max-width:640px;margin:0 auto;color:#1a2233;">
      <div style="position:absolute;top:18px;right:18px;width:90px;height:90px;opacity:0.08;pointer-events:none;">
        <img src="/image.png" alt="Watermark" style="width:100%;height:100%;object-fit:contain;" />
      </div>
      <div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-bottom:10px;">
        <img src="/mitslogo.jpg" alt="MITS Logo" style="width:56px;height:auto;object-fit:contain;" />
        <div style="text-align:left;">
          <div class="hindi-name" style="margin:0;font-size:10px;font-weight:800;color:#1a2233;letter-spacing:0.04em;">माधव प्रौद्योगिकी एवं विज्ञान संस्थान, ग्वालियर</div>
          <div class="english-name" style="margin:4px 0 0;font-size:10px;font-weight:700;color:#1a2233;letter-spacing:0.04em;">Madhav Institute of Technology & Science, Gwalior</div>
          <div class="document-subtitle" style="margin-top:4px;color:#64748b;">(Deemed to be University u/s 3 of UGC Act, 1956 | NAAC A++ Grade)</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
          <div style="position:relative;display:inline-block;width:72px;height:72px;background:#ffffff;padding:4px;border-radius:12px;border:1px solid #e2e8f0;">
            <img src="${qrUrl}" alt="Verification QR" style="width:100%;height:100%;object-fit:contain;border-radius:8px;" />
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:18px;height:18px;background:#ffffff;border-radius:4px;padding:2px;box-shadow:0 1px 4px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;">
              <img src="/logo.png" alt="CLIX" style="width:100%;height:100%;object-fit:contain;" />
            </div>
          </div>
          <span style="font-size:8px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#64748b;">Scan to verify</span>
        </div>
      </div>
      <p style="text-align:center;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#64748b;">Clix Hub — Verification Record</p>
      <h1 style="text-align:center;font-size:22px;margin:16px 0;">Certificate Verified</h1>
      <p style="text-align:center;font-size:14px;color:#16a34a;font-weight:bold;">✓ Authentic institutional record</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #cbd5e1;" />
      <p style="font-size:12px;color:#64748b;margin:0 0 4px;">Recipient</p>
      <p style="font-size:20px;font-weight:bold;margin:0 0 16px;">${escapeHtml(cert.studentName)}</p>
      <p style="font-size:12px;color:#64748b;margin:0 0 4px;">Event / Program</p>
      <p style="font-size:16px;margin:0 0 16px;">${escapeHtml(cert.eventName)}</p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
        <tr><td style="padding:8px 0;color:#64748b;">Serial</td><td style="font-weight:600;">${escapeHtml(cert.serialNumber)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Enrollment</td><td style="font-weight:600;">${escapeHtml(cert.enrollmentNumber || '—')}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Club</td><td style="font-weight:600;">${escapeHtml(cert.clubName)}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Issue date</td><td style="font-weight:600;">${escapeHtml(new Date(cert.date).toLocaleDateString())}</td></tr>
      </table>
      <p style="font-size:12px;font-weight:bold;margin-bottom:8px;">Approval chain</p>
      <ul style="font-size:12px;padding-left:20px;margin:0 0 20px;">${chain}</ul>
      <p style="font-size:10px;font-family:monospace;word-break:break-all;color:#64748b;">Hash: ${escapeHtml(cert.hash || '—')}</p>
      <p style="font-size:10px;text-align:center;margin-top:24px;color:#94a3b8;">Generated ${new Date().toLocaleString()} · ${escapeHtml(window.location.origin)}/verify-cert</p>
    </div>
  `;
};

const CertificateVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('id');
  const [serialNumber, setSerialNumber] = useState(queryId || '');
  const [result, setResult] = useState<{ cert: IssuedCertificate; batch: CertificateBatch } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const serial = serialNumber.trim();
      if (!serial) return;

      setIsSearching(true);
      setError(null);
      setResult(null);

      try {
        await new Promise(r => setTimeout(r, 400));
        const batches = await db.getBatches();
        let foundCert: IssuedCertificate | null = null;
        let foundBatch: CertificateBatch | null = null;

        for (const b of batches) {
          const c = b.certificates.find(cert => cert.serialNumber === serial);
          if (c) {
            foundCert = c;
            foundBatch = b;
            break;
          }
        }

        if (foundCert && foundBatch) {
          setResult({ cert: foundCert, batch: foundBatch });
          await db.addLog({
            id: `verify-log-${Date.now()}`,
            timestamp: new Date().toISOString(),
            user: 'Public Visitor',
            action: `Verified Certificate: ${serial}`,
            clubId: foundCert.clubId,
          });
        } else {
          setError('No certificate found with this serial number. Check the code and try again.');
        }
      } catch {
        setError('Unable to reach the verification service. Please try again.');
      } finally {
        setIsSearching(false);
      }
    },
    [serialNumber]
  );

  useEffect(() => {
    if (queryId) {
      setSerialNumber(queryId);
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once when URL id present
  }, [queryId]);

  const handlePrintRecord = () => {
    if (!result) return;
    printHtmlDocument(
      buildVerificationPrintHtml(result.cert, result.batch),
      `Verification - ${result.cert.serialNumber}`,
      { delayMs: 600 }
    );
  };

  return (
    <PublicLightShell>
      <div className="max-w-3xl mx-auto py-6 md:py-10 space-y-8 md:space-y-10">
        <div className="text-center space-y-4 px-2">
          <span className="uni-badge uni-badge-gold inline-flex items-center gap-2">
            <ShieldCheck size={14} /> Credential verification
          </span>
          <h1 className="uni-text-display font-black">
            Verify <span className="text-primary">credentials</span>
          </h1>
          <p className="uni-text-subtitle max-w-lg mx-auto">
            Enter a certificate serial number to confirm it was issued by Clix Hub.
          </p>
        </div>

        <form onSubmit={handleSearch} className="uni-pill-card !p-3 sm:!p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 h-12 sm:h-14 rounded-full border border-[var(--border-color)] bg-white">
              <Search size={20} className="text-[var(--text-secondary)] shrink-0" />
              <input
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value.toUpperCase())}
                placeholder="e.g. MITS-CSIT-2026-00001"
                className="flex-1 min-w-0 bg-transparent outline-none text-sm sm:text-base font-semibold text-[var(--text-main)] placeholder:text-[var(--text-secondary)]"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !serialNumber.trim()}
              className="h-12 sm:h-14 px-8 uni-pill uni-btn-primary text-white font-bold text-sm disabled:opacity-50 shrink-0"
            >
              {isSearching ? 'Checking…' : 'Verify'}
            </button>
          </div>
        </form>

        {isSearching && (
          <div className="uni-pill-card py-16 text-center">
            <ShieldCheck size={48} className="mx-auto text-primary animate-pulse mb-4" />
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Searching records…</p>
          </div>
        )}

        {error && !isSearching && (
          <div className="uni-pill-card border-rose-200 bg-rose-50/80 py-10 text-center space-y-3">
            <AlertTriangle size={40} className="mx-auto text-rose-500" />
            <h2 className="text-lg font-bold text-rose-800">Not found</h2>
            <p className="text-sm text-rose-700 max-w-md mx-auto">{error}</p>
          </div>
        )}

        {result && !isSearching && (
          <div className="uni-pill-card space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Award size={28} />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 uni-pill px-3 py-1 mb-2">
                    <CheckCircle2 size={14} /> Verified
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] leading-tight">
                    {result.cert.studentName}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{result.cert.eventName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrintRecord}
                className="h-11 px-5 uni-pill uni-btn-primary text-white text-sm font-semibold flex items-center justify-center gap-2 shrink-0"
              >
                <Printer size={18} /> Print record
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Serial number', value: result.cert.serialNumber },
                { label: 'Enrollment', value: result.cert.enrollmentNumber || '—' },
                { label: 'Club', value: result.cert.clubName },
                { label: 'Issue date', value: new Date(result.cert.date).toLocaleDateString() },
              ].map(item => (
                <div key={item.label} className="rounded-2xl border border-[var(--border-color)] bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)] mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-[var(--text-main)] break-all">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[var(--border-color)] bg-white p-4 sm:p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)] flex items-center gap-2">
                <History size={14} /> Approval chain
              </p>
              <ul className="space-y-3">
                {result.batch.approvalChain.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[var(--text-main)]">{step.approverName}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {step.role}
                        {step.approvedAt ? ` · ${new Date(step.approvedAt).toLocaleString()}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[10px] font-mono text-[var(--text-secondary)] break-all bg-[var(--primary-soft)] uni-pill px-3 py-2">
              {result.cert.hash}
            </p>

            <Link
              to={`/verify-cert?id=${encodeURIComponent(result.cert.serialNumber)}`}
              className="text-sm text-primary font-semibold hover:underline"
            >
              Share this verification link
            </Link>
          </div>
        )}
      </div>
    </PublicLightShell>
  );
};

export default CertificateVerification;
