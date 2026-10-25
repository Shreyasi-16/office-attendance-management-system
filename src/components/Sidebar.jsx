import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../constants/navigation';

export default function Sidebar({
  isCollapsed,
  activeItemId,
  onSelectItem
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = NAVIGATION_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-top-section">
        {/* Search Modules Input */}
        {!isCollapsed && (
          <div className="sidebar-search-container">
            <Search size={15} className="sidebar-search-icon" />
            <input
              type="text"
              placeholder="Search modules..."
              className="sidebar-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {/* Navigation List */}
        <nav className="sidebar-nav-wrapper">
          <ul className="sidebar-nav">
            {filteredItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeItemId === item.id;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`nav-item-btn ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectItem(item.id)}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <IconComponent size={18} className="nav-item-icon" />
                    <span className="nav-item-text">{item.label}</span>
                    {item.badge && !isCollapsed && (
                      <span className="nav-item-badge">{item.badge}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-powered-by">
          Powered by <span className="sidebar-powered-bold">Shreyasi Vasava</span>
        </div>
      </div>
    </aside>
  );
}
