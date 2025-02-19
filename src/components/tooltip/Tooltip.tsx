import { Tooltip } from "@nextui-org/react";

interface CustomTooltipTypes {
  content: string;
  trigger: any;
  className?: string;
  isDark?: boolean;
}

export default function CustomTooltip({
  trigger,
  content,
  className,
  isDark,
}: CustomTooltipTypes) {
  return (
    <Tooltip
      content={content}
      className={className}
      color={isDark ? "primary" : "default"}
    >

      {trigger}
    </Tooltip>
  );
}
