import React from 'react';
import { Typography, Box, Grid, Paper, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar } from '@mui/material';
import { Schedule as ScheduleIcon, Add as AddIcon, Edit as EditIcon, Today as TodayIcon, DateRange as DateRangeIcon } from '@mui/icons-material';

const Schedule = () => {
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const scheduleData = {
    Monday: [
      { time: '06:00-14:00', name: 'Mike Chen', role: 'Sous Chef' },
      { time: '07:00-15:00', name: 'Carlos Rodriguez', role: 'Line Cook' },
      { time: '08:00-16:00', name: 'Anna Smith', role: 'Prep Cook' },
    ],
    Tuesday: [
      { time: '06:00-14:00', name: 'Mike Chen', role: 'Sous Chef' },
      { time: '07:00-15:00', name: 'Maria Garcia', role: 'Line Cook' },
      { time: '08:00-16:00', name: 'Tom Wilson', role: 'Prep Cook' },
    ],
    Wednesday: [
      { time: '06:00-14:00', name: 'Sarah Johnson', role: 'Executive Chef' },
      { time: '07:00-15:00', name: 'Carlos Rodriguez', role: 'Line Cook' },
      { time: '08:00-16:00', name: 'Anna Smith', role: 'Prep Cook' },
    ],
    Thursday: [
      { time: '06:00-14:00', name: 'Mike Chen', role: 'Sous Chef' },
      { time: '07:00-15:00', name: 'Carlos Rodriguez', role: 'Line Cook' },
      { time: '08:00-16:00', name: 'Emma Davis', role: 'Pastry Chef' },
    ],
    Friday: [
      { time: '06:00-14:00', name: 'Sarah Johnson', role: 'Executive Chef' },
      { time: '07:00-15:00', name: 'Mike Chen', role: 'Sous Chef' },
      { time: '08:00-16:00', name: 'Carlos Rodriguez', role: 'Line Cook' },
      { time: '09:00-17:00', name: 'Lisa Wong', role: 'Manager' },
    ],
    Saturday: [
      { time: '06:00-18:00', name: 'Sarah Johnson', role: 'Executive Chef' },
      { time: '07:00-19:00', name: 'Mike Chen', role: 'Sous Chef' },
      { time: '08:00-20:00', name: 'Carlos Rodriguez', role: 'Line Cook' },
      { time: '09:00-21:00', name: 'Maria Garcia', role: 'Line Cook' },
      { time: '10:00-22:00', name: 'Lisa Wong', role: 'Manager' },
    ],
    Sunday: [
      { time: '08:00-16:00', name: 'Mike Chen', role: 'Sous Chef' },
      { time: '09:00-17:00', name: 'Carlos Rodriguez', role: 'Line Cook' },
      { time: '10:00-18:00', name: 'Anna Smith', role: 'Prep Cook' },
    ],
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ScheduleIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Staff Scheduling
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<TodayIcon />}>
            This Week
          </Button>
          <Button variant="outlined" startIcon={<DateRangeIcon />}>
            Custom Range
          </Button>
          <Button variant="contained" startIcon={<AddIcon />}>
            Create Schedule
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Schedule Overview Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Hours This Week
              </Typography>
              <Typography variant="h3" component="div" color="primary">
                284
              </Typography>
              <Typography variant="body2" color="success.main">
                +12 from last week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Staff Scheduled
              </Typography>
              <Typography variant="h3" component="div" color="success.main">
                18/24
              </Typography>
              <Typography variant="body2" color="text.secondary">
                6 staff off this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Coverage Gaps
              </Typography>
              <Typography variant="h3" component="div" color="warning.main">
                2
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Wednesday lunch
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Overtime Hours
              </Typography>
              <Typography variant="h3" component="div" color="error.main">
                8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Schedule Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Schedule Overview
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Staff Member</TableCell>
                    {weekDays.map(day => (
                      <TableCell key={day} align="center" sx={{ fontWeight: 'bold' }}>
                        {day}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { name: 'Sarah Johnson', role: 'Executive Chef', avatar: 'SJ' },
                    { name: 'Mike Chen', role: 'Sous Chef', avatar: 'MC' },
                    { name: 'Carlos Rodriguez', role: 'Line Cook', avatar: 'CR' },
                    { name: 'Maria Garcia', role: 'Line Cook', avatar: 'MG' },
                    { name: 'Anna Smith', role: 'Prep Cook', avatar: 'AS' },
                    { name: 'Emma Davis', role: 'Pastry Chef', avatar: 'ED' },
                    { name: 'Tom Wilson', role: 'Prep Cook', avatar: 'TW' },
                    { name: 'Lisa Wong', role: 'Manager', avatar: 'LW' },
                  ].map((staff) => (
                    <TableRow key={staff.name} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: 'primary.main' }}>
                            {staff.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {staff.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {staff.role}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      {weekDays.map(day => {
                        const daySchedule = scheduleData[day] || [];
                        const staffShift = daySchedule.find(shift => shift.name === staff.name);
                        return (
                          <TableCell key={day} align="center">
                            {staffShift ? (
                              <Chip
                                label={staffShift.time}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                Off
                              </Typography>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Schedule Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" startIcon={<EditIcon />}>
                Edit Schedule
              </Button>
              <Button variant="outlined">
                Copy from Previous Week
              </Button>
              <Button variant="outlined">
                Publish Schedule
              </Button>
              <Button variant="outlined">
                Time-off Requests
              </Button>
              <Button variant="outlined">
                Shift Swaps
              </Button>
              <Button variant="outlined">
                Labor Cost Analysis
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Schedule;