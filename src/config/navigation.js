import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  HeartPulse,
  MoreHorizontal,
  Video,
  FileText,
  Pill,
  Heart,
  AlertTriangle,
  Bell,
  User,
  UserCircle,
  Users,
  HeartHandshake,
  Settings,
  Shield,
} from "lucide-react";

export const isRouteActive = (pathname, to, end = false) => {
  if (end) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
};

/** Primary bottom tabs — mobile-first (Practo / Apollo style) */
export const bottomNavItems = [
  { id: "home", to: "/dashboard", label: "Home", icon: LayoutDashboard, end: true },
  { id: "visits", to: "/appointments", label: "Visits", icon: Calendar },
  { id: "doctors", to: "/doctors", label: "Doctors", icon: Stethoscope },
  { id: "health", to: "/medical-records", label: "Health", icon: HeartPulse },
  { id: "more", label: "More", icon: MoreHorizontal, isSheet: true },
];

/** Desktop sidebar sections */
export const mainNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/appointments", label: "Appointments", icon: Calendar },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/telemedicine", label: "Telemedicine", icon: Video },
];

export const healthNavItems = [
  { to: "/medical-records", label: "Medical Records", icon: FileText },
  { to: "/prescriptions", label: "Prescriptions", icon: Pill },
  { to: "/favorites", label: "Favorites", icon: Heart, badgeKey: "favorites" },
  { to: "/emergency", label: "Emergency", icon: AlertTriangle },
];

export const accountNavItems = [
  { to: "/profile", label: "My Profile", icon: User },
  { to: "/notifications", label: "Notifications", icon: Bell, badgeKey: "notifications" },
];

export const moreNavItems = [
  { to: "/patient-profile", label: "Patient Profile", icon: UserCircle },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/caregivers", label: "Caregivers", icon: HeartHandshake },
  { to: "/profile", label: "Settings", icon: Settings },
];

/** More sheet sections for mobile overflow menu */
export const moreSheetSections = (user) => [
  {
    title: "Care",
    items: [
      { to: "/telemedicine", label: "Telemedicine", icon: Video, description: "Video consultations" },
      { to: "/prescriptions", label: "Prescriptions", icon: Pill, description: "Active medications" },
      { to: "/favorites", label: "Favorites", icon: Heart, description: "Saved doctors", badgeKey: "favorites" },
      { to: "/emergency", label: "Emergency", icon: AlertTriangle, description: "Urgent help", accent: "rose" },
    ],
  },
  {
    title: "Records & family",
    items: [
      { to: "/patient-profile", label: "Patient Profile", icon: UserCircle, description: "Health profile" },
      { to: "/patients", label: "Patients", icon: Users, description: "Manage patients" },
      { to: "/caregivers", label: "Caregivers", icon: HeartHandshake, description: "Family & caregivers" },
    ],
  },
  {
    title: "Account",
    items: [
      { to: "/profile", label: "My Profile", icon: User, description: "Personal settings" },
      { to: "/notifications", label: "Notifications", icon: Bell, description: "Alerts & updates", badgeKey: "notifications" },
      { to: "/profile", label: "Settings", icon: Settings, description: "App preferences" },
    ],
  },
  ...(user?.role === "admin"
    ? [{
        title: "Administration",
        items: [
          { to: "/admin", label: "Admin Panel", icon: Shield, description: "Platform management", accent: "health" },
        ],
      }]
    : []),
];

/** Routes where mobile chrome (bottom nav, FAB) should hide */
export const hideMobileChromePatterns = [
  /^\/telemedicine\/[^/]+$/,
];

export const shouldHideMobileChrome = (pathname) =>
  hideMobileChromePatterns.some((re) => re.test(pathname));
