import React, { useRef } from 'react';
import { FileText, ShieldCheck, Printer } from 'lucide-react';
import { PublicLayout } from './PublicLayout';
import { printElementById } from '../../../lib/printDocument';

export const LegalDocs: React.FC<{ type: 'privacy' | 'tos'; onBack: () => void }> = ({ type, onBack }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (contentRef.current) {
      contentRef.current.id = 'legal-doc-print-root';
    }
    printElementById('legal-doc-print-root', content.title);
  };

  const content = type === 'privacy' ? {
    title: 'Privacy Policy',
    subtitle: 'How Clix Hub protects your campus identity',
    body: (
      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <div className="uni-pill-card p-6 md:p-8 border border-[var(--border-color)]">
          <p className="text-lg font-medium text-[var(--text-main)]">
            Clix Hub operates under institutional data protection standards, ensuring your academic and organizational identity remains secure.
          </p>
        </div>
        <div className="space-y-6">
          {[
            { title: 'Data collection & storage', text: 'We collect only essential identity markers required for authentication, event registration, and certificate verification: institutional email, enrollment number, and role information.' },
            { title: 'Verifiable credentials', text: 'Certificates and achievements issued through Clix Hub include serial numbers and verification links for institutional partners.' },
            { title: 'Tiered access control', text: 'Your profile data is protected by role-based access. Personal contact information is not exposed without your consent.' },
            { title: 'Audit & compliance', text: 'Administrative actions are logged in an audit trail for institutional transparency and accountability.' },
            { title: 'Third-party privacy', text: 'Clix Hub does not share personal data with external organizations without institutional authorization.' },
          ].map((section, i) => (
            <div key={i} className="uni-pill-card p-6 md:p-8 space-y-3">
              <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-3">
                <ShieldCheck size={22} className="text-primary shrink-0" />
                {section.title}
              </h3>
              <p>{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  } : {
    title: 'Terms of Service',
    subtitle: 'Campus guidelines & usage terms',
    body: (
      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <div className="uni-pill-card p-6 md:p-8 border border-[var(--border-color)]">
          <p className="text-lg font-medium text-[var(--text-main)]">
            By accessing Clix Hub, you agree to operate within institutional guidelines and respect the campus community.
          </p>
        </div>
        <div className="space-y-6">
          {[
            { title: '1. Institutional identity', text: 'All accounts must use your official MITS email. Account sharing or impersonation violates the student code of conduct.' },
            { title: '2. Financial integrity', text: 'Paid event transactions are processed through approved channels and subject to audit. Fraudulent payment proofs may result in suspension.' },
            { title: '3. Content standards', text: 'Club pages and events must maintain institutional dignity. Prohibited content will be removed.' },
            { title: '4. Attendance & verification', text: 'Attendance is tracked via QR codes. Falsifying records invalidates associated certificates.' },
            { title: '5. Leadership accountability', text: 'Club leaders accept responsibility for club funds and compliance with faculty oversight.' },
            { title: '6. Platform availability', text: 'Clix Hub targets high availability during academic terms; maintenance may require brief downtime.' },
          ].map((section, i) => (
            <div key={i} className="uni-pill-card p-6 md:p-8 space-y-3">
              <h3 className="text-xl font-bold text-[var(--text-main)]">{section.title}</h3>
              <p>{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <PublicLayout
      title={content.title}
      subtitle={content.subtitle}
      icon={<FileText size={32} className="text-primary" />}
      onBack={onBack}
      actions={
        <button
          type="button"
          onClick={handlePrint}
          className="uni-pill px-5 py-2.5 uni-btn-primary text-white text-sm font-semibold inline-flex items-center gap-2"
        >
          <Printer size={18} /> Print document
        </button>
      }
    >
      <div ref={contentRef} id="legal-doc-print-root" className="uni-pill-card p-8 md:p-12 space-y-8">
        {content.body}
        <div className="pt-8 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-secondary)] font-medium uppercase tracking-widest">
          Last updated: January 2025 · Clix Hub
        </div>
      </div>
    </PublicLayout>
  );
};
