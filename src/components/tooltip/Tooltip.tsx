import { Tooltip } from "@nextui-org/react";

interface CustomTooltipTypes {
  content: string;
  trigger: any;
  className?: string;
}

export default function CustomTooltip({
  trigger,
  content,
  className,
}: CustomTooltipTypes) {
  return (
    <Tooltip content={content} className={className}>
      {trigger}
    </Tooltip>
  );
}
