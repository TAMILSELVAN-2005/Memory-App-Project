import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Avatar, 
    Grid, 
    Card, 
    CardContent,
    CardMedia,
    Button,
    Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts } from '../../actions/posts';

const Profile = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { posts } = useSelector((state) => state.posts);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        if (user) {
            dispatch(getPosts(1));
        }
    }, [user, dispatch]);

    useEffect(() => {
        if (posts && user) {
            const filtered = posts.filter(post => post.creator === user.id);
            setUserPosts(filtered);
        }
    }, [posts, user]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item>
                        <Avatar 
                            sx={{ 
                                width: 100, 
                                height: 100, 
                                fontSize: '2rem',
                                backgroundColor: '#1976d2'
                            }}
                        >
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {user.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            {user.email}
                        </Typography>
                        <Chip 
                            label={user.role} 
                            color={user.role === 'admin' ? 'error' : 'primary'}
                            sx={{ mt: 1 }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                My Memories ({userPosts.length})
            </Typography>

            {userPosts.length === 0 ? (
                <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        You haven't created any memories yet. Start sharing your moments!
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {userPosts.map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post._id}>
                            <Card elevation={2} sx={{ height: '100%' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={post.selectedFile}
                                    alt={post.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {post.message.length > 100 
                                            ? `${post.message.substring(0, 100)}...` 
                                            : post.message
                                        }
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                        {post.tags.map((tag, index) => (
                                            <Chip 
                                                key={index} 
                                                label={tag} 
                                                size="small" 
                                                variant="outlined"
                                            />
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </Typography>
                                        <Box>
                                            <Button size="small" startIcon={<EditIcon />}>
                                                Edit
                                            </Button>
                                            <Button size="small" color="error" startIcon={<DeleteIcon />}>
                                                Delete
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Profile;
