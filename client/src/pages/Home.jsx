import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Box, ArrowRight } from 'lucide-react';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)', padding: '2rem', textAlign: 'center' }}>
      <Box size={80} color="var(--accent-color)" style={{ marginBottom: '2rem' }} />
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(to right, #58a6ff, #1f6feb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Visualize 3D Models in the Browser
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: 1.6 }}>
        Upload your .glb and .gltf files. Interact with them immediately. Save your camera angles. All seamlessly synced to the cloud.
      </p>
      
      {user ? (
        <Link to="/dashboard" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
          Go to Dashboard <ArrowRight size={20} />
        </Link>
      ) : (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Get Started <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Log In
          </Link>
        </div>
      )}
    </div>
  );
}
