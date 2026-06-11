import React from "react";
import { typeScale } from "../design-system/tokens";
import cn from "../lib/cn";

const colorMap = {
  primary: "text-slate-900 dark:text-white",
  secondary: "text-slate-600 dark:text-slate-400",
  muted: "text-slate-500 dark:text-slate-400",
  accent: "text-health-600 dark:text-health-400",
  danger: "text-clinical-rose",
  inherit: "",
};

const variantMap = {
  display: typeScale.display.class,
  h1: typeScale.h1.class,
  h2: typeScale.h2.class,
  h3: typeScale.h3.class,
  h4: typeScale.h4.class,
  body: typeScale.body.class,
  bodyLg: typeScale.bodyLg.class,
  caption: typeScale.caption.class,
  eyebrow: `${typeScale.eyebrow.class} text-health-600 dark:text-health-400`,
  label: `${typeScale.label.class} text-slate-700 dark:text-slate-300`,
};

const defaultElements = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  bodyLg: "p",
  caption: "span",
  eyebrow: "p",
  label: "label",
};

export const Text = ({
  as: Component = "p",
  variant = "body",
  color = "secondary",
  balance = false,
  className = "",
  children,
  ...props
}) => (
  <Component
    className={cn(
      variantMap[variant] || variantMap.body,
      colorMap[color],
      balance && "text-balance",
      className
    )}
    {...props}
  >
    {children}
  </Component>
);

export const Heading = ({
  level = 2,
  variant,
  color = "primary",
  balance = true,
  className = "",
  children,
  ...props
}) => {
  const v = variant || `h${level}`;
  const Component = defaultElements[v] || `h${level}`;
  return (
    <Component
      className={cn(
        variantMap[v] || typeScale.h2.class,
        colorMap[color],
        balance && "text-balance",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export const Eyebrow = ({ className = "", children, ...props }) => (
  <p className={cn(variantMap.eyebrow, className)} {...props}>
    {children}
  </p>
);

export const Label = ({ htmlFor, required, className = "", children, ...props }) => (
  <label
    htmlFor={htmlFor}
    className={cn(variantMap.label, className)}
    {...props}
  >
    {children}
    {required && (
      <span className="text-clinical-rose ml-0.5" aria-hidden="true">
        *
      </span>
    )}
  </label>
);

export const Caption = ({ className = "", children, ...props }) => (
  <span className={cn(typeScale.caption.class, "text-slate-500 dark:text-slate-400", className)} {...props}>
    {children}
  </span>
);

export default Text;
