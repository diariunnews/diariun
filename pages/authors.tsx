import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthorsGrid from "../components/AuthorsGrid";

const authors = [
  {
    id: "author_001",
    name: "Carol Holt",
    bio: "Health & Wellness",
    photo: "/authors/female-114.jpg",
  },
  {
    id: "author_002",
    name: "Daniel Reyes",
    bio: "Finance & Investing",
    photo: "/authors/male-001.jpg",
  },
  {
    id: "author_003",
    name: "Aisha Khan",
    bio: "Tech & Innovation",
    photo: "/authors/female-115.jpg",
  },
  {
    id: "author_004",
    name: "Javier López",
    bio: "Politics & Society",
    photo: "/authors/male-002.jpg",
  },
  {
    id: "author_005",
    name: "Emily Zhang",
    bio: "Culture & Media",
    photo: "/authors/female-116.jpg",
  },
];

export default function AuthorsPage() {
  return (
    <>
      <Header />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Our Authors</h1>
        <AuthorsGrid authors={authors} />
      </main>
      <Footer />
    </>
  );
}
