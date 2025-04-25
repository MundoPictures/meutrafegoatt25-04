import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Collapse,
  Link
} from '@mui/material';
import {
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
  ExpandMore,
  ExpandLess,
  Info as InfoIcon
} from '@mui/icons-material';

interface FacebookTokenInputProps {
  onTokenChange?: (token: string) => void;
}

const FacebookTokenInput: React.FC<FacebookTokenInputProps> = ({ onTokenChange }) => {
  const [token, setToken] = useState<string>('');
  const [showToken, setShowToken] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Carregar token do localStorage ao iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem('facebookToken');
    if (savedToken) {
      setToken(savedToken);
      if (onTokenChange) {
        onTokenChange(savedToken);
      }
    }
  }, [onTokenChange]);

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
  };

  const handleSaveToken = () => {
    if (token) {
      localStorage.setItem('facebookToken', token);
      if (onTokenChange) {
        onTokenChange(token);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const toggleShowToken = () => {
    setShowToken(!showToken);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
          <InfoIcon color="primary" sx={{ mr: 1 }} />
          Configuração da API do Facebook
        </Typography>
        <IconButton onClick={toggleExpanded} size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Token de Acesso do Facebook"
            variant="outlined"
            value={token}
            onChange={handleTokenChange}
            type={showToken ? 'text' : 'password'}
            placeholder="Cole seu token de acesso do Facebook aqui"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle token visibility"
                    onClick={toggleShowToken}
                    edge="end"
                  >
                    {showToken ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveToken}
            disabled={!token}
            size="small"
          >
            Salvar Token
          </Button>
          
          <Link 
            href="https://developers.facebook.com/tools/explorer/" 
            target="_blank" 
            rel="noopener"
            variant="body2"
          >
            Obter Token no Facebook
          </Link>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Token salvo com sucesso! O dashboard agora usará dados reais do Facebook Ads.
          </Alert>
        )}

        <Alert severity="info" sx={{ mt: 2 }}>
          Para usar dados reais, você precisa de um token com permissões: ads_read, ads_management, business_management
        </Alert>
      </Collapse>
    </Paper>
  );
};

export default FacebookTokenInput;