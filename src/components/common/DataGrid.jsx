import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import './DataGrid.css';

/**
 * Reusable, self-contained DataGrid component.
 * @param {Object} props
 * @param {Array} props.columns - Column specs [{ key, header, render, sortable, width, align }]
 * @param {Array} props.data - Array of row objects
 * @param {string} [props.keyField='id'] - Unique key identifier
 * @param {string} [props.searchQuery=''] - Optional quick search term
 * @param {number} [props.defaultPageSize=8] - Initial rows per page
 * @param {string} [props.emptyTitle='No records found']
 * @param {string} [props.emptySubtitle='Try adjusting your search filters or add a new record.']
 * @param {boolean} [props.isLoading=false]
 */
export default function DataGrid({
  columns = [],
  data = [],
  keyField = 'id',
  searchQuery = '',
  defaultPageSize = 8,
  emptyTitle = 'No records found',
  emptySubtitle = 'Try adjusting your search filters or add a new record.',
  isLoading = false
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // 1. Search Filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase().trim();

    return data.filter((row) => {
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string') {
        const res = aVal.localeCompare(String(bVal));
        return sortConfig.direction === 'asc' ? res : -res;
      }

      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredData, sortConfig]);

  // Reset to page 1 when data or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize, data.length]);

  // 3. Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key, sortable) => {
    if (!sortable) return;
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return { key: null, direction: 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <div className="datagrid-container">
      {/* Table Scroll Wrapper */}
      <div className="datagrid-scroll-wrap">
        <table className="datagrid-table">
          <thead>
            <tr>
              {columns.map((col) => {
                const isSorted = sortConfig.key === col.key;
                return (
                  <th
                    key={col.key}
                    style={{
                      width: col.width || 'auto',
                      textAlign: col.align || 'left',
                      cursor: col.sortable ? 'pointer' : 'default'
                    }}
                    onClick={() => handleSort(col.key, col.sortable)}
                    className={col.sortable ? 'sortable-header' : ''}
                  >
                    <div className="header-cell-content" style={{ justifyContent: col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start' }}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="sort-icon-wrap">
                          {isSorted ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp size={14} className="sort-icon active" />
                            ) : (
                              <ChevronDown size={14} className="sort-icon active" />
                            )
                          ) : (
                            <ChevronsUpDown size={14} className="sort-icon" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="datagrid-empty-cell">
                  <div className="datagrid-loading-spinner" />
                  <p className="empty-title">Loading records...</p>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="datagrid-empty-cell">
                  <div className="empty-icon-wrap">
                    <Inbox size={32} />
                  </div>
                  <p className="empty-title">{emptyTitle}</p>
                  <p className="empty-subtitle">{emptySubtitle}</p>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr key={row[keyField] || index} className="datagrid-row">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{ textAlign: col.align || 'left' }}
                    >
                      {col.render ? col.render(row[col.key], row, index) : row[col.key] ?? '--'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalItems > 0 && (
        <div className="datagrid-footer-row">
          <div className="datagrid-summary-text">
            Showing <strong>{startIndex + 1}</strong> to{' '}
            <strong>{Math.min(startIndex + pageSize, totalItems)}</strong> of{' '}
            <strong>{totalItems}</strong> entries
          </div>

          <div className="datagrid-pagination-controls">
            {/* Page Size Selector */}
            <div className="page-size-picker">
              <span>Rows per page:</span>
              <select
                className="page-size-select"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                aria-label="Rows per page"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            {/* Pagination Navigation */}
            <div className="page-btn-group">
              <button
                type="button"
                className="page-nav-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="page-indicator-pill">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                className="page-nav-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
