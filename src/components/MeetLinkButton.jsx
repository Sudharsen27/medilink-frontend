import React from "react";
import { Video } from "lucide-react";
import Button from "../ui/Button";

const MeetLinkButton = ({
  meetLink,
  className = "",
  size = "sm",
  variant = "primary",
  label = "Join Google Meet",
}) => {
  if (!meetLink) return null;

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      icon={Video}
      className={className}
      onClick={() => window.open(meetLink, "_blank", "noopener,noreferrer")}
    >
      {label}
    </Button>
  );
};

export default MeetLinkButton;
