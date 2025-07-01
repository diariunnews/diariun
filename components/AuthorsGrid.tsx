import Image from "next/image";

type Author = {
  id: string;
  name: string;
  bio: string;
  photo: string;
};

type Props = {
  authors?: Author[]; // Hacemos authors opcional
};

const AuthorsGrid = ({ authors = [] }: Props) => {
  if (!authors.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No authors found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
      {authors.map((author) => (
        <div
          key={author.id}
          className="bg-white rounded-2xl shadow p-4 flex flex-col items-center text-center"
        >
          <Image
            src={author.photo}
            alt={author.name}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
          <h3 className="mt-4 font-semibold">{author.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{author.bio}</p>
        </div>
      ))}
    </div>
  );
};

export default AuthorsGrid;