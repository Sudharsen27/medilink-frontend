import React from "react";
import { Calendar } from "lucide-react";
import Button from "../ui/Button";

const CalendarLinkButton = ({
  calendarLink,
  className = "",
  size = "sm",
  variant = "outline",
  label = "Open in Google Calendar",
}) => {
  if (!calendarLink) return null;

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      icon={Calendar}
      className={className}
      onClick={() =>
        window.open(calendarLink, "_blank", "noopener,noreferrer")
      }
    >
      {label}
    </Button>
  );
};

export default CalendarLinkButton;
