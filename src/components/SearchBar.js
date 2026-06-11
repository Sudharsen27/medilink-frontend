import React from "react";
import SearchInput from "../ui/SearchInput";

const SearchBar = ({ onSearch, placeholder = "Search appointments..." }) => (
  <SearchInput onSearch={onSearch} placeholder={placeholder} />
);

export default SearchBar;
