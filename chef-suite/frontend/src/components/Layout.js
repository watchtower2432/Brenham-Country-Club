import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  RestaurantMenu as RecipesIcon,
  Inventory as InventoryIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const { user, logout, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Map routes to tabs
  const tabs = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'Recipes', icon: <RecipesIcon />, path: '/recipes' },
    { label: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { label: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { label: 'Operations', icon: <BusinessIcon />, path: '/operations' },
    { label: 'Staff', icon: <PeopleIcon />, path: '/staff' },
    { label: 'Schedule', icon: <ScheduleIcon />, path: '/schedule' },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const tabIndex = tabs.findIndex(tab => tab.path === currentPath);
    if (tabIndex !== -1) {
      setCurrentTab(tabIndex);
    }
  }, [location.pathname]);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(tabs[newValue].path);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(180deg, #2e7d32 0%, #1b5e20 100%)', color: 'white' }}>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
          Chef Suite Pro
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />

      <List sx={{ px: 1 }}>
        {tabs.map((tab, index) => (
          <ListItem key={tab.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={currentTab === index}
              onClick={() => handleTabChange(null, index)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {tab.icon}
              </ListItemIcon>
              <ListItemText
                primary={tab.label}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: currentTab === index ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', mb: 2 }} />

      <Box sx={{ p: 2 }}>
        <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
          <Typography variant="subtitle2" gutterBottom>
            System Status
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip size="small" label="Online" color="success" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
            <Chip size="small" label="v1.0.0" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid #e0e0e0',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top App Bar */}
        <AppBar
          position="static"
          elevation={1}
          sx={{
            bgcolor: 'white',
            color: 'text.primary',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Brenham Country Club - Culinary Operations
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Notifications */}
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* Settings */}
              <IconButton color="inherit">
                <SettingsIcon />
              </IconButton>

              {/* User Menu */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {user?.username}
                </Typography>
                <Chip
                  label={user?.role?.toUpperCase()}
                  size="small"
                  color={user?.role === 'admin' ? 'error' : user?.role === 'manager' ? 'warning' : 'default'}
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
                <IconButton onClick={handleProfileMenuOpen} size="small">
                  <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                    {user?.username?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Box>
            </Box>
          </Toolbar>

          {/* Tab Navigation */}
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 48,
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                minWidth: 120,
              },
              '& .MuiTabs-indicator': {
                height: 3,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={tab.label}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
                sx={{ px: 3 }}
              />
            ))}
          </Tabs>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <AccountCircle sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <SettingsIcon sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout;