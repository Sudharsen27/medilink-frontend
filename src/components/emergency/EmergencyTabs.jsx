import React from "react";
import {
  HeartPulse,
  Users,
  Building2,
  Phone,
  MessageSquare,
  MapPin,
  Pencil,
  Navigation,
  Ambulance,
} from "lucide-react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import EmptyState from "../../ui/EmptyState";
import Chip from "../../ui/Chip";

const TABS = [
  { id: "medical", label: "Medical info", icon: HeartPulse },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "hospitals", label: "Hospitals", icon: Building2 },
];

export const EmergencyTabBar = ({ active, onChange }) => (
  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist">
    {TABS.map((tab) => (
      <Chip
        key={tab.id}
        selected={active === tab.id}
        onClick={() => onChange(tab.id)}
        icon={tab.icon}
      >
        {tab.label}
      </Chip>
    ))}
  </div>
);

export const MedicalInfoPanel = ({ medicalInfo, onEdit }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        Emergency medical profile
      </h3>
      <Button variant="ghost" size="sm" icon={Pencil} onClick={onEdit}>
        Edit
      </Button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        { label: "Blood type", value: medicalInfo?.blood_type },
        { label: "Primary doctor", value: medicalInfo?.doctor_name },
        { label: "Doctor phone", value: medicalInfo?.doctor_phone },
        { label: "Insurance", value: medicalInfo?.insurance_provider },
      ].map((row) => (
        <div
          key={row.label}
          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400">{row.label}</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white mt-0.5">
            {row.value || "Not specified"}
          </p>
        </div>
      ))}
    </div>

    {[
      { title: "Allergies", items: medicalInfo?.allergies, danger: true },
      { title: "Conditions", items: medicalInfo?.conditions },
      { title: "Medications", items: medicalInfo?.medications },
    ].map((section) => (
      <Card key={section.title} padding="sm" className="!p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
          {section.title}
        </p>
        {section.items?.length ? (
          <div className="flex flex-wrap gap-2">
            {section.items.map((item, i) => (
              <Badge key={i} variant={section.danger ? "danger" : "default"} size="md">
                {item}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">None listed</p>
        )}
      </Card>
    ))}

    {medicalInfo?.emergency_notes && (
      <Card padding="sm" className="!p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
          Notes for responders
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {medicalInfo.emergency_notes}
        </p>
      </Card>
    )}
  </div>
);

export const ContactsPanel = ({ contacts, onEdit }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">Emergency contacts</h3>
      <Button variant="ghost" size="sm" icon={Pencil} onClick={onEdit}>
        Manage
      </Button>
    </div>

    {contacts.length === 0 ? (
      <EmptyState
        icon={Users}
        title="No contacts yet"
        description="Add people who should be notified during an SOS."
        actionLabel="Add contacts"
        onAction={onEdit}
      />
    ) : (
      <div className="space-y-3">
        {contacts.map((c) => (
          <Card
            key={c.id}
            padding="sm"
            className={`!p-4 ${c.is_primary ? "ring-2 ring-health-500/30" : ""}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-health-100 dark:bg-health-950/40 text-health-700 dark:text-health-400 font-bold flex items-center justify-center shrink-0">
                {c.name?.charAt(0) || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-slate-900 dark:text-white">{c.name}</p>
                  {c.is_primary && <Badge variant="brand" size="sm">Primary</Badge>}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{c.relationship}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{c.phone || "No phone"}</p>
              </div>
            </div>
            {c.phone && (
              <div className="flex gap-2 mt-3">
                <a href={`tel:${c.phone}`} className="flex-1">
                  <Button variant="secondary" size="sm" icon={Phone} className="w-full">
                    Call
                  </Button>
                </a>
                <a href={`sms:${c.phone}`} className="flex-1">
                  <Button variant="outline" size="sm" icon={MessageSquare} className="w-full">
                    SMS
                  </Button>
                </a>
              </div>
            )}
          </Card>
        ))}
      </div>
    )}
  </div>
);

export const HospitalsPanel = ({ hospitals, currentLocation, onRequestLocation, onDispatch }) => {
  if (!currentLocation) {
    return (
      <EmptyState
        icon={MapPin}
        title="Location required"
        description="Enable location to find hospitals and dispatch ambulances near you."
        actionLabel="Enable location"
        onAction={onRequestLocation}
      />
    );
  }

  if (!hospitals?.length) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 animate-pulse">
          <Building2 className="w-6 h-6 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Searching nearby hospitals…</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {hospitals.map((h, i) => (
        <Card key={i} padding="sm" className="!p-4">
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-8 h-8 rounded-lg bg-health-600 text-white text-sm font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-white">
                {h.name?.split(",").slice(0, 2).join(",")}
              </p>
              <Badge variant="success" size="sm" className="mt-1">
                {h.distance} away
              </Badge>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="danger" size="sm" icon={Ambulance} onClick={onDispatch} className="flex-1">
              Ambulance
            </Button>
            <a
              href={`https://maps.google.com/?q=${h.latitude},${h.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1"
            >
              <Button variant="outline" size="sm" icon={Navigation} className="w-full">
                Directions
              </Button>
            </a>
          </div>
        </Card>
      ))}
      <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl px-3 py-2">
        In a life-threatening emergency, call <strong>108</strong> immediately.
      </p>
    </div>
  );
};
