import { useEffect, useState } from 'react';
import {
  Download,
  Trash2,
  FileSpreadsheet,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  X,
  Sheet,
  Table2,
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

export default function Exports({ allowDelete = false }) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const endpoint = isAdmin ? '/exports/admin/all' : '/exports';
      const { data } = await api.get(endpoint);
      setFiles(data.files || []);
    } catch {
      toast.error('Failed to load export files');
    } finally {
      setLoading(false);
    }
  };

  const buildViewUrl = (file) => {
    if (isAdmin && file.receptionistId) {
      return `/exports/admin/${file.receptionistId}/${encodeURIComponent(file.name)}`;
    }
    return `/exports/${encodeURIComponent(file.name)}`;
  };

  const buildDownloadUrl = (file) => {
    if (isAdmin && file.receptionistId) {
      return `/exports/admin/${file.receptionistId}/${encodeURIComponent(file.name)}/download`;
    }
    return `/exports/${encodeURIComponent(file.name)}/download`;
  };

  const buildDeleteUrl = (file) => {
    if (isAdmin && file.receptionistId) {
      // Backend doesn't have an admin delete endpoint, but you can add one later
      return `/exports/admin/${file.receptionistId}/${encodeURIComponent(file.name)}`;
    }
    return `/exports/${encodeURIComponent(file.name)}`;
  };

  const viewFile = async (file) => {
    setViewLoading(true);
    try {
      const { data } = await api.get(buildViewUrl(file));
      setFileData(data);
      setSelectedFile(file);
      const firstSheet = data.sheetNames?.[0] || null;
      setActiveSheet(firstSheet);
      setPage(1);
      setSearchQuery('');
    } catch {
      toast.error('Failed to read file');
    } finally {
      setViewLoading(false);
    }
  };

  const downloadFile = async (file) => {
    try {
      const response = await api.get(buildDownloadUrl(file), {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch {
      toast.error('Download failed');
    }
  };

  const deleteFile = async (file) => {
    if (!window.confirm(`Delete ${file.name}?`)) return;
    try {
      await api.delete(buildDeleteUrl(file));
      toast.success('Deleted');
      setFiles((prev) => prev.filter((f) => f.name !== file.name));
      if (selectedFile?.name === file.name) {
        setSelectedFile(null);
        setFileData(null);
        setActiveSheet(null);
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  // Handle both multi-sheet and flat data formats
  const hasSheets = fileData?.sheetNames && fileData.sheetNames.length > 0;
  const currentSheetData = hasSheets
    ? (fileData?.sheets?.[activeSheet] || [])
    : (fileData?.data || []);
  const columns =
    currentSheetData.length > 0
      ? Object.keys(currentSheetData[0])
      : (fileData?.columns || []);

  const filteredData = currentSheetData.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-charcoal mb-1">Export History</h1>
        <p className="text-sm text-gray-500">View and download export files</p>
      </div>

      {/* Files List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file.name + (file.receptionistId || '')}
            className={`bg-white rounded-xl border p-5 transition-all ${
              selectedFile?.name === file.name
                ? 'border-gold shadow-md'
                : 'border-gray-100 hover:shadow-md'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-charcoal truncate max-w-[180px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB ·{' '}
                    {new Date(file.modifiedAt).toLocaleDateString()}
                  </p>
                  {file.receptionistId && (
                    <p className="text-xs text-gold mt-0.5">
                      Rep: {file.receptionistId}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => viewFile(file)}
                className="flex-1 flex items-center justify-center space-x-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 py-2 rounded-lg transition-colors"
              >
                <Eye size={12} />
                <span>View</span>
              </button>
              <button
                onClick={() => downloadFile(file)}
                className="flex-1 flex items-center justify-center space-x-1 text-xs bg-gold/10 hover:bg-gold/20 text-gold py-2 rounded-lg transition-colors"
              >
                <Download size={12} />
                <span>Download</span>
              </button>
              {allowDelete && (
                <button
                  onClick={() => deleteFile(file)}
                  className="w-8 flex items-center justify-center text-xs bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <FileSpreadsheet size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl text-charcoal mb-2">No exports yet</h3>
          <p className="text-gray-500 text-sm">
            Export files will appear here when bookings or reservations are accepted/rejected.
          </p>
        </div>
      )}

      {/* File Viewer Modal */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet size={20} className="text-green-600" />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-charcoal">{selectedFile.name}</h2>
                  <p className="text-sm text-gray-500">
                    {hasSheets
                      ? `${fileData?.sheetNames?.length || 0} sheets · ${currentSheetData.length} rows`
                      : `${fileData?.totalRows || currentSheetData.length} rows · ${columns.length} columns`}
                  </p>
                  {selectedFile.receptionistId && (
                    <p className="text-xs text-gold">Rep: {selectedFile.receptionistId}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => downloadFile(selectedFile)}
                  className="flex items-center space-x-2 text-sm bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold-light transition-colors"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setFileData(null);
                    setActiveSheet(null);
                    setSearchQuery('');
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Sheet Tabs */}
            {hasSheets && (
              <div className="flex items-center space-x-1 px-6 pt-4 border-b border-gray-100 overflow-x-auto">
                {fileData.sheetNames.map((sheetName) => (
                  <button
                    key={sheetName}
                    onClick={() => {
                      setActiveSheet(sheetName);
                      setPage(1);
                      setSearchQuery('');
                    }}
                    className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                      activeSheet === sheetName
                        ? 'bg-gold/10 text-gold border-b-2 border-gold'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Table2 size={14} />
                    <span>{sheetName}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                      {fileData.sheets?.[sheetName]?.length || 0}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder={`Search ${activeSheet || 'data'}...`}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-0">
              {viewLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="animate-spin text-gold" size={32} />
                </div>
              ) : !hasSheets && !activeSheet && currentSheetData.length === 0 ? (
                <div className="text-center py-12">
                  <Sheet size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No data in this file.</p>
                </div>
              ) : hasSheets && !activeSheet ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Select a sheet to view data.</p>
                </div>
              ) : currentSheetData.length === 0 ? (
                <div className="text-center py-12">
                  <Sheet size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No data in this sheet.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        {columns.map((col) => (
                          <td
                            key={col}
                            className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap max-w-xs truncate"
                          >
                            {String(row[col] ?? '-')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * rowsPerPage + 1} -{' '}
                  {Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length}
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}