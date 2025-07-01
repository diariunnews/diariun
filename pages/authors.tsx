import dynamic from "next/dynamic";

const AuthorsGrid = dynamic(() => import("../components/AuthorsGrid"), {
  ssr: false,
});

export default function AuthorsPage() {
  return (
    <main>
      <h1 className="text-3xl font-bold text-center my-6">Our Authors</h1>
      <AuthorsGrid />
    </main>
  );
}