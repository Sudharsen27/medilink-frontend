import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  X,
  Stethoscope,
  Users,
} from "lucide-react";
import { apiUrl } from "../config/api";
import { useToast } from "../context/ToastContext";
import { useFavorites } from "../context/FavoritesContext";
import DoctorMarketplaceCard from "../components/DoctorMarketplaceCard";
import PageContainer from "../ui/PageContainer";
import Card from "../ui/Card";
import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import { DoctorsPageSkeleton } from "../ui/Skeleton";

const EXPERIENCE_FILTERS = [
  { value: "all", label: "Any experience" },
  { value: "5", label: "5+ years" },
  { value: "10", label: "10+ years" },
  { value: "15", label: "15+ years" },
];

const RATING_FILTERS = [
  { value: "all", label: "Any rating" },
  { value: "4", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
];

const AVAILABILITY_FILTERS = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];

const FilterSelect = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="health-input py-2.5 text-sm w-full"
      aria-label={label}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const SpecialtyChip = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
      active
        ? "bg-health-600 text-white shadow-soft"
        : "bg-slate-100 text-slate-600 hover:bg-health-50 hover:text-health-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-health-950/40"
    }`}
    aria-pressed={active}
  >
    {label}
  </button>
);

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [minExperience, setMinExperience] = useState("all");
  const [minRating, setMinRating] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const doctorsPerPage = 6;
  const { addToast } = useToast();
  const { isFavorite } = useFavorites();

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(apiUrl("/api/doctors"), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to fetch doctors");

      const data = await res.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setDoctors([]);
      addToast("Failed to load doctors", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const specialties = useMemo(() => {
    const specs = doctors
      .map((d) => d.specialization)
      .filter(Boolean);
    return ["all", ...new Set(specs)];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    let result = [...doctors];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (d) =>
          (d.name || "").toLowerCase().includes(q) ||
          (d.specialization || "").toLowerCase().includes(q) ||
          (d.bio || "").toLowerCase().includes(q) ||
          (d.clinic_address || "").toLowerCase().includes(q)
      );
    }

    if (specialty !== "all") {
      result = result.filter(
        (d) => d.specialization?.toLowerCase() === specialty.toLowerCase()
      );
    }

    if (minExperience !== "all") {
      const min = Number(minExperience);
      result = result.filter((d) => (d.experience ?? 0) >= min);
    }

    if (minRating !== "all") {
      const min = Number(minRating);
      result = result.filter((d) => (Number(d.rating) || 0) >= min);
    }

    if (availability === "available") {
      result = result.filter((d) => d.is_active !== false);
    } else if (availability === "unavailable") {
      result = result.filter((d) => d.is_active === false);
    }

    result.sort((a, b) => {
      if (sortBy === "experience") return (b.experience ?? 0) - (a.experience ?? 0);
      if (sortBy === "rating") return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      if (sortBy === "favorites") {
        const af = isFavorite(a.id);
        const bf = isFavorite(b.id);
        if (af === bf) return 0;
        return af ? -1 : 1;
      }
      return (a.name || "").localeCompare(b.name || "");
    });

    return result;
  }, [doctors, searchTerm, specialty, minExperience, minRating, availability, sortBy, isFavorite]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, specialty, minExperience, minRating, availability, sortBy]);

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage) || 1;
  const currentDoctors = filteredDoctors.slice(
    (currentPage - 1) * doctorsPerPage,
    currentPage * doctorsPerPage
  );

  const activeFilterCount = [
    specialty !== "all",
    minExperience !== "all",
    minRating !== "all",
    availability !== "all",
    searchTerm,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm("");
    setSpecialty("all");
    setMinExperience("all");
    setMinRating("all");
    setAvailability("all");
    setSortBy("rating");
  };

  const filterPanel = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <FilterSelect
        label="Experience"
        value={minExperience}
        onChange={setMinExperience}
        options={EXPERIENCE_FILTERS}
      />
      <FilterSelect
        label="Rating"
        value={minRating}
        onChange={setMinRating}
        options={RATING_FILTERS}
      />
      <FilterSelect
        label="Availability"
        value={availability}
        onChange={setAvailability}
        options={AVAILABILITY_FILTERS}
      />
      <FilterSelect
        label="Sort by"
        value={sortBy}
        onChange={setSortBy}
        options={[
          { value: "rating", label: "Highest rated" },
          { value: "experience", label: "Most experienced" },
          { value: "name", label: "Name A–Z" },
          { value: "favorites", label: "Favorites first" },
        ]}
      />
    </div>
  );

  if (loading) {
    return (
      <PageContainer className="pb-12">
        <DoctorsPageSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pb-12">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-health-600 dark:text-health-400 uppercase tracking-wide mb-1">
              Find care
            </p>
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 dark:text-white">
              Doctor Marketplace
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
              Browse specialists, compare ratings, and book appointments with trusted healthcare professionals.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-health-50 dark:bg-health-950/30 border border-health-200/60 dark:border-health-800/40">
            <Users className="w-5 h-5 text-health-600" aria-hidden="true" />
            <span className="text-sm font-semibold text-health-800 dark:text-health-300">
              {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <Card glass padding="md" className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <SearchInput
            onSearch={setSearchTerm}
            placeholder="Search doctors, specialties, locations…"
            className="flex-1"
          />
          <div className="flex gap-2 shrink-0">
            <Button
              variant="secondary"
              size="md"
              icon={SlidersHorizontal}
              className="lg:hidden"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              aria-expanded={showMobileFilters}
            >
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Button>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="md" icon={X} onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Specialty chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide" role="group" aria-label="Specialty filters">
          {specialties.map((spec) => (
            <SpecialtyChip
              key={spec}
              label={spec === "all" ? "All specialties" : spec}
              active={specialty === spec}
              onClick={() => setSpecialty(spec)}
            />
          ))}
        </div>

        {/* Desktop filters */}
        <div className="hidden lg:block">{filterPanel}</div>

        {/* Mobile filters drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                {filterPanel}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Results */}
      {currentDoctors.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No doctors match your filters"
          description="Try adjusting search terms or clearing filters to see more providers."
          actionLabel="Clear all filters"
          onAction={clearFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentDoctors.map((doctor, index) => (
              <DoctorMarketplaceCard key={doctor.id} doctor={doctor} index={index} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="flex justify-center items-center gap-3 mt-10"
              aria-label="Doctor list pagination"
            >
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default Doctors;
