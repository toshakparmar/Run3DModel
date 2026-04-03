import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useModelStore from '../store/useModelStore';
import ThreeCanvas from '../components/ThreeCanvas';
import { Save, ArrowLeft, Check, AlertCircle } from 'lucide-react';

export default function Viewer() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { currentModel, fetchModelById, updateCameraState, isLoading, error } = useModelStore();
  const navigate = useNavigate();
  
  const [localCameraState, setLocalCameraState] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'success' | 'error'

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchModelById(id, user.token);
    }
  }, [id, user, navigate, fetchModelById]);

  // Debounced save to avoid spamming the API
  const handleCameraChange = (newState) => {
    setLocalCameraState(newState);
  };

  const handleManualSave = async () => {
    if (localCameraState) {
      setSaveStatus('saving');
      try {
        await updateCameraState(id, localCameraState, user.token);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000); // revert back to idle after 2s
      } catch (err) {
        console.error(err);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }
  };

  if (isLoading || !currentModel) {
    return (
      <div className="viewer-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader" style={{ width: '48px', height: '48px' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="viewer-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--error)' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="viewer-container">
      {/* Overlay UI */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
        <button className="btn btn-outline" onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem 1rem', background: 'var(--panel-bg)', backdropFilter: 'blur(12px)' }}>
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, background: 'var(--panel-bg)', padding: '0.5rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backdropFilter: 'blur(12px)' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{currentModel.name}</h3>
      </div>

      {/* Save Status Popup / Toast */}
      {saveStatus !== 'idle' && (
        <div style={{
          position: 'absolute', top: '5rem', right: '1rem', zIndex: 20,
          background: saveStatus === 'error' ? 'var(--error)' : 'var(--panel-bg)',
          color: saveStatus === 'success' ? '#2ea043' : (saveStatus === 'error' ? '#fff' : 'var(--text-main)'),
          border: '1px solid',
          borderColor: saveStatus === 'success' ? '#2ea043' : (saveStatus === 'error' ? 'transparent' : 'var(--border-color)'),
          padding: '0.8rem 1.2rem', borderRadius: '8px', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          boxShadow: 'var(--shadow-md)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {saveStatus === 'success' && <><Check size={18} /> View saved successfully!</>}
          {saveStatus === 'saving' && <><div className="loader" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div> Saving View...</>}
          {saveStatus === 'error' && <><AlertCircle size={18} /> Failed to save view.</>}
        </div>
      )}

      <div className="floating-controls">
        <button 
          className="btn btn-primary" 
          onClick={handleManualSave}
          disabled={!localCameraState || saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="loader" style={{ width: '16px', height: '16px', margin: 0 }}></div> Saving...
            </div>
          ) : (
            <><Save size={18} /> Save View</>
          )}
        </button>
      </div>

      {/* 3D Canvas Context */}
      <ThreeCanvas 
        modelUrl={currentModel.filePath} 
        cameraState={currentModel.cameraState}
        onCameraSave={handleCameraChange}
      />
    </div>
  );
}
