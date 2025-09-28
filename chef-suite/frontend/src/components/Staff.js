import React from 'react';
import { Typography, Box, Grid, Paper, Card, CardContent, Avatar, Button, List, ListItem, ListItemText, ListItemAvatar, Chip, Divider } from '@mui/material';
import { People as PeopleIcon, PersonAdd as PersonAddIcon, Schedule as ScheduleIcon, Assessment as AssessmentIcon } from '@mui/icons-material';

const Staff = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PeopleIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" component="h1">
          Staff Management
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Staff Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Staff
              </Typography>
              <Typography variant="h3" component="div" color="primary">
                24
              </Typography>
              <Typography variant="body2" color="success.main">
                +2 this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                On Duty Today
              </Typography>
              <Typography variant="h3" component="div" color="success.main">
                18
              </Typography>
              <Typography variant="body2" color="text.secondary">
                6 scheduled off
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Training Due
              </Typography>
              <Typography variant="h3" component="div" color="warning.main">
                5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This quarter
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg. Performance
              </Typography>
              <Typography variant="h3" component="div" color="success.main">
                94%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Above target
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Staff Directory */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Staff Directory
              </Typography>
              <Button variant="contained" startIcon={<PersonAddIcon />}>
                Add Staff
              </Button>
            </Box>
            <List>
              {[
                { name: 'Sarah Johnson', role: 'Executive Chef', status: 'On Duty', avatar: 'SJ' },
                { name: 'Mike Chen', role: 'Sous Chef', status: 'On Duty', avatar: 'MC' },
                { name: 'Emma Davis', role: 'Pastry Chef', status: 'Off Duty', avatar: 'ED' },
                { name: 'Carlos Rodriguez', role: 'Line Cook', status: 'On Duty', avatar: 'CR' },
                { name: 'Lisa Wong', role: 'Dining Room Manager', status: 'On Duty', avatar: 'LW' },
              ].map((staff, index) => (
                <React.Fragment key={staff.name}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {staff.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={staff.name}
                      secondary={staff.role}
                    />
                    <Chip
                      label={staff.status}
                      size="small"
                      color={staff.status === 'On Duty' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </ListItem>
                  {index < 4 && <Divider variant="inset" />}
                </React.Fragment>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
              View Full Directory
            </Button>
          </Paper>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Today's Schedule
            </Typography>
            <List dense>
              {[
                { time: '06:00', name: 'Mike Chen', role: 'Prep' },
                { time: '07:00', name: 'Sarah Johnson', role: 'Kitchen Lead' },
                { time: '08:00', name: 'Carlos Rodriguez', role: 'Line Cook' },
                { time: '09:00', name: 'Emma Davis', role: 'Pastry' },
                { time: '10:00', name: 'Lisa Wong', role: 'Front of House' },
              ].map((shift) => (
                <ListItem key={`${shift.time}-${shift.name}`}>
                  <ListItemText
                    primary={`${shift.time} - ${shift.name}`}
                    secondary={shift.role}
                  />
                </ListItem>
              ))}
            </List>
            <Button variant="outlined" fullWidth sx={{ mt: 2 }} startIcon={<ScheduleIcon />}>
              Manage Schedule
            </Button>
          </Paper>
        </Grid>

        {/* Performance Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Kitchen Efficiency
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      96%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Orders completed on time
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Food Quality Score
                    </Typography>
                    <Typography variant="h4" color="success.main">
                      9.2/10
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Customer satisfaction rating
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Team Morale
                    </Typography>
                    <Typography variant="h4" color="warning.main">
                      8.5/10
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Based on recent surveys
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<AssessmentIcon />}>
                Performance Reports
              </Button>
              <Button variant="outlined">
                Training Records
              </Button>
              <Button variant="outlined">
                Time Tracking
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Staff;