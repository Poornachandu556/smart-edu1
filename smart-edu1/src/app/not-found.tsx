export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-600/20 text-primary-700">404</div>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="mt-2 opacity-80">The page you are looking for does not exist.</p>
        <a href="/" className="mt-4 inline-block btn-primary">Go Home</a>
      </div>
    </div>
  );
}


