import React from 'react';
import { Typography, Box, Grid, Paper, Card, CardContent, Button, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Business as BusinessIcon, CheckCircle as CheckCircleIcon, Warning as WarningIcon } from '@mui/icons-material';

const Operations = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BusinessIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Operations Management
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Work Orders
              </Typography>
              <Typography variant="h3" component="div" color="primary">
                12
              </Typography>
              <Typography variant="body2" color="success.main">
                +2 from yesterday
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Equipment Status
              </Typography>
              <Typography variant="h3" component="div" color="success.main">
                98%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All systems operational
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Maintenance Due
              </Typography>
              <Typography variant="h3" component="div" color="warning.main">
                3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Within 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Work Orders */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Work Orders
            </Typography>
            <List>
              {[
                { id: 'WO-2025-001', title: 'Refrigerator maintenance', priority: 'High', status: 'In Progress' },
                { id: 'WO-2025-002', title: 'Dishwasher repair', priority: 'Medium', status: 'Pending' },
                { id: 'WO-2025-003', title: 'HVAC filter replacement', priority: 'Low', status: 'Scheduled' },
              ].map((order) => (
                <ListItem key={order.id} divider>
                  <ListItemText
                    primary={order.title}
                    secondary={`ID: ${order.id}`}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={order.priority}
                      size="small"
                      color={order.priority === 'High' ? 'error' : order.priority === 'Medium' ? 'warning' : 'default'}
                    />
                    <Chip
                      label={order.status}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
              View All Work Orders
            </Button>
          </Paper>
        </Grid>

        {/* Equipment Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Equipment Status
            </Typography>
            <List>
              {[
                { name: 'Main Refrigerator', status: 'Online', lastCheck: '2 hours ago' },
                { name: 'Commercial Oven', status: 'Online', lastCheck: '1 hour ago' },
                { name: 'Dishwasher', status: 'Maintenance', lastCheck: '30 min ago' },
                { name: 'Ice Machine', status: 'Online', lastCheck: '3 hours ago' },
              ].map((equipment) => (
                <ListItem key={equipment.name} divider>
                  <ListItemText
                    primary={equipment.name}
                    secondary={`Last checked: ${equipment.lastCheck}`}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {equipment.status === 'Online' ? (
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    ) : (
                      <WarningIcon color="warning" sx={{ mr: 1 }} />
                    )}
                    <Chip
                      label={equipment.status}
                      size="small"
                      color={equipment.status === 'Online' ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
              Equipment Dashboard
            </Button>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" startIcon={<BusinessIcon />}>
                Create Work Order
              </Button>
              <Button variant="outlined">
                Schedule Maintenance
              </Button>
              <Button variant="outlined">
                Equipment Inventory
              </Button>
              <Button variant="outlined">
                Safety Checklist
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Operations;