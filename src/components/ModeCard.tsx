import Link from 'next/link';

export default function ModeCard({
  title,
  description,
  href,
  color,
}: {
  title: string;
  description: string;
  href: string;
  color: 'blue' | 'green';
}) {
  const bg = color === 'blue' ? 'bg-blue-100 hover:bg-blue-200' : 'bg-green-100 hover:bg-green-200';
  return (
    <Link href={href} className={`${bg} p-6 rounded-2xl shadow-md transition block`}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-gray-700">{description}</p>
    </Link>
  );
}
