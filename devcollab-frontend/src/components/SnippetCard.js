// src/components/SnippetCard.js
import React, { useState } from 'react';
import { Paper, Typography, Box, IconButton, Tooltip, Chip } from '@mui/material';
// Using Prism for better highlighting support
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Choose a theme (vs-dark is popular)
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SnippetCard = ({ snippet , onExplain}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Header: Title, Language, Copy Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">{snippet.title}</Typography>
          <Chip label={snippet.language} size="small" variant="outlined" />
        </Box>
        <Tooltip title={copied ? "Copied!" : "Copy Code"}>
          <IconButton onClick={handleCopy} size="small">
            {/* Simple text icon if you don't have MUI icons installed */}
            {copied ? "✅" : "📋"}
          </IconButton>
        </Tooltip>
        <Tooltip title="Ask AI to Explain">
  <IconButton onClick={onExplain} size="small" sx={{ mr: 1 }}>
    ✨
  </IconButton>
</Tooltip>
      </Box>

      {/* Code Block */}
      <Box sx={{ 
        maxHeight: 300, 
        overflow: 'auto', 
        borderRadius: 1,
        fontSize: '0.85rem' 
      }}>
        <SyntaxHighlighter 
          language={snippet.language.toLowerCase()} 
          style={vscDarkPlus}
          customStyle={{ margin: 0, borderRadius: '4px' }}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </Box>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Added by {snippet.user?.username || 'Unknown'} on {new Date(snippet.createdAt).toLocaleDateString()}
      </Typography>
    </Paper>
  );
};

export default SnippetCard;