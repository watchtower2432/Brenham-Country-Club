import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    activeRecipes: 0,
    recentChanges: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [recipesRes, logsRes] = await Promise.all([
        axios.get('/recipes'),
        axios.get('/system/logs?limit=5'),
      ]);

      setStats({
        totalRecipes: recipesRes.data.length,
        activeRecipes: recipesRes.data.filter(r => r.is_active).length,
        recentChanges: logsRes.data || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Culinary Operations Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Recipes
              </Typography>
              <Typography variant="h3" component="div">
                {stats.totalRecipes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Recipes
              </Typography>
              <Typography variant="h3" component="div">
                {stats.activeRecipes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {stats.recentChanges.length > 0 ? (
                stats.recentChanges.map((log, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={log.action}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(log.timestamp).toLocaleString()}
                          </Typography>
                          {log.details && (
                            <Chip 
                              label={log.details} 
                              size="small" 
                              sx={{ mt: 0.5 }} 
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No recent activity" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;