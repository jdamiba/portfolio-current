export type ExperienceType = {
  title: string;
  company: string;
  period: string;
  description: string[];
};

export const ExperienceItem = ({
  experience,
}: {
  experience: ExperienceType;
}) => {
  return (
    <div className="relative border-l border-border pl-6 pb-10 last:pb-0">
      <div className="absolute -left-[7px] top-0 h-3.5 w-3.5 rounded-full border border-border bg-background"></div>
      <div>
        <h4 className="text-xl font-bold">{experience.title}</h4>
        <p className="text-muted-foreground">
          {experience.company} • {experience.period}
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {experience.description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
