import { supabase } from './supabaseClient';

/**
 * Universal Cloud Data Provider
 * Connects directly to Supabase cloud fabric for reliable multi-device sync,
 * supporting all CRUD actions and real-time live replication.
 */

// Helper to normalize records before saving to Supabase
function sanitizeRecordForTable(table: string, item: any): any {
  const id = item.id || `id_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const record = { ...item, id: String(id) };
  delete record._id;

  if (table === 'registrations') {
    record.studentRoll = record.studentRoll || record.studentRollNo || record.rollNo || record.roll || 'N/A';
    record.studentName = record.studentName || record.name || 'Student';
    record.studentId = record.studentId || record.userId || id;
    record.eventId = record.eventId || '';
  } else if (table === 'users') {
    record.name = record.name || 'User';
    record.email = (record.email || '').toLowerCase();
    record.globalRole = record.globalRole || 'Student';
  } else if (table === 'logs') {
    record.user = record.user || record.actorName || record.userName || 'System';
    record.action = record.action || 'ACTIVITY';
    record.timestamp = record.timestamp || new Date().toISOString();
  }

  return record;
}

export async function firestoreGetAll<T>(collectionName: string): Promise<T[]> {
  try {
    const { data, error } = await supabase.from(collectionName).select('*');
    if (error) {
      console.warn(`Supabase getAll failed for ${collectionName}:`, error.message);
      return [];
    }
    return (data || []) as T[];
  } catch (error) {
    console.warn(`Supabase getAll error for ${collectionName}:`, error);
    return [];
  }
}

export async function firestoreGetOne<T>(collectionName: string, id: string): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from(collectionName)
      .select('*')
      .eq('id', String(id))
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return data as T;
  } catch (error) {
    console.warn(`Supabase getOne error for ${collectionName}/${id}:`, error);
    return null;
  }
}

export async function firestoreSave<T extends { id?: string }>(collectionName: string, item: T): Promise<T> {
  try {
    const sanitized = sanitizeRecordForTable(collectionName, item);
    const { data, error } = await supabase
      .from(collectionName)
      .upsert([sanitized])
      .select();

    if (error) {
      console.warn(`Supabase save notice for ${collectionName}:`, error.message);
      return sanitized as T;
    }
    return (data && data[0] ? data[0] : sanitized) as T;
  } catch (error) {
    console.warn(`Supabase save error for ${collectionName}:`, error);
    return item;
  }
}

export async function firestoreDelete(collectionName: string, id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(collectionName)
      .delete()
      .eq('id', String(id));

    if (error) {
      console.warn(`Supabase delete notice for ${collectionName}/${id}:`, error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.warn(`Supabase delete error for ${collectionName}/${id}:`, error);
    return false;
  }
}

export async function firestoreQueryWhere<T>(collectionName: string, field: string, value: any): Promise<T[]> {
  try {
    const { data, error } = await supabase
      .from(collectionName)
      .select('*')
      .eq(field, value);

    if (error) {
      console.warn(`Supabase query failed for ${collectionName}:`, error.message);
      return [];
    }
    return (data || []) as T[];
  } catch (error) {
    console.warn(`Supabase query error for ${collectionName}:`, error);
    return [];
  }
}

export function subscribeToCollection<T>(collectionName: string, callback: (items: T[]) => void) {
  try {
    const channelName = `public:${collectionName}:${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: collectionName },
        async () => {
          const items = await firestoreGetAll<T>(collectionName);
          callback(items);
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
  } catch (e) {
    return () => {};
  }
}
