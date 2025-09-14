import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Grid, 
    Card, 
    CardContent,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0
    });

    useEffect(() => {
        // Check if user is admin
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        // Fetch admin statistics
        fetchAdminStats();
    }, [user, navigate]);

    const fetchAdminStats = async () => {
        try {
            // In a real app, you'd fetch this from an admin API endpoint
            // For now, we'll use mock data
            setStats({
                totalUsers: 25,
                totalPosts: 150,
                totalComments: 320
            });
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        }
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                Admin Dashboard
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                Welcome, {user.name}! You have administrative access to manage the platform.
            </Alert>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" color="primary" gutterBottom>
                                {stats.totalUsers}
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                Total Users
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" color="secondary" gutterBottom>
                                {stats.totalPosts}
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                Total Posts
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card elevation={2}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" color="success.main" gutterBottom>
                                {stats.totalComments}
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                Total Comments
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Quick Actions */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button variant="contained" color="primary">
                        Manage Users
                    </Button>
                    <Button variant="contained" color="secondary">
                        Review Posts
                    </Button>
                    <Button variant="contained" color="info">
                        System Settings
                    </Button>
                    <Button variant="outlined" color="warning">
                        View Reports
                    </Button>
                </Box>
            </Paper>

            {/* Recent Activity */}
            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Recent Activity
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Action</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>New User Registration</TableCell>
                                <TableCell>john.doe@example.com</TableCell>
                                <TableCell>User account created</TableCell>
                                <TableCell>2 hours ago</TableCell>
                                <TableCell>
                                    <Chip label="Active" color="success" size="small" />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Post Reported</TableCell>
                                <TableCell>user123</TableCell>
                                <TableCell>Inappropriate content</TableCell>
                                <TableCell>5 hours ago</TableCell>
                                <TableCell>
                                    <Chip label="Pending" color="warning" size="small" />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Comment Removed</TableCell>
                                <TableCell>moderator1</TableCell>
                                <TableCell>Spam comment deleted</TableCell>
                                <TableCell>1 day ago</TableCell>
                                <TableCell>
                                    <Chip label="Completed" color="info" size="small" />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default AdminDashboard;
