import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Fade,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccountCircle,
  Brightness4,
  Brightness7,
  TrendingUp,
  MonetizationOn as SalaryIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useCustomTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: t('navigation.dashboard'), icon: <DashboardIcon />, path: '/dashboard', color: '#6366f1' },
    { text: t('navigation.expenses'), icon: <ReceiptIcon />, path: '/expenses', color: '#059669' },
    { text: t('navigation.salary'), icon: <SalaryIcon />, path: '/salary', color: '#8b5cf6' },
    { text: t('navigation.settings'), icon: <SettingsIcon />, path: '/settings', color: '#dc2626' },
  ];

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: darkMode 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? 'radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Toolbar
        sx={{
          background: darkMode
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          position: 'relative',
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' }
              }
            }}
          >
            <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              noWrap 
              component="div"
              sx={{
                fontWeight: 700,
                background: darkMode
                  ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)'
                  : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.1rem',
              }}
            >
              {t('navigation.expenseTracker')}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                fontSize: '0.7rem',
                fontWeight: 500,
              }}
            >
              {t('navigation.financialManagement')}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
      
      <Box sx={{ px: 2, position: 'relative', zIndex: 1 }}>
        <List sx={{ gap: 1 }}>
          {menuItems.map((item, index) => (
            <Fade in={true} timeout={300 + (index * 100)} key={item.text}>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: '12px',
                    mb: 0.5,
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: location.pathname === item.path
                        ? `linear-gradient(135deg, ${item.color}15 0%, ${item.color}25 100%)`
                        : 'transparent',
                      transition: 'all 0.3s ease',
                    },
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: darkMode 
                        ? `0 8px 25px rgba(255, 255, 255, 0.1)` 
                        : `0 8px 25px ${item.color}20`,
                      '&::before': {
                        background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}30 100%)`,
                      }
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'transparent',
                      border: `1px solid ${item.color}40`,
                      '&::before': {
                        background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}30 100%)`,
                      },
                      '&:hover': {
                        backgroundColor: 'transparent',
                      }
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 48,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: location.pathname === item.path
                          ? `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`
                          : darkMode
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.3s ease',
                        boxShadow: location.pathname === item.path
                          ? `0 4px 12px ${item.color}40`
                          : 'none',
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        sx: {
                          color: location.pathname === item.path
                            ? 'white'
                            : darkMode
                              ? 'rgba(255, 255, 255, 0.7)'
                              : 'rgba(0, 0, 0, 0.7)',
                          fontSize: 20,
                        }
                      })}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      '& .MuiListItemText-primary': {
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        color: location.pathname === item.path
                          ? (darkMode ? '#ffffff' : '#1e293b')
                          : (darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'),
                        fontSize: '0.95rem',
                      }
                    }}
                  />
                  {location.pathname === item.path && (
                    <Chip
                      size="small"
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: item.color,
                        borderRadius: '50%',
                        position: 'relative',
                        zIndex: 1,
                        '& .MuiChip-label': {
                          display: 'none',
                        }
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Fade>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: darkMode
            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 50%, rgba(71, 85, 105, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(226, 232, 240, 0.95) 50%, rgba(203, 213, 225, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: darkMode
              ? 'radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Toolbar sx={{ position: 'relative', zIndex: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              borderRadius: '12px',
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 700,
                background: darkMode
                  ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)'
                  : 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: '1.3rem',
              }}
            >
              {menuItems.find(item => item.path === location.pathname)?.text || t('navigation.expenseTracker')}
            </Typography>
            
            {/* Page indicator dot */}
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                ml: 2,
                background: menuItems.find(item => item.path === location.pathname)?.color || '#6366f1',
                boxShadow: `0 0 12px ${menuItems.find(item => item.path === location.pathname)?.color || '#6366f1'}40`,
                animation: 'glow 2s ease-in-out infinite alternate',
                '@keyframes glow': {
                  '0%': { opacity: 0.6 },
                  '100%': { opacity: 1 }
                }
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            <IconButton 
              color="inherit" 
              onClick={toggleDarkMode}
              sx={{
                borderRadius: '12px',
                padding: '10px',
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                  transform: 'scale(1.1) rotate(180deg)',
                },
              }}
            >
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{
                borderRadius: '12px',
                padding: '8px',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: darkMode 
                    ? '0 8px 25px rgba(99, 102, 241, 0.3)' 
                    : '0 8px 25px rgba(99, 102, 241, 0.2)',
                },
              }}
            >
              <AccountCircle sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: '16px',
                mt: 1,
                minWidth: 220,
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)'
                  : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(226, 232, 240, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                boxShadow: darkMode
                  ? '0 20px 40px rgba(0, 0, 0, 0.3)'
                  : '0 20px 40px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            <Box sx={{ p: 2, borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: darkMode ? '#ffffff' : '#1e293b',
                      mb: 0.5,
                    }}
                  >
                    {user?.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <MenuItem 
              onClick={() => { handleClose(); logout(); }}
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: '12px',
                m: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <ListItemIcon>
                <LogoutIcon 
                  fontSize="small" 
                  sx={{ 
                    color: '#dc2626',
                    mr: 1,
                  }} 
                />
              </ListItemIcon>
              <Typography sx={{ color: darkMode ? '#ffffff' : '#1e293b', fontWeight: 500 }}>
                {t('navigation.logout')}
              </Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: darkMode
                ? '4px 0 20px rgba(0, 0, 0, 0.3)'
                : '4px 0 20px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: darkMode
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
          minHeight: '100vh',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: darkMode
              ? 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
              : 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }
        }}
      >
        <Toolbar />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;