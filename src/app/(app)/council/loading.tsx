// Shown by Next.js App Router while the council server component fetches data
export default function CouncilLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* PageIntro skeleton */}
      <div className="mb-10 flex flex-col gap-3">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton h-9 w-52 rounded" />
        <div className="skeleton h-4 w-80 rounded" />
      </div>

      {/* Tab strip skeleton */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[120, 160, 150].map((w, i) => (
          <div key={i} className="skeleton h-10 rounded-xl" style={{ width: w }} />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card-cartoon bg-white overflow-hidden">
            <div className="skeleton aspect-square w-full rounded-none" />
            <div className="p-5 flex flex-col gap-3">
              <div className="skeleton h-5 w-40 rounded" />
              <div className="skeleton h-3 w-28 rounded" />
              <div className="skeleton h-3 w-32 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
