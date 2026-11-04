import Link from 'next/link';

type NewsCardProps = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
};

export default function NewsCard({ slug, title, summary, category, date }: NewsCardProps) {
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <span className="text-cortum-accent text-xs uppercase">{category}</span>
      <Link href={`/news/${slug}`}>
        <h3 className="text-xl font-semibold mt-1 hover:text-cortum-accent transition">{title}</h3>
      </Link>
      <p className="text-cortum-gray mt-1 line-clamp-2">{summary}</p>
      <span className="text-xs text-cortum-gray mt-2 block">{date}</span>
    </div>
  );
}
