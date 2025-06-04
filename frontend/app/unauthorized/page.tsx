// app/unauthorized/page.tsx
export default function Unauthorized() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-2">401 - Unauthorized</h1>
        <p className="text-gray-600">You must be logged in to view this page.</p>
      </div>
    </div>
  );
}
