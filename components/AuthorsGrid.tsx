import Image from "next/image";

type Author = {
  id: string;
  name: string;
  bio: string;
  photo: string;
  specialty?: string;
  country?: string;
};

type Props = {
  authors: Author[];
};

export default function AuthorsGrid({ authors }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Our Authors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {authors.map((author) => (
          <div
            key={author.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition p-4 text-center"
          >
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <Image
                src={author.photo}
                alt={author.name}
                width={128}
                height={128}
                className="rounded-full object-cover w-32 h-32"
              />
            </div>
            <h2 className="text-lg font-semibold">{author.name}</h2>
            {author.specialty && (
              <p className="text-sm text-gray-500 mt-1">{author.specialty}</p>
            )}
            {author.country && (
              <p className="text-sm text-gray-400">{author.country}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">{author.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}