import React, { useState } from "react";
import {
  Stethoscope,
  Ambulance,
  MapPin,
  ExternalLink,
  Building2,
} from "lucide-react";
import Button from "../../ui/Button";
import Card, { CardHeader } from "../../ui/Card";
import Badge from "../../ui/Badge";

const EmergencyActive = ({
  currentLocation,
  medicalInfo,
  nearbyHospitals,
  onConnectDoctor,
  onDispatchAmbulance,
  onEndEmergency,
}) => {
  const [showLocation, setShowLocation] = useState(true);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--app-bg)] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-6 pb-24">
        <Card variant="elevated" className="!p-6 text-center border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20">
          <Badge variant="danger" dot className="mb-3">
            Live emergency
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-rose-600 dark:text-rose-400">
            Emergency in progress
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Stay calm. Help is on the way.
          </p>
          {onEndEmergency && (
            <Button variant="ghost" size="sm" onClick={onEndEmergency} className="mt-4">
              End emergency mode
            </Button>
          )}
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: Stethoscope,
              title: "Emergency doctor",
              desc: "Video consult now",
              action: onConnectDoctor,
              label: "Connect",
            },
            {
              icon: Ambulance,
              title: "Ambulance",
              desc: "Dispatch to your location",
              action: () => onDispatchAmbulance(),
              label: "Dispatch",
            },
            {
              icon: MapPin,
              title: "Your location",
              desc: "Share with responders",
              action: () => setShowLocation((v) => !v),
              label: showLocation ? "Hide" : "Show",
            },
          ].map((item) => (
            <Card key={item.title} padding="sm" className="!p-4 flex flex-col">
              <item.icon className="w-6 h-6 text-health-600 dark:text-health-400 mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3 flex-1">{item.desc}</p>
              <Button size="sm" variant="danger" onClick={item.action} className="w-full">
                {item.label}
              </Button>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showLocation && (
            <Card padding="md">
              <CardHeader title="Your location" className="!mb-4" />
              {currentLocation ? (
                <>
                  <div className="font-mono text-xs text-slate-600 dark:text-slate-400 space-y-1 mb-4">
                    <p>Lat: {currentLocation.latitude.toFixed(6)}</p>
                    <p>Lng: {currentLocation.longitude.toFixed(6)}</p>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${currentLocation.latitude},${currentLocation.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm" icon={ExternalLink} className="w-full">
                      Open in Maps
                    </Button>
                  </a>
                </>
              ) : (
                <p className="text-sm text-slate-500">Location unavailable</p>
              )}
            </Card>
          )}

          <Card padding="md">
            <CardHeader title="Medical snapshot" className="!mb-4" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Blood type</dt>
                <dd className="font-medium text-slate-900 dark:text-white">
                  {medicalInfo?.blood_type || "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Allergies</dt>
                <dd className="font-medium text-slate-900 dark:text-white text-right">
                  {medicalInfo?.allergies?.length ? medicalInfo.allergies.join(", ") : "None"}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Conditions</dt>
                <dd className="font-medium text-slate-900 dark:text-white text-right">
                  {medicalInfo?.conditions?.length ? medicalInfo.conditions.join(", ") : "None"}
                </dd>
              </div>
            </dl>
          </Card>
        </div>

        {nearbyHospitals?.length > 0 && (
          <Card padding="md">
            <CardHeader title="Nearest hospitals" subtitle="Dispatch ambulance to facility" className="!mb-4" />
            <div className="space-y-3">
              {nearbyHospitals.slice(0, 3).map((h, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50"
                >
                  <Building2 className="w-5 h-5 text-health-600 shrink-0 hidden sm:block" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                      {h.name?.split(",")[0]}
                    </p>
                    <p className="text-xs text-health-600 dark:text-health-400">{h.distance} away</p>
                  </div>
                  <Button size="sm" variant="danger" onClick={() => onDispatchAmbulance()}>
                    Send ambulance
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card padding="md" className="border-health-200/50 dark:border-health-800/40 bg-health-50/30 dark:bg-health-950/20">
          <h3 className="text-sm font-semibold text-health-800 dark:text-health-300 mb-3">
            What to do now
          </h3>
          <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal list-inside">
            <li>Stay where you are if it&apos;s safe</li>
            <li>Keep your phone nearby and charged</li>
            <li>Unlock your door for emergency services if possible</li>
            <li>Have ID and insurance ready</li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyActive;
