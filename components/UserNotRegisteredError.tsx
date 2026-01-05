export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          Account Setup Required
        </h1>
        <p className="text-neutral-600 mb-6">
          We couldn't find your profile. Please try logging in again or contact support if the problem persists.
        </p>
        <a
          href="/auth/login"
          className="btn-primary inline-block"
        >
          Return to Login
        </a>
      </div>
    </div>
  );
}
