// Shown by Next.js App Router while the events server component fetches data
export default function EventsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* PageIntro skeleton */}
      <div className="mb-10 flex flex-col gap-3">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-9 w-44 rounded" />
        <div className="skeleton h-4 w-72 rounded" />
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card-cartoon bg-white overflow-hidden">
            <div className="skeleton aspect-video w-full rounded-none" />
            <div className="p-5 flex flex-col gap-3">
              <div className="skeleton h-5 w-48 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-4/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
