import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useModelStore from '../store/useModelStore';
import { UploadCloud, Box, File, X, CheckCircle, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { models, fetchModels, uploadModel, isLoading, error } = useModelStore();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Two-step upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [modelName, setModelName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchModels(user.token);
    }
  }, [user, navigate, fetchModels]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setModelName(''); // Reset name field optionally
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    try {
      const storedModel = await uploadModel(selectedFile, modelName || selectedFile.name, user.token);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedFile(null);
        navigate(`/model/${storedModel._id}`);
      }, 1500); // Wait 1.5s to show success feedback before navigating
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setModelName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to permanently delete this model?")) {
      try {
        await useModelStore.getState().deleteModel(id, user.token);
      } catch (err) {
        alert("Failed to delete the model.");
      }
    }
  };

  return (
    <div className="dashboard-container" style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>My Workspace</h1>
      
      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', padding: '1rem', background: 'rgba(248, 81, 73, 0.1)', borderRadius: '8px' }}>{error}</div>}

      <div className="glass-card" style={{ maxWidth: '100%', marginBottom: '3rem', position: 'relative' }}>
        <h2>Upload New Model</h2>
        
        {uploadSuccess ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', animation: 'slideUp 0.3s ease-out' }}>
            <CheckCircle size={64} color="#2ea043" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: '#2ea043' }}>Upload Successful!</h3>
            <p style={{ color: 'var(--text-muted)' }}>Preparing your 3D workspace...</p>
          </div>
        ) : !selectedFile ? (
          <div 
            className="upload-zone"
            onClick={() => fileInputRef.current.click()}
          >
            <UploadCloud size={48} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
            <h3>Click to Upload or Drag & Drop</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Supports .glb format</p>
          </div>
        ) : (
          <div style={{ padding: '1.5rem', background: 'rgba(13, 17, 23, 0.5)', borderRadius: '12px', border: '1px solid var(--border-color)', animation: 'slideUp 0.3s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'var(--panel-bg)', borderRadius: '8px' }}>
                  <File size={32} color="var(--accent-color)" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedFile.name}</h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={resetSelection} className="btn" style={{ width: 'auto', padding: '0.5rem', background: 'transparent', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            <div className="form-group">
              <label>Model Name (Optional)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Give your 3D model a catchy name" 
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>
            
            <button 
              className="btn btn-primary" 
              onClick={handleUploadSubmit}
              disabled={isLoading}
              style={{ marginTop: '1rem' }}
            >
              {isLoading ? <div className="loader"></div> : <><UploadCloud size={18} /> Save & Upload to Workspace</>}
            </button>
          </div>
        )}

        <input 
          type="file" 
          accept=".glb" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </div>

      <h2>Your Models</h2>
      {models.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem', padding: '2rem', border: '1px dashed var(--border-color)', borderRadius: '12px', width: '100%', textAlign: 'center' }}>
          You haven't uploaded any models yet. Try uploading one above!
        </p>
      ) : (
        <div className="model-grid">
          {models.map((model) => (
            <div 
              key={model._id} 
              className="model-card"
              onClick={() => navigate(`/model/${model._id}`)}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
            >
              <button 
                onClick={(e) => handleDelete(e, model._id)}
                style={{ 
                  position: 'absolute', top: '10px', right: '10px', 
                  background: 'rgba(248, 81, 73, 0.2)', color: 'var(--error)', 
                  border: 'none', borderRadius: '50%', padding: '8px', 
                  cursor: 'pointer', zIndex: 5, transition: 'all 0.2s' 
                }}
                className="delete-btn"
                title="Delete Model"
              >
                <Trash2 size={16} />
              </button>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                <Box size={48} color="var(--accent-color)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', wordBreak: 'break-word' }}>{model.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 'auto' }}>
                Uploaded: {new Date(model.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
