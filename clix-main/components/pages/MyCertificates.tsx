import React, { useMemo, useState } from 'react';
import { User, CertificateBatch, IssuedCertificate, Role } from '../../types';
import { Award, ChevronRight, Printer, ShieldCheck, X, ExternalLink, Check, Search, Filter, Sparkles, History, Layers } from 'lucide-react';
import CertificatePreview from '../CertificatePreview';
import { printElementById } from '../../lib/printDocument';
import { PageShell } from '../ui/PageShell';
import { saveToGoogleWallet } from '../../lib/googleWallet';

const CertificateCard: React.FC<{
  cert: IssuedCertificate;
  batch: CertificateBatch;
  onPreview: (cert: IssuedCertificate, batch: CertificateBatch) => void;
}> = ({ cert, batch, onPreview }) => {
  const isApproved = batch.status === 'Approved' || (cert.serialNumber && !cert.serialNumber.includes('PENDING'));
  
  return (
    <button
      type="button"
      onClick={() => onPreview(cert, batch)}
      className="uni-pill-card w-full text-left flex flex-col sm:flex-row gap-4 items-center hover:border-primary/40 hover:scale-[1.01] transition-all uni-glass-hover cursor-pointer"
    >
      <div className="w-full sm:w-36 h-24 rounded-xl bg-[var(--primary-soft)] border border-[var(--border-color)] overflow-hidden flex items-center justify-center shrink-0">
        <div className="scale-[0.18] origin-center pointer-events-none">
          <CertificatePreview
            studentName={cert.studentName}
            enrollmentNumber={cert.enrollmentNumber}
            eventName={cert.eventName}
            clubName={cert.clubName}
            id={cert.serialNumber || 'MITS-CERT'}
            date={cert.date}
            template={(batch.templateId as any) || 'classic'}
          />
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-primary truncate">{cert.clubName || 'MITS Club'}</p>
          <span className="text-[10px] font-mono text-[var(--text-secondary)]">{cert.studentName}</span>
        </div>
        <p className="text-base font-bold text-[var(--text-main)] line-clamp-1">{cert.eventName}</p>
        <p className="text-[10px] font-mono text-[var(--text-secondary)]">{cert.serialNumber || cert.hash?.slice(0, 16) || 'ISSUED'}</p>
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uni-pill px-2.5 py-0.5 mt-1 ${isApproved ? 'text-emerald-600 bg-emerald-500/10' : 'text-amber-600 bg-amber-500/10'}`}>
          <ShieldCheck size={11} /> {isApproved ? 'Verified & Issued' : `Status: ${batch.status || 'Generated'}`}
        </span>
      </div>
      <ChevronRight size={22} className="text-[var(--text-secondary)] shrink-0 hidden sm:block" />
    </button>
  );
};

const PreviewModal: React.FC<{
  selectedCert: { cert: IssuedCertificate; batch: CertificateBatch };
  onClose: () => void;
  onPrint: () => void;
}> = ({ selectedCert, onClose, onPrint }) => {
  const [walletSaved, setWalletSaved] = useState(false);

  const handleSaveToWallet = () => {
    saveToGoogleWallet({
      id: selectedCert.cert.serialNumber || selectedCert.cert.hash || `CERT_${Date.now()}`,
      type: 'CERTIFICATE',
      title: selectedCert.cert.eventName,
      subtitle: selectedCert.cert.clubName,
      recipientName: selectedCert.cert.studentName,
      recipientId: selectedCert.cert.enrollmentNumber,
      organizationName: selectedCert.cert.clubName || 'Madhav Institute of Technology & Science',
      date: selectedCert.cert.date,
      barcodeValue: selectedCert.cert.serialNumber || selectedCert.cert.hash,
    });
    setWalletSaved(true);
    setTimeout(() => setWalletSaved(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div className="uni-pill-card w-full max-w-4xl max-h-[95vh] overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="uni-badge">Certificate Preview</span>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] mt-2">
              {selectedCert.cert.eventName}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
              {selectedCert.cert.serialNumber || 'MITS-AUTHENTICATED'} · Recipient: {selectedCert.cert.studentName} ({selectedCert.cert.enrollmentNumber || 'MITS'})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--primary-soft)] text-[var(--text-secondary)] cursor-pointer"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <div
          id="certificate-print-preview"
          className="rounded-xl overflow-hidden border-2 border-[var(--border-color)] bg-white shadow-inner mx-auto max-w-full"
          style={{ aspectRatio: '1.414 / 1' }}
        >
          <CertificatePreview
            studentName={selectedCert.cert.studentName}
            enrollmentNumber={selectedCert.cert.enrollmentNumber}
            eventName={selectedCert.cert.eventName}
            clubName={selectedCert.cert.clubName}
            id={selectedCert.cert.serialNumber || 'MITS-CERT'}
            date={selectedCert.cert.date}
            template={(selectedCert.batch.templateId as any) || 'classic'}
            isPrintReady
          />
        </div>

        <p className="text-xs text-center text-[var(--text-secondary)]">
          Tip: Paper format is set to standard A4 landscape. Choose &quot;Save as PDF&quot; in the print dialog to export.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleSaveToWallet}
            className="flex-1 h-12 bg-black hover:bg-neutral-900 text-white rounded-2xl font-bold text-xs uppercase tracking-wider border border-neutral-700 shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {walletSaved ? (
              <>
                <Check size={16} className="text-emerald-400" /> Added to Google Wallet
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.5 4H4.5C3.12 4 2 5.12 2 6.5V17.5C2 18.88 3.12 20 4.5 20H19.5C20.88 20 22 18.88 22 17.5V6.5C22 5.12 20.88 4 19.5 4Z" fill="#202124"/>
                  <path d="M4 8.5C4 7.67 4.67 7 5.5 7H18.5C19.33 7 20 7.67 20 8.5V15.5C20 16.33 19.33 17 18.5 17H5.5C4.67 17 4 16.33 4 15.5V8.5Z" fill="#3C4043"/>
                  <path d="M15 12C15 13.1 15.9 14 17 14C18.1 14 19 13.1 19 12C19 10.9 18.1 10 17 10C15.9 10 15 10.9 15 12Z" fill="#FBBC04"/>
                  <path d="M7 11H13V13H7V11Z" fill="#4285F4"/>
                </svg>
                Save to Google Wallet
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              printElementById(
                'certificate-print-preview',
                `MITS Certificate - ${selectedCert.cert.eventName} - ${selectedCert.cert.studentName}`,
                { landscape: true }
              );
            }}
            className="flex-1 h-12 uni-pill uni-btn-primary text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            <Printer size={18} /> Print Certificate (A4)
          </button>
          <button
            type="button"
            onClick={() => window.open(`/verify-cert?id=${selectedCert.cert.serialNumber}`, '_blank')}
            className="h-12 px-6 uni-pill border border-[var(--border-color)] font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink size={16} /> Verify
          </button>
        </div>
      </div>
    </div>
  );
};

interface Props {
  currentUser: User;
  batches: CertificateBatch[];
}

const MyCertificates: React.FC<Props> = ({ currentUser, batches = [] }) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{
    cert: IssuedCertificate;
    batch: CertificateBatch;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllScope, setShowAllScope] = useState(false);

  const isStaff = currentUser?.globalRole === Role.SUPER_ADMIN ||
                  currentUser?.globalRole === Role.DEAN ||
                  currentUser?.globalRole === Role.FACULTY;

  // Flatten all certificates across all batches
  const allCertificates = useMemo(() => {
    return (batches || []).flatMap(batch =>
      (batch.certificates || []).map(cert => ({ cert, batch }))
    );
  }, [batches]);

  // Filter for matching user certificates or all certificates for staff
  const userCertificates = useMemo(() => {
    if (!currentUser) return [];

    const matchesCurrentUser = ({ cert }: { cert: IssuedCertificate }) => {
      const sId = String(cert.studentId || '').toLowerCase().trim();
      const cId = String(currentUser.id || '').toLowerCase().trim();
      const sRoll = String(cert.enrollmentNumber || '').toLowerCase().trim();
      const cRoll = String(currentUser.enrollmentNumber || currentUser.rollNo || '').toLowerCase().trim();
      const sName = String(cert.studentName || '').toLowerCase().trim();
      const cName = String(currentUser.name || '').toLowerCase().trim();
      const sEmail = String(cert.email || '').toLowerCase().trim();
      const cEmail = String(currentUser.email || '').toLowerCase().trim();

      return (
        (cId && sId === cId) ||
        (cRoll && sRoll === cRoll) ||
        (cEmail && sEmail === cEmail) ||
        (cName && sName === cName)
      );
    };

    const directMatches = allCertificates.filter(matchesCurrentUser);

    // If user is staff and toggled all certificates OR student has direct matches
    if (showAllScope || (isStaff && directMatches.length === 0)) {
      return allCertificates;
    }

    return directMatches.length > 0 ? directMatches : allCertificates;
  }, [allCertificates, currentUser, showAllScope, isStaff]);

  // Apply search filtering
  const filteredCertificates = useMemo(() => {
    if (!searchTerm.trim()) return userCertificates;
    const term = searchTerm.toLowerCase();
    return userCertificates.filter(({ cert }) => {
      return (
        (cert.eventName || '').toLowerCase().includes(term) ||
        (cert.clubName || '').toLowerCase().includes(term) ||
        (cert.studentName || '').toLowerCase().includes(term) ||
        (cert.enrollmentNumber || '').toLowerCase().includes(term) ||
        (cert.serialNumber || '').toLowerCase().includes(term)
      );
    });
  }, [userCertificates, searchTerm]);

  const handlePrint = () => {
    printElementById(`certificate-print-preview`, `MITS Certificate - ${selectedCert?.cert.serialNumber}`, {
      landscape: true,
      width: 1100,
      height: 850,
    });
  };

  const handlePreview = (cert: IssuedCertificate, batch: CertificateBatch) => {
    setSelectedCert({ cert, batch });
    setIsPreviewModalOpen(true);
  };

  return (
    <PageShell
      badge="Credentials"
      title="My Certificates"
      subtitle="View, verify, print in A4, and add your official MITS certificates to Google Wallet."
      actions={
        <div className="flex items-center gap-3 flex-wrap">
          {isStaff && (
            <button
              type="button"
              onClick={() => setShowAllScope(!showAllScope)}
              className={`uni-pill px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${showAllScope ? 'bg-primary text-white' : 'border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-secondary)]'}`}
            >
              <Layers size={14} /> {showAllScope ? 'Showing All University' : 'Show All University'}
            </button>
          )}
          <div className="uni-pill-card !p-3 sm:!p-4 flex items-center gap-3">
            <Award className="text-primary" size={24} />
            <div>
              <p className="uni-text-stat leading-none">{filteredCertificates.length}</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Available</p>
            </div>
          </div>
        </div>
      }
    >
      {/* Search Filter */}
      {allCertificates.length > 0 && (
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search certificates by event, club, name, or serial..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] text-xs text-[var(--text-main)] outline-none focus:border-primary transition-all"
          />
        </div>
      )}

      {filteredCertificates.length === 0 ? (
        <div className="uni-pill-card py-16 text-center border border-dashed border-[var(--border-color)]">
          <Award size={48} className="mx-auto mb-4 text-[var(--text-secondary)] opacity-40" />
          <p className="font-semibold text-[var(--text-main)]">No certificates found</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-sm mx-auto">
            Certificates appear here after participating in events and when club coordinators or faculty approve your certificate batches.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCertificates.map(({ cert, batch }, idx) => (
            <CertificateCard
              key={`${cert.serialNumber || cert.hash || idx}`}
              cert={cert}
              batch={batch}
              onPreview={handlePreview}
            />
          ))}
        </div>
      )}

      {isPreviewModalOpen && selectedCert && (
        <PreviewModal
          selectedCert={selectedCert}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedCert(null);
          }}
          onPrint={handlePrint}
        />
      )}
    </PageShell>
  );
};

export default MyCertificates;
