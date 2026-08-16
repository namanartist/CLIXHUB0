import React, { useMemo, useState } from 'react';
import { Venue, Event } from '../../types';
import {
    Calendar,
    Plus,
    Building2,
    MapPin,
    ListChecks,
    X,
    CheckCircle2,
} from 'lucide-react';

interface Props {
    venues: Venue[];
    events: Event[];
    onAddVenue: (venue: Venue) => Promise<void>;
    isDarkMode: boolean;
}

const defaultVenueForm: Partial<Venue> = {
    id: '',
    name: '',
    location: '',
    capacity: 0,
    status: 'Available',
    amenities: [],
    description: '',
};

const VenueAvailability: React.FC<Props> = ({ venues, events, onAddVenue }) => {
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVenueData, setNewVenueData] = useState<Partial<Venue>>(defaultVenueForm);
    const [saving, setSaving] = useState(false);

    const bookingsForDate = useMemo(() => {
        return events.filter(
            event => event.date === selectedDate && event.venueId && event.status !== 'Rejected'
        );
    }, [events, selectedDate]);

    const availability = useMemo(() => {
        return venues.map(venue => {
            const bookedEvent = bookingsForDate.find(event => event.venueId === venue.id);
            return { venue, bookedEvent };
        });
    }, [venues, bookingsForDate]);

    const bookedCount = availability.filter(item => item.bookedEvent || item.venue.status === 'Booked').length;
    const availableCount = availability.length - bookedCount;

    const handleCreateVenue = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newVenueData.name?.trim()) return;

        const venueToSave: Venue = {
            id: newVenueData.id || '',
            name: newVenueData.name.trim(),
            location: newVenueData.location?.trim() || '',
            capacity: Number(newVenueData.capacity) || 0,
            status: newVenueData.status || 'Available',
            amenities: Array.isArray(newVenueData.amenities)
                ? newVenueData.amenities.map(item => item.trim()).filter(Boolean)
                : String(newVenueData.amenities || '')
                    .split(',')
                    .map(item => item.trim())
                    .filter(Boolean),
            description: newVenueData.description?.trim() || '',
        };

        try {
            setSaving(true);
            await onAddVenue(venueToSave);
            setNewVenueData(defaultVenueForm);
            setIsModalOpen(false);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-soft)] border border-[var(--border-color)]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Venue Management</span>
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--text-main)] leading-none">
                            Venue Availability
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)] mt-3 max-w-2xl font-medium">
                            Track campus venues date-wise, inspect current bookings, and add new locations for event scheduling.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-4 bg-[var(--primary)] text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                        <Plus size={18} /> Add Venue
                    </button>
                    <label className="inline-flex items-center gap-3 px-4 py-4 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)]">
                        <Calendar size={18} className="text-[var(--text-secondary)]" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="bg-transparent text-[var(--text-main)] outline-none"
                        />
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="uni-pill-card p-6 border border-[var(--border-color)] shadow-sm bg-[var(--bg-surface)]">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)] font-black">Date</p>
                                    <p className="mt-2 text-sm font-semibold text-[var(--text-main)]">{new Date(selectedDate).toLocaleDateString()}</p>
                                </div>
                                <Calendar size={24} className="text-[var(--primary)]" />
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)]">Availability snapshot for this date.</p>
                        </div>
                        <div className="uni-pill-card p-6 border border-[var(--border-color)] shadow-sm bg-[var(--bg-surface)]">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)] font-black">Venues</p>
                                    <p className="mt-2 text-3xl font-black text-[var(--text-main)]">{availability.length}</p>
                                </div>
                                <Building2 size={24} className="text-emerald-500" />
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)]">Total campus venues managed in the system.</p>
                        </div>
                        <div className="uni-pill-card p-6 border border-[var(--border-color)] shadow-sm bg-[var(--bg-surface)]">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-secondary)] font-black">Available</p>
                                    <p className="mt-2 text-3xl font-black text-[var(--text-main)]">{availableCount}</p>
                                </div>
                                <CheckCircle2 size={24} className="text-emerald-500" />
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)]">Venues ready to book for the selected date.</p>
                        </div>
                    </div>

                    <div className="uni-pill-card border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-sm p-6">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-[var(--text-main)]">Schedule for {new Date(selectedDate).toLocaleDateString()}</h2>
                                <p className="text-sm text-[var(--text-secondary)]">Book venues for campus events and review any fixed reservations.</p>
                            </div>
                            <div className="text-sm text-[var(--text-secondary)]">{bookedCount} booked / {availability.length} total</div>
                        </div>

                        <div className="grid gap-4">
                            {availability.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-[var(--border-color)] p-8 text-center text-[var(--text-secondary)]">
                                    No venues have been added yet. Add a venue to make it available for event scheduling.
                                </div>
                            ) : availability.map(({ venue, bookedEvent }) => (
                                <div key={venue.id} className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] p-5 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
                                                <Building2 size={18} />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-[var(--text-main)]">{venue.name}</h3>
                                                <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">{venue.location || 'Campus'}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)]">{venue.description || 'No additional description provided.'}</p>
                                        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-[var(--text-secondary)]">
                                            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] px-3 py-1">{venue.capacity || 'N/A'} seats</span>
                                            {venue.amenities?.slice(0, 3).map((item, index) => (
                                                <span key={index} className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] px-3 py-1">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] font-black ${bookedEvent ? 'bg-rose-500/10 text-rose-300' : venue.status === 'Available' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                                            <span>{bookedEvent ? 'Booked' : venue.status || 'Available'}</span>
                                        </span>
                                        {bookedEvent ? (
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-[var(--text-main)]">{bookedEvent.title}</p>
                                                <p className="text-xs text-[var(--text-secondary)]">Managed by {bookedEvent.eventCoordinatorName || bookedEvent.clubId || 'Club'}</p>
                                                <p className="text-[11px] text-[var(--text-secondary)]">{bookedEvent.startDateTime || bookedEvent.date}</p>
                                            </div>
                                        ) : (
                                            <p className="text-[11px] text-[var(--text-secondary)]">This venue is free for scheduling on the selected date.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="uni-pill-card border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
                                <ListChecks size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[var(--text-main)]">Quick Summary</h2>
                                <p className="text-sm text-[var(--text-secondary)]">Venue statuses and booking counts for the selected date.</p>
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <div className="rounded-3xl border border-[var(--border-color)] p-4 bg-[var(--bg-main)]">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">Booked Today</p>
                                <p className="mt-2 text-3xl font-black text-[var(--text-main)]">{bookedCount}</p>
                            </div>
                            <div className="rounded-3xl border border-[var(--border-color)] p-4 bg-[var(--bg-main)]">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)]">Available Today</p>
                                <p className="mt-2 text-3xl font-black text-[var(--text-main)]">{availableCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="uni-pill-card border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[var(--text-main)]">Venue Notes</h2>
                                <p className="text-sm text-[var(--text-secondary)]">Use this page to keep track of campus assets and avoid double-booking on match dates.</p>
                            </div>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            If a venue appears unavailable while not booked, make sure the venue status is updated to Available or Reserved in the venue master data.
                        </p>
                    </div>
                </div>
            </div>

            {isModalOpen ? (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full max-w-3xl rounded-[2rem] bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 shadow-2xl">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-[var(--text-main)]">Add New Venue</h3>
                                <p className="text-sm text-[var(--text-secondary)]">Register a campus location so staff can book it for events and activities.</p>
                            </div>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full p-3 bg-[var(--bg-main)] border border-[var(--border-color)] hover:bg-[var(--bg-surface)] transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <form className="space-y-4" onSubmit={handleCreateVenue}>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <label className="space-y-2 text-sm text-[var(--text-secondary)]">
                                    <span className="font-bold text-[var(--text-main)]">Venue Name</span>
                                    <input
                                        value={newVenueData.name || ''}
                                        onChange={e => setNewVenueData({ ...newVenueData, name: e.target.value })}
                                        required
                                        placeholder="e.g. Auditorium"
                                        className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-primary"
                                    />
                                </label>
                                <label className="space-y-2 text-sm text-[var(--text-secondary)]">
                                    <span className="font-bold text-[var(--text-main)]">Location</span>
                                    <input
                                        value={newVenueData.location || ''}
                                        onChange={e => setNewVenueData({ ...newVenueData, location: e.target.value })}
                                        placeholder="e.g. Main Building"
                                        className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-primary"
                                    />
                                </label>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <label className="space-y-2 text-sm text-[var(--text-secondary)]">
                                    <span className="font-bold text-[var(--text-main)]">Capacity</span>
                                    <input
                                        type="number"
                                        min={0}
                                        value={newVenueData.capacity || ''}
                                        onChange={e => setNewVenueData({ ...newVenueData, capacity: Number(e.target.value) || 0 })}
                                        placeholder="e.g. 250"
                                        className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-primary"
                                    />
                                </label>
                                <label className="space-y-2 text-sm text-[var(--text-secondary)]">
                                    <span className="font-bold text-[var(--text-main)]">Status</span>
                                    <select
                                        value={newVenueData.status || 'Available'}
                                        onChange={e => setNewVenueData({ ...newVenueData, status: e.target.value as Venue['status'] })}
                                        className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-primary"
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Reserved">Reserved</option>
                                        <option value="Booked">Booked</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </label>
                            </div>
                            <label className="space-y-2 text-sm text-[var(--text-secondary)]">
                                <span className="font-bold text-[var(--text-main)]">Amenities</span>
                                <input
                                    value={Array.isArray(newVenueData.amenities) ? newVenueData.amenities.join(', ') : newVenueData.amenities || ''}
                                    onChange={e => setNewVenueData({ ...newVenueData, amenities: e.target.value.split(',').map(item => item.trim()) })}
                                    placeholder="WiFi, Projector, Sound System"
                                    className="w-full rounded-3xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-primary"
                                />
                            </label>
                            <label className="space-y-2 text-sm text-[var(--text-secondary)]">
                                <span className="font-bold text-[var(--text-main)]">Description</span>
                                <textarea
                                    value={newVenueData.description || ''}
                                    onChange={e => setNewVenueData({ ...newVenueData, description: e.target.value })}
                                    rows={4}
                                    placeholder="Optional details about the venue"
                                    className="w-full rounded-[1.5rem] border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm outline-none focus:border-primary"
                                />
                            </label>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 rounded-3xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-main)] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-3 rounded-3xl bg-[var(--primary)] text-white font-bold hover:bg-primary/90 transition-all"
                                >
                                    {saving ? 'Saving...' : 'Save Venue'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default VenueAvailability;
