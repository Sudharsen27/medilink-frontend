import React, { useState } from "react";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Select from "../../ui/Select";
import Badge from "../../ui/Badge";

export const MedicalInfoModal = ({
  open,
  onClose,
  medicalInfo,
  onSave,
}) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(medicalInfo || {});

  React.useEffect(() => {
    if (open) {
      setForm(medicalInfo || {});
      setEditing(false);
    }
  }, [open, medicalInfo]);

  const splitField = (key, value) =>
    setForm({
      ...form,
      [key]: value.split(",").map((s) => s.trim()).filter(Boolean),
    });

  return (
    <Modal
      open={open}
      onClose={() => {
        setEditing(false);
        onClose();
      }}
      title="Medical information"
      description="Shared with first responders during SOS"
      size="lg"
      footer={
        editing ? (
          <>
            <Button variant="secondary" className="flex-1" onClick={() => setEditing(false)}>
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={async () => {
                await onSave(form);
                setEditing(false);
                onClose();
              }}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              Close
            </Button>
            <Button className="flex-1" onClick={() => setEditing(true)}>
              Edit information
            </Button>
          </>
        )
      }
    >
      {editing ? (
        <div className="space-y-4">
          <Select
            label="Blood type"
            value={form.blood_type || ""}
            onChange={(e) => setForm({ ...form, blood_type: e.target.value })}
          >
            <option value="">Select</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Input
            label="Primary doctor"
            value={form.doctor_name || ""}
            onChange={(e) => setForm({ ...form, doctor_name: e.target.value })}
          />
          <Input
            label="Doctor phone"
            type="tel"
            value={form.doctor_phone || ""}
            onChange={(e) => setForm({ ...form, doctor_phone: e.target.value })}
          />
          <Input
            label="Allergies (comma separated)"
            value={form.allergies?.join(", ") || ""}
            onChange={(e) => splitField("allergies", e.target.value)}
          />
          <Input
            label="Conditions (comma separated)"
            value={form.conditions?.join(", ") || ""}
            onChange={(e) => splitField("conditions", e.target.value)}
          />
          <Input
            label="Medications (comma separated)"
            value={form.medications?.join(", ") || ""}
            onChange={(e) => splitField("medications", e.target.value)}
          />
          <Textarea
            label="Emergency notes"
            rows={3}
            value={form.emergency_notes || ""}
            onChange={(e) => setForm({ ...form, emergency_notes: e.target.value })}
          />
          <Input
            label="Insurance provider"
            value={form.insurance_provider || ""}
            onChange={(e) => setForm({ ...form, insurance_provider: e.target.value })}
          />
          <Input
            label="Policy number"
            value={form.insurance_id || ""}
            onChange={(e) => setForm({ ...form, insurance_id: e.target.value })}
          />
        </div>
      ) : (
        <dl className="space-y-3 text-sm">
          {[
            ["Blood type", medicalInfo?.blood_type],
            ["Doctor", medicalInfo?.doctor_name],
            ["Allergies", medicalInfo?.allergies?.join(", ") || "None"],
            ["Conditions", medicalInfo?.conditions?.join(", ") || "None"],
            ["Medications", medicalInfo?.medications?.join(", ") || "None"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-900 dark:text-white text-right">{value || "—"}</dd>
            </div>
          ))}
        </dl>
      )}
    </Modal>
  );
};

export const ContactsModal = ({ open, onClose, contacts, onSave }) => {
  const [local, setLocal] = useState([]);
  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: "Family",
    is_primary: false,
  });

  React.useEffect(() => {
    if (open) setLocal([...contacts]);
  }, [open, contacts]);

  const addContact = () => {
    if (!draft.name || !draft.phone) return;
    const next = draft.is_primary
      ? local.map((c) => ({ ...c, is_primary: false }))
      : [...local];
    next.push({ ...draft, id: Date.now() });
    setLocal(next);
    setDraft({ name: "", phone: "", email: "", relationship: "Family", is_primary: false });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Emergency contacts"
      description="Primary contact is notified first during SOS"
      size="lg"
      footer={
        <>
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={async () => {
              await onSave(local);
              onClose();
            }}
          >
            Save contacts
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Add contact</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Full name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
            <Input
              placeholder="Phone"
              type="tel"
              value={draft.phone}
              onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            />
          </div>
          <Select
            value={draft.relationship}
            onChange={(e) => setDraft({ ...draft, relationship: e.target.value })}
            options={[
              { value: "Family", label: "Family" },
              { value: "Friend", label: "Friend" },
              { value: "Doctor", label: "Doctor" },
              { value: "Other", label: "Other" },
            ]}
          />
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.is_primary}
              onChange={(e) => setDraft({ ...draft, is_primary: e.target.checked })}
              className="rounded border-slate-300"
            />
            Set as primary contact
          </label>
          <Button size="sm" variant="outline" onClick={addContact} className="w-full sm:w-auto">
            Add contact
          </Button>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto">
          {local.map((c, i) => (
            <div
              key={c.id ?? i}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/50"
            >
              <div>
                <p className="font-medium text-sm text-slate-900 dark:text-white">{c.name}</p>
                <p className="text-xs text-slate-500">{c.phone} · {c.relationship}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {c.is_primary && <Badge variant="brand" size="sm">Primary</Badge>}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const next = local.filter((_, idx) => idx !== i);
                    setLocal(next);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
