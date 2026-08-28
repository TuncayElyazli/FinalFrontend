import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LuSearch, LuPencil, LuTrash2 } from 'react-icons/lu';

/**
 * Reusable admin data table with search, striped rows, and action buttons.
 * @param {Object} props
 * @param {Array<{key: string, label: string, render?: function}>} props.columns
 * @param {Array<Object>} props.data
 * @param {function} [props.onEdit]
 * @param {function} [props.onDelete]
 * @param {string} [props.searchPlaceholder='Search...']
 */
export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  searchPlaceholder = 'Search...',
}) {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        return value != null && String(value).toLowerCase().includes(q);
      })
    );
  }, [data, search, columns]);

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden" id="data-table">
      {/* Search Bar */}
      <div className="p-4 border-b border-border-subtle">
        <div className="relative max-w-sm">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            id="table-search"
            className="w-full pl-10 pr-4 py-2.5 bg-bg-surface border border-border-subtle rounded-xl text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-red/40 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-surface/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-text-muted whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/40">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-6 py-12 text-center text-sm text-text-muted"
                >
                  No data found.
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <motion.tr
                  key={row.id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`
                    hover:bg-white/[0.03] transition-colors
                    ${i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'}
                  `}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-text-secondary align-middle">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-right whitespace-nowrap align-middle">
                      <div className="flex items-center justify-end gap-2 flex-nowrap">
                        {onEdit && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onEdit(row)}
                            className="w-8 h-8 rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center text-accent-amber hover:text-accent-amber-neon hover:border-accent-amber/30 transition-all cursor-pointer flex-shrink-0"
                            title="Edit"
                          >
                            <LuPencil className="w-3.5 h-3.5" />
                          </motion.button>
                        )}
                        {onDelete && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onDelete(row)}
                            className="w-8 h-8 rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center text-red-400 hover:text-red-300 hover:border-red-800/40 transition-all cursor-pointer flex-shrink-0"
                            title="Delete"
                          >
                            <LuTrash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border-subtle text-xs text-text-muted">
        Showing {filteredData.length} of {data.length} entries
      </div>
    </div>
  );
}
