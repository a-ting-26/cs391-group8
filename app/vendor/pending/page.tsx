// app/organizer/pending/page.tsx
export default function OrganizerPendingPage() {
    return (
      <div className="min-h-screen grid place-items-center bg-emerald-50 px-6">
        <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">Application Submitted</h1>
          <p className="text-gray-700">
            Thanks! A SparkBytes admin will review your organizer application. We’ll notify you once it’s approved.
          </p>
        </div>
      </div>
    );
  }
  