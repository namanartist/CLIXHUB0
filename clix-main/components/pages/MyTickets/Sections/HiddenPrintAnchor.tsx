import React from 'react';
import { Registration, Event, Club } from '../../../../types';
import { ClixQRCode } from '../../../common/ClixQRCode';

interface HiddenPrintAnchorProps {
    selectedReg: Registration | null;
    events: Event[];
    clubs: Club[];
}

export const HiddenPrintAnchor: React.FC<HiddenPrintAnchorProps> = ({
    selectedReg, events, clubs
}) => {
    if (!selectedReg) return null;

    const event = events.find(e => e.id === selectedReg.eventId);
    const club = clubs.find(c => c.id === event?.clubId);

    return (
        <div id="print-ticket-area" className="fixed inset-0 z-[-1] opacity-0 pointer-events-none overflow-hidden">
            <div className="w-[1000px] bg-white text-black p-12 flex flex-col gap-10">
                <div className="border-[12px] border-black p-12 rounded-[4rem] relative overflow-hidden bg-white min-h-[600px] flex flex-col justify-between">
                    <div className="absolute top-0 left-0 w-full h-10 bg-black flex items-center justify-center">
                        <p className="text-[10px] font-black uppercase text-[var(--text-main)] tracking-[1em]">MITS Institutional Entry Protocol</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-10">
                        <div className="flex items-center gap-6">
                            {club?.logoUrl ? (
                                <img src={club.logoUrl} alt={`${club?.name} logo`} className="w-20 h-20 rounded-3xl object-contain bg-white border border-black p-2" />
                            ) : (
                                <div className="w-20 h-20 rounded-3xl bg-black text-white flex items-center justify-center text-5xl font-black">{club?.name?.[0] || 'M'}</div>
                            )}
                            <div>
                                <div className="hindi-name">माधव प्रौद्योगिकी एवं विज्ञान संस्थान, ग्वालियर</div>
                                <div className="english-name">Madhav Institute of Technology & Science, Gwalior</div>
                                <div className="document-subtitle">(Deemed to be University u/s 3 of UGC Act, 1956 | NAAC A++ Grade)</div>
                            </div>
                        </div>
                        <img src="/mitslogo.jpg" alt="MITS Logo" className="h-20 w-auto object-contain" />
                    </div>
                    <div className="flex justify-between items-start mt-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-black text-white flex items-center justify-center text-5xl font-black rounded-3xl">
                                    {club?.name?.[0] || 'M'}
                                </div>
                                <div>
                                    <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Command Node</p>
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">{club?.name || 'MITS Organization'}</h2>
                                </div>
                            </div>
                            <h1 className="text-8xl font-[1000] tracking-tighter leading-[0.8] uppercase italic mt-12">ENTRY <br /><span className="text-transparent" style={{ WebkitTextStroke: '2px black' }}>PASS</span></h1>
                        </div>
                        <div className="p-4 border-4 border-black rounded-[2.5rem] bg-white shadow-2xl">
                            <ClixQRCode value={selectedReg.ticketId || selectedReg.id} size={220} level="H" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-16 pt-12 mt-12 border-t-4 border-black border-dashed">
                        <div>
                            <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Mission Identifier</p>
                            <h3 className="text-4xl font-black tracking-tighter leading-tight">{event?.title}</h3>
                        </div>
                        <div className="space-y-4 text-right">
                            <p className="text-[12px] font-black uppercase tracking-widest opacity-40">Agent Identity</p>
                            <h3 className="text-3xl font-black tracking-tight">{selectedReg.studentName}</h3>
                            <p className="font-mono text-sm font-black opacity-40">{selectedReg.ticketId || selectedReg.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
