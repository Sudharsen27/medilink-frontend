/**
 * MediLink Design System — public API
 *
 * Usage:
 *   import { tokens, Button, Modal, Heading } from '../design-system';
 *   import { palette, typeScale } from '../design-system/tokens';
 */

// ─── Tokens ───
export * from "./tokens";

// ─── UI Primitives (re-exported from src/ui) ───
export { default as Button } from "../ui/Button";
export { default as Card, CardHeader } from "../ui/Card";
export { default as Input } from "../ui/Input";
export { default as Textarea } from "../ui/Textarea";
export { default as Select } from "../ui/Select";
export { default as SearchInput } from "../ui/SearchInput";
export { default as FormField } from "../ui/FormField";
export { default as Modal } from "../ui/Modal";
export { default as Sheet } from "../ui/Sheet";
export { default as Badge, StatusBadge } from "../ui/Badge";
export { default as Chip } from "../ui/Chip";
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCard,
} from "../ui/Table";
export {
  Text,
  Heading,
  Eyebrow,
  Label,
  Caption,
} from "../ui/Typography";
export {
  notify,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  ToastProvider,
  toastConfig,
} from "../ui/Toast";
export {
  SideNavLink,
  BottomNavTab,
  NavSection,
  SheetNavRow,
} from "../ui/navigation/NavItem";
export { default as ChartContainer, chartSeries as chartColors } from "../ui/charts/ChartContainer";
export { default as EmptyState } from "../ui/EmptyState";
export { default as PageContainer } from "../ui/PageContainer";

