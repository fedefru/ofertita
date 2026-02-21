export default function OfferLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">

        {/* Back link skeleton */}
        <div className="mb-8 h-4 w-28 animate-pulse rounded bg-[#E2E8F0]" />

        {/* Hero image skeleton */}
        <div className="mb-8 aspect-video w-full animate-pulse rounded-[24px] bg-[#E2E8F0]" />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">

          {/* Left */}
          <div className="space-y-5 md:col-span-3">
            <div className="h-6 w-20 animate-pulse rounded-full bg-[#E2E8F0]" />
            <div className="space-y-2">
              <div className="h-8 w-full animate-pulse rounded-xl bg-[#E2E8F0]" />
              <div className="h-8 w-3/4 animate-pulse rounded-xl bg-[#E2E8F0]" />
            </div>
            <div className="h-10 w-32 animate-pulse rounded bg-[#E2E8F0]" />
            <div className="h-8 w-40 animate-pulse rounded-full bg-[#E2E8F0]" />
            <div className="space-y-2 border-t border-[rgba(15,23,42,0.06)] pt-5">
              <div className="h-4 w-full animate-pulse rounded bg-[#E2E8F0]" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-[#E2E8F0]" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-[#E2E8F0]" />
            </div>
          </div>

          {/* Right — business card */}
          <div className="md:col-span-2">
            <div
              className="overflow-hidden rounded-[20px] bg-white"
              style={{ boxShadow: '0 2px 16px rgba(99,102,241,0.08), 0 1px 4px rgba(15,23,42,0.05)' }}
            >
              <div className="flex items-center gap-3.5 p-5">
                <div className="h-[52px] w-[52px] animate-pulse rounded-2xl bg-[#E2E8F0]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-[#E2E8F0]" />
                  <div className="h-3 w-20 animate-pulse rounded bg-[#E2E8F0]" />
                </div>
              </div>
              <div className="mx-5 h-px bg-[rgba(15,23,42,0.06)]" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-full animate-pulse rounded bg-[#E2E8F0]" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-[#E2E8F0]" />
              </div>
              <div className="px-4 pb-4">
                <div className="h-11 w-full animate-pulse rounded-[14px] bg-[#E2E8F0]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
