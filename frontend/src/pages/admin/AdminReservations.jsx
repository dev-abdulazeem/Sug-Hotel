import { useEffect, useState } from 'react';
import { Search, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusConfig = {
  PENDING: { color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  CONFIRMED: { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
  COMPLETED: { color: 'text-gray-600', bg: 'bg-gray-50', icon: CheckCircle },
  CANCELLED: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchReservations(); }, [filter]);

  const fetchReservations = async () => {
    try {
      const params = filter !== 'ALL' ? `?status=${filter}` : '';
      const { data } = await api.get(`/reservations/all${params}`);
      setReservations(data.reservations);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status });
      toast.success('Updated'); fetchReservations();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" size={32}/></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="font-serif text-2xl text-charcoal">Table Reservations</h1><p className="text-sm text-gray-500">Manage dining reservations</p></div>
      
      <div className="flex space-x-2">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg text-sm ${filter === s ? 'bg-gold text-white' : 'bg-white border text-gray-600'}`}>{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>
            <th className="text-left text-xs uppercase text-gray-500 px-6 py-3">Guest</th>
            <th className="text-left text-xs uppercase text-gray-500 px-6 py-3">Restaurant</th>
            <th className="text-left text-xs uppercase text-gray-500 px-6 py-3">Date/Time</th>
            <th className="text-left text-xs uppercase text-gray-500 px-6 py-3">Guests</th>
            <th className="text-left text-xs uppercase text-gray-500 px-6 py-3">Status</th>
            <th className="text-left text-xs uppercase text-gray-500 px-6 py-3">Actions</th>
          </tr></thead>
          <tbody className="divide-y">
            {reservations.map(r => {
              const StatusIcon = statusConfig[r.status]?.icon || Clock;
              return (
                <tr key={r.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4"><p className="text-sm font-medium">{r.name}</p><p className="text-xs text-gray-400">{r.email}</p></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{r.restaurant.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(r.date).toLocaleDateString()} at {r.time}</td>
                  <td className="px-6 py-4 text-sm">{r.guests}</td>
                  <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${statusConfig[r.status]?.bg} ${statusConfig[r.status]?.color}`}><StatusIcon size={12} className="mr-1"/>{r.status}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {r.status === 'PENDING' && <button onClick={() => updateStatus(r.id, 'CONFIRMED')} className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded">Confirm</button>}
                      {r.status === 'PENDING' && <button onClick={() => updateStatus(r.id, 'CANCELLED')} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded">Cancel</button>}
                      {r.status === 'CONFIRMED' && <button onClick={() => updateStatus(r.id, 'COMPLETED')} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded">Complete</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}