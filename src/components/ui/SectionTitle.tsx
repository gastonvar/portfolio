interface SectionTitleProps {
  title: string;
  primaryColor?: string;
  secondaryColor?: string;
  subtitle?: string;
  defaultColor?: string;
  className?: string;
  titleClassName?: string;
  index?: string;
}

export const SectionTitle = ({
  title,
  subtitle,
  className = 'mb-10',
  titleClassName = 'text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl',
  index,
}: SectionTitleProps) => {
  return (
    <div className={className}>
      {index && (
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
          {index}
        </p>
      )}
      <h2 className={titleClassName}>{title}</h2>
      {subtitle && (
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
