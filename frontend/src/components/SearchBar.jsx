import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="filter-bar">
      <div className="search-input-wrapper">
        <Search size={18} color="var(--text-light)" />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title or details..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-controls">
        {/* Priority Filter */}
        <select
          className="custom-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          title="Filter by priority"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        {/* Category Filter */}
        <select
          className="custom-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          title="Filter by category"
        >
          <option value="all">All Categories</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Other">Other</option>
        </select>

        {/* Sorting Dropdown */}
        <select
          className="custom-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          title="Sort tasks"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
