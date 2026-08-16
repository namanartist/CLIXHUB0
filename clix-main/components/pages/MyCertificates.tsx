import React, { useMemo, useState } from 'react';
import { User, CertificateBatch, IssuedCertificate } from '../../types';
import { Award, ChevronRight, Printer, ShieldCheck, X, ExternalLink } from 'lucide-react';
import CertificatePreview from '../CertificatePreview';
import { printElementById } from '../../lib/printDocument';
import { PageShell } from '../ui/PageShell';

const CertificateCard: React.FC<{
  cert: IssuedCertificate;
  batch: CertificateBatch;
  onPreview: (cert: IssuedCertificate, batch: CertificateBatch) => void;
}> = ({ cert, batch, onPreview }) => (
  <button
    type="button"
    onClick={() => onPreview(cert, batch)}
    className="uni-pill-card w-full text-left flex flex-col sm:flex-row gap-4 items-center hover:border-primary/40 hover:scale-[1.01] transition-all uni-glass-hover"
  >
    <div className="w-full sm:w-36 h-24 rounded-xl bg-[var(--primary-soft)] border border-[var(--border-color)] overflow-hidden flex items-center justify-center shrink-0">
      <div className="scale-[0.18] origin-center pointer-events-none">
        <CertificatePreview
          studentName={cert.studentName}
          enrollmentNumber={cert.enrollmentNumber}
          eventName={cert.eventName}
          clubName={cert.clubName}
          id={cert.serialNumber}
          date={cert.date}
          template={(batch.templateId as any) || 'classic'}
        />
      </div>
    </div>
    <div className="flex-1 min-w-0 space-y-1">
      <p className="text-xs font-semibold text-primary truncate">{cert.clubName}</p>
      <p className="text-base font-bold text-[var(--text-main)] line-clamp-1">{cert.eventName}</p>
      <p className="text-[10px] font-mono text-[var(--text-secondary)]">{cert.serialNumber}</p>
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 uni-pill px-2 py-0.5 mt-1">
        <ShieldCheck size={10} /> Verified
      </span>
    </div>
    <ChevronRight size={22} className="text-[var(--text-secondary)] shrink-0 hidden sm:block" />
  </button>
);

const PreviewModal: React.FC<{
  selectedCert: { cert: IssuedCertificate; batch: CertificateBatch };
  onClose: () => void;
  onPrint: () => void;
}> = ({ selectedCert, onClose, onPrint }) => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md">
    <div className="uni-pill-card w-full max-w-4xl max-h-[95vh] overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-4 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="uni-badge">Certificate preview</span>
          <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] mt-2">
            {selectedCert.cert.eventName}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
            {selectedCert.cert.serialNumber}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-[var(--primary-soft)] text-[var(--text-secondary)]"
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
          id={selectedCert.cert.serialNumber}
          date={selectedCert.cert.date}
          template={(selectedCert.batch.templateId as any) || 'classic'}
          isPrintReady
        />
      </div>

      <p className="text-xs text-center text-[var(--text-secondary)]">
        Tip: Choose &quot;Save as PDF&quot; in the print dialog to download.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => {
            onClose();
            (window as any).openPrintStudio?.({
              id: selectedCert.cert.serialNumber || selectedCert.cert.hash || `CERT_${Date.now()}`,
              type: 'certificate',
              title: selectedCert.cert.eventName,
              recipientName: selectedCert.cert.studentName,
              recipientRoll: selectedCert.cert.enrollmentNumber,
              organizationName: selectedCert.cert.clubName,
              date: selectedCert.cert.date,
              templateId: (selectedCert.batch.templateId as any) || 'modern',
              signatureNames: ['Dr. Priya Verma', 'Dr. Manish Dixit']
            });
          }}
          className="flex-1 h-12 uni-pill uni-btn-primary text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Printer size={18} /> Download High-Res PDF & Digital Wallet
        </button>
        <button
          type="button"
          onClick={() => window.open(`/verify-cert?id=${selectedCert.cert.serialNumber}`, '_blank')}
          className="h-12 px-6 uni-pill border border-[var(--border-color)] font-semibold text-sm flex items-center justify-center gap-2"
        >
          <ExternalLink size={16} /> Verify
        </button>
      </div>
    </div>
  </div>
);

interface Props {
  currentUser: User;
  batches: CertificateBatch[];
}

const MyCertificates: React.FC<Props> = ({ currentUser, batches }) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{
    cert: IssuedCertificate;
    batch: CertificateBatch;
  } | null>(null);

  const userCertificates = useMemo(
    () =>
      batches
        .filter(batch => batch.status === 'Approved')
        .flatMap(batch =>
          batch.certificates
            .filter(
              cert =>
                cert.studentId === currentUser.id ||
                cert.enrollmentNumber === currentUser.enrollmentNumber
            )
            .map(cert => ({ cert, batch }))
        ),
    [batches, currentUser]
  );

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
      title="My certificates"
      subtitle="View, print, or save your issued MITS certificates."
      actions={
        <div className="uni-pill-card !p-4 flex items-center gap-3">
          <Award className="text-primary" size={24} />
          <div>
            <p className="uni-text-stat leading-none">{userCertificates.length}</p>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">Issued</p>
          </div>
        </div>
      }
    >
      {userCertificates.length === 0 ? (
        <div className="uni-pill-card py-16 text-center border border-dashed border-[var(--border-color)]">
          <Award size={48} className="mx-auto mb-4 text-[var(--text-secondary)] opacity-40" />
          <p className="font-semibold text-[var(--text-main)]">No certificates yet</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-sm mx-auto">
            Certificates appear here after club coordinators approve your event participation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {userCertificates.map(({ cert, batch }) => (
            <CertificateCard key={cert.serialNumber} cert={cert} batch={batch} onPreview={handlePreview} />
          ))}
        </div>
      )}

      {isPreviewModalOpen && selectedCert && (
        <PreviewModal
          selectedCert={selectedCert}
          onClose={() => setIsPreviewModalOpen(false)}
          onPrint={handlePrint}
        />
      )}
    </PageShell>
  );
};

export default MyCertificates;
