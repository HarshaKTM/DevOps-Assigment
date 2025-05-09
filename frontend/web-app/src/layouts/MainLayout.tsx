import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
  LocalHospital as LocalHospitalIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import { selectUser, logout } from '../store/slices/authSlice';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleProfileMenuClose();
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Appointments', icon: <EventNoteIcon />, path: '/appointments' },
    { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/doctors' },
    { text: 'Medical Records', icon: <DescriptionIcon />, path: '/medical-records' },
    { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Healthcare Appointment System
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/book-appointment')}
              sx={{ mr: 2 }}
            >
              Book Appointment
            </Button>
            
            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar 
                alt={user?.firstName} 
                src={user?.avatar}
                sx={{ width: 32, height: 32 }}
              >
                {user?.firstName?.charAt(0)}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => {
                handleProfileMenuClose();
                navigate('/profile');
              }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              
              <MenuItem onClick={() => {
                handleProfileMenuClose();
                navigate('/settings');
              }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {drawerItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                onClick={() => handleNavigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - 240px)` },
          marginTop: '64px'
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout; 