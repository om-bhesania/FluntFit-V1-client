
function SectionTitle({
  title,
  isLeft = false,
  description, 
}: {
  title: string;
  isLeft?: boolean;
  description?: string;
  viewAll?: boolean;
  url?: string;
}) {
  return (
    <div className={`${isLeft ? "text-left" : "text-center"} mb-6`}>
      <div className={`flex items-center justify-center w-full`}>
        <div className="flex items-center flex-col">
          <div className="md:text-4xl text-xl font-semibold font-secondary">
            {title}
          </div>
          {description && <div className="items-start font-heading">{description}</div>}
        </div>
      </div>
    </div>
  );
}

export default SectionTitle;
