interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeading({ title, subtitle }: HeaderProps) {
  return (
    <div className="page-header-banner flex w-full justify-center bg-cover bg-center bg-no-repeat pb-10 pt-6 md:pt-8 lg:pb-14 lg:pt-10 xl:pb-20 xl:pt-16">
      <div className="relative flex w-full flex-col items-center justify-center text-center">
        <h2
          id="h2-help"
          className="mb-3 text-center text-xl font-medium text-dark dark:text-light md:mb-4 md:text-[22px] xl:mb-3 3xl:mb-4"
        >
          {title}
        </h2>
        {subtitle && <p className="font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}
