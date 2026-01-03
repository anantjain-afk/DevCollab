// src/components/SnippetList.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  fetchProjectSnippets, 
  createSnippet, 
  clearCreateSnippetError 
} from '../features/snippets/snippetsSlice';
import SnippetCard from './SnippetCard';
import { 
  Box, Button, Typography, Modal, Paper, TextField, 
  MenuItem, CircularProgress, Alert 
} from '@mui/material';
import { explainCode } from '../features/snippets/snippetsSlice';
import AIModal from './AiModal';


// Common languages for the dropdown
const LANGUAGES = ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'sql', 'bash'];

const SnippetList = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  
  // Redux State
  const { snippets, fetch, create } = useSelector((state) => state.snippets);

  // Modal State
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // 1. Fetch snippets when mounting
  useEffect(() => {
    dispatch(fetchProjectSnippets(projectId));
  }, [dispatch, projectId]);

  // Handlers
  const handleOpen = () => {
    dispatch(clearCreateSnippetError());
    setOpen(true);
  };
  
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createSnippet({ 
      title, code, language, projectId 
    }));
    
    if (!result.error) {
      handleClose();
      setTitle('');
      setCode('');
      setLanguage('javascript');
    }
  };

  const handleExplain = (code) => {
  setAiModalOpen(true);
  // Ask the AI to explain
  dispatch(explainCode({ code, promptType: 'explain' }));
};

  return (
    <Box sx={{ mt: 3 }}>
      {/* Header & Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Code Snippets</Typography>
        <Button variant="contained" onClick={handleOpen}>
          + New Snippet
        </Button>
      </Box>

      {/* List Area */}
      {fetch.loading ? (
        <CircularProgress />
      ) : fetch.error ? (
        <Alert severity="error">{fetch.error}</Alert>
      ) : snippets.length === 0 ? (
        <Typography color="text.secondary">No snippets found. Share some code!</Typography>
      ) : (
        snippets.map(snippet => (
          <SnippetCard key={snippet.id} snippet={snippet}
          onExplain={() => handleExplain(snippet.code)} />
        ))
      )}

      {/* Create Modal */}
      <Modal open={open} onClose={handleClose}>
        <Paper sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, maxWidth: '90%', bgcolor: 'background.paper',
          boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Typography variant="h6" mb={2}>Add Code Snippet</Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            {create.error && <Alert severity="error" sx={{ mb: 2 }}>{create.error}</Alert>}
            
            <TextField 
              label="Title" fullWidth margin="normal" required
              value={title} onChange={(e) => setTitle(e.target.value)} 
            />
            
            <TextField
              select label="Language" fullWidth margin="normal"
              value={language} onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
              ))}
            </TextField>

            <TextField 
              label="Code" fullWidth margin="normal" required multiline rows={8}
              value={code} onChange={(e) => setCode(e.target.value)}
              sx={{ fontFamily: 'monospace' }}
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={create.loading}>
                {create.loading ? <CircularProgress size={24} /> : 'Save Snippet'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
      <AIModal open={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </Box>
  );
};

export default SnippetList;