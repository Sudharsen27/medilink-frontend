import React, { useState } from "react";
import { Search, X } from "lucide-react";

const SearchInput = ({
  onSearch,
  placeholder = "Search...",
  defaultValue = "",
  showButton = false,
  className = "",
}) => {
  const [query, setQuery] = useState(defaultValue);

  const submit = (e) => {
    e?.preventDefault();
    onSearch(query);
  };

  const clear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={submit} className={`relative ${className}`} role="search">
      <div className="relative flex items-center">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!showButton) onSearch(e.target.value);
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          className="health-input pl-10 pr-10 py-2.5 min-w-[200px] lg:min-w-[260px]"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {showButton && (
        <button
          type="submit"
          className="sr-only"
        >
          Search
        </button>
      )}
    </form>
  );
};

export default SearchInput;
