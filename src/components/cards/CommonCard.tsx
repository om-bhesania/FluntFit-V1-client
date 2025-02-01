import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { ReactNode } from "react";

interface CommonCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  classNames?: {
    base?: string;
    header?: string;
    body?: string;
  };
}

const CommonCard: React.FC<CommonCardProps> = ({
  title,
  children,
  className = "",
  classNames = {},
}) => {
  return (
    <Card
      className={`mb-6 z-[5] ${className}`}
      classNames={{
        base: classNames.base || "z-[1] text-gray-300 bg-gray-960",
      }}
    >
      {title && (
        <CardHeader className={classNames.header || ""}>
          <h2 className="text-lg font-semibold">{title}</h2>
        </CardHeader>
      )}
      <CardBody className={classNames.body || ""}>{children}</CardBody>
    </Card>
  );
};

export default CommonCard;
