interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title: string;
  items: FaqItem[];
}

export default function FaqSection({ title, items }: FaqSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h2 className="mb-6 text-xl font-semibold text-brand-indigo md:text-2xl">
        {title}
      </h2>

      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-[#1D1448]/10 bg-brand-white"
          >
            <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-brand-indigo select-none md:text-base">
              {item.question}
            </summary>
            <div className="px-5 pb-4 text-sm leading-relaxed text-[#1D1448]/70">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
