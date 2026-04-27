import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-7xl tracking-wider text-primary">404</h1>
      <p className="text-xl text-white/80 mt-4">We couldn't find that page.</p>
      <Link to="/browse" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
