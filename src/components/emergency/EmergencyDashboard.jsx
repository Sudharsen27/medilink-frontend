import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  MapPinOff,
  Stethoscope,
  Ambulance,
  Shield,
  Flame,
  Phone,
} from "lucide-react";
import { useEmergency } from "../../context/EmergencyContext";
import PageContainer from "../../ui/PageContainer";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import { Eyebrow, Heading } from "../../ui/Typography";
import { SkeletonScreen, Skeleton } from "../../ui/Skeleton";
import SosButton from "./SosButton";
import EmergencyCountdown from "./EmergencyCountdown";
import EmergencyActive from "./EmergencyActive";
import {
  EmergencyTabBar,
  MedicalInfoPanel,
  ContactsPanel,
  HospitalsPanel,
} from "./EmergencyTabs";
import { MedicalInfoModal, ContactsModal } from "./EmergencyModals";

const QUICK_ACTIONS = [
  {
    id: "doctor",
    icon: Stethoscope,
    label: "Emergency doctor",
    sub: "Video consult",
    accent: "border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "ambulance",
    icon: Ambulance,
    label: "Call ambulance",
    sub: "108",
    accent: "border-rose-200 dark:border-rose-800/50 bg-rose-50/50 dark:bg-rose-950/20",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "police",
    icon: Shield,
    label: "Police",
    sub: "100",
    accent: "border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-950/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "fire",
    icon: Flame,
    label: "Fire dept",
    sub: "101",
    accent: "border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

const EmergencySkeleton = () => (
  <SkeletonScreen label="Loading emergency services" className="space-y-6">
    <Skeleton className="h-14 w-full" rounded="rounded-xl" />
    <Skeleton className="h-80 w-full" rounded="rounded-2xl" />
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24" rounded="rounded-xl" />
      ))}
    </div>
  </SkeletonScreen>
);

const EmergencyDashboard = () => {
  const emergency = useEmergency();
  const {
    emergencyContacts = [],
    medicalInfo = {},
    emergencyMode = false,
    currentLocation = null,
    emergencyServices = [],
    loading = false,
    countdown = 0,
    countdownActive = false,
    startEmergencyCountdown = () => {},
    cancelEmergency = () => {},
    getNearbyHospitals = async () => [],
    updateMedicalInfo = async () => {},
    updateEmergencyContacts = async () => {},
    requestLocation = () => {},
    endEmergency = () => {},
  } = emergency;

  const connectEmergencyDoctor =
    emergency.connectEmergencyDoctor ??
    (() => window.alert("Emergency doctor service not available yet"));

  const dispatchAmbulance =
    emergency.dispatchAmbulance ??
    (() => {
      window.location.href = "tel:108";
    });

  const [activeTab, setActiveTab] = useState("medical");
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);

  const loadHospitals = useCallback(async () => {
    const hospitals = await getNearbyHospitals();
    setNearbyHospitals(hospitals);
  }, [getNearbyHospitals]);

  useEffect(() => {
    if (currentLocation) loadHospitals();
  }, [currentLocation, loadHospitals]);

  const handleQuickAction = (id) => {
    if (id === "doctor") connectEmergencyDoctor();
    else if (id === "ambulance") dispatchAmbulance();
    else if (id === "police") window.location.href = "tel:100";
    else if (id === "fire") window.location.href = "tel:101";
  };

  if (loading) {
    return (
      <PageContainer maxWidth="max-w-3xl">
        <EmergencySkeleton />
      </PageContainer>
    );
  }

  if (countdownActive) {
    return (
      <EmergencyCountdown
        countdown={countdown}
        contacts={emergencyContacts}
        onCancel={cancelEmergency}
      />
    );
  }

  if (emergencyMode) {
    return (
      <EmergencyActive
        currentLocation={currentLocation}
        medicalInfo={medicalInfo}
        nearbyHospitals={nearbyHospitals}
        onConnectDoctor={connectEmergencyDoctor}
        onDispatchAmbulance={dispatchAmbulance}
        onEndEmergency={endEmergency}
      />
    );
  }

  return (
    <PageContainer maxWidth="max-w-4xl" className="pb-8">
      <div className="mb-6 lg:mb-8">
        <Eyebrow>Emergency services</Eyebrow>
        <Heading level={1} className="mt-1">
          Emergency SOS
        </Heading>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          One-tap access to help, contacts, and your medical profile.
        </p>
      </div>

      {/* Status bar */}
      <Card padding="sm" className="!p-3 sm:!p-4 mb-6 w-fit max-w-full">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-health-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-health-500" />
            </span>
            <ShieldCheck className="w-4 h-4 text-health-600 dark:text-health-400" />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              System ready
            </span>
          </div>

          <span
            className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-slate-700 shrink-0"
            aria-hidden="true"
          />

          <div className="flex items-center gap-2">
            {currentLocation ? (
              <>
                <MapPin className="w-4 h-4 text-health-600 dark:text-health-400" />
                <Badge variant="success" size="sm">
                  Location active
                </Badge>
              </>
            ) : (
              <>
                <MapPinOff className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Location required
                </span>
                <Button size="sm" variant="outline" onClick={requestLocation}>
                  Enable
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* SOS + quick actions — side-by-side on desktop */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-6 mb-6">
        <Card
          padding="lg"
          className="!p-6 sm:!p-8 text-center border-rose-200/40 dark:border-rose-900/30 flex flex-col justify-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-400 mb-2">
            Activate assistance
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
            Tap once or press and hold for 3 seconds to start the 5-second countdown.
          </p>
          <SosButton onActivate={startEmergencyCountdown} />
        </Card>

        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Quick emergency access
          </h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.button
                key={action.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleQuickAction(action.id)}
                className={`p-4 rounded-xl border text-left transition-all hover:shadow-soft hover:-translate-y-0.5 h-full ${action.accent}`}
              >
                <action.icon className={`w-6 h-6 mb-2 ${action.iconColor}`} />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{action.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{action.sub}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card padding="md" className="mb-6">
        <EmergencyTabBar active={activeTab} onChange={setActiveTab} />
        <div className="mt-6" role="tabpanel">
          {activeTab === "medical" && (
            <MedicalInfoPanel
              medicalInfo={medicalInfo}
              onEdit={() => setShowMedicalModal(true)}
            />
          )}
          {activeTab === "contacts" && (
            <ContactsPanel
              contacts={emergencyContacts}
              onEdit={() => setShowContactsModal(true)}
            />
          )}
          {activeTab === "hospitals" && (
            <HospitalsPanel
              hospitals={nearbyHospitals}
              currentLocation={currentLocation}
              onRequestLocation={requestLocation}
              onDispatch={() => dispatchAmbulance()}
            />
          )}
        </div>
      </Card>

      {/* National services */}
      {emergencyServices.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Emergency hotlines
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {emergencyServices.map((service) => (
              <Card key={service.id} padding="sm" className="!p-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {service.type}
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                  {service.name}
                </p>
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400 tabular-nums mb-3">
                  {service.number}
                </p>
                <a href={`tel:${service.number}`}>
                  <Button variant="danger" size="sm" icon={Phone} className="w-full">
                    Call
                  </Button>
                </a>
              </Card>
            ))}
          </div>
        </div>
      )}

      <MedicalInfoModal
        open={showMedicalModal}
        onClose={() => setShowMedicalModal(false)}
        medicalInfo={medicalInfo}
        onSave={updateMedicalInfo}
      />

      <ContactsModal
        open={showContactsModal}
        onClose={() => setShowContactsModal(false)}
        contacts={emergencyContacts}
        onSave={updateEmergencyContacts}
      />
    </PageContainer>
  );
};

export default EmergencyDashboard;
