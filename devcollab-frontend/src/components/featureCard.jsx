// FeatureCard.jsx
import { Box, Typography } from "@mui/material";

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Box
      sx={{
        p: 4,
        background: '#fafafa',
        boxShadow: '4px 4px rgba(0, 0, 0, 1)',
        border: '2px solid #0c0c0cff',
        borderRadius: '2px',
        display: 'flex',
        
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '80%',
        transition: 'all 0.3s ease',

        '&:hover': {
          borderColor: '#000',
            boxShadow: '6px 6px rgba(0, 0, 0, 1)',
          transform: 'translateY(-6px)'
        }
      }}
    >
      <Box sx={{ mb: 3, color: "#000" }}>
        {icon}
      </Box>

      <Typography
        variant="h6"
        sx={{ fontWeight: 600, mb: 2, color: "#000", fontSize: "1.1rem" }}
      >
        {title}
      </Typography>

      <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.7, fontSize: "0.95rem" }}>
        {description}
      </Typography>
    </Box>
  );
};

export default FeatureCard;
