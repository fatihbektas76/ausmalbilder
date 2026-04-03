interface SeoTextProps {
  title: string;
  content: string;
}

export default function SeoText({ title, content }: SeoTextProps) {
  const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h2 className="mb-6 text-xl font-medium text-brand-indigo sm:text-2xl">
        {title}
      </h2>
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-sm leading-relaxed text-gray-700 sm:text-base"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
