import AuthorsGrid from "../components/AuthorsGrid";

const authors = [
  {
    id: "author_001",
    name: "Carol Holt",
    specialty: "Health & Wellness",
    image: "/authors/female-114.jpg",
  },
  {
    id: "author_002",
    name: "Daniel Reyes",
    specialty: "Finance & Investing",
    image: "/authors/male-001.jpg",
  },
  {
    id: "author_003",
    name: "Aisha Khan",
    specialty: "Tech & Innovation",
    image: "/authors/female-115.jpg",
  },
  {
    id: "author_004",
    name: "Javier López",
    specialty: "Politics & Society",
    image: "/authors/male-002.jpg",
  },
  {
    id: "author_005",
    name: "Emily Zhang",
    specialty: "Culture & Media",
    image: "/authors/female-116.jpg",
  },
];

export default function AuthorsPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Our Authors</h1>
      <AuthorsGrid authors={authors} />
    </main>
  );
}