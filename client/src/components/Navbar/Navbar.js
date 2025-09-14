import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box, 
    IconButton, 
    Avatar,
    Menu,
    MenuItem,
    TextField,
    InputAdornment
} from '@mui/material';
import { 
    Search as SearchIcon,
    Add as AddIcon,
    ExitToApp,
    Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { getPostsBySearch, getPosts } from '../../actions/posts';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { posts } = useSelector((state) => state.posts);
    
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/');
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set new timeout for search
        const timeout = setTimeout(async () => {
            try {
                if (value.trim()) {
                    console.log('Searching for:', value.trim());
                    setIsSearching(true);
                    try {
                        const result = await dispatch(getPostsBySearch({ search: value.trim() }));
                        console.log('Auto-search result:', result);
                    } catch (error) {
                        console.error('Auto-search error:', error);
                    } finally {
                        setIsSearching(false);
                    }
                } else {
                    // If search is empty, fetch all posts
                    console.log('Fetching all posts');
                    setIsSearching(true);
                    try {
                        await dispatch(getPosts(1));
                    } catch (error) {
                        console.error('Fetch all posts error:', error);
                    } finally {
                        setIsSearching(false);
                    }
                }
            } catch (error) {
                console.error('Search error:', error);
                setIsSearching(false);
            }
        }, 500);

        setSearchTimeout(timeout);
    };

    const handleCreatePost = () => {
        navigate('/create');
    };

    const handleProfile = () => {
        navigate('/profile');
        handleClose();
    };

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#fff', color: '#333' }}>
            <Toolbar>
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1, 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: '#1976d2'
                    }}
                    onClick={() => navigate('/')}
                >
                    Memories
                </Typography>

                {/* Search Bar */}
                <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search memories by title, message, or tags..."
                        value={search}
                        onChange={handleSearch}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                // Clear timeout and search immediately
                                if (searchTimeout) {
                                    clearTimeout(searchTimeout);
                                }
                                if (search.trim()) {
                                    setIsSearching(true);
                                    dispatch(getPostsBySearch({ search: search.trim() }))
                                        .then((result) => {
                                            console.log('Enter search result:', result);
                                        })
                                        .catch((error) => {
                                            console.error('Enter search error:', error);
                                        })
                                        .finally(() => {
                                            setIsSearching(false);
                                        });
                                }
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {search && (
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setSearch('');
                                                dispatch(getPosts(1));
                                            }}
                                            sx={{ mr: 0.5 }}
                                        >
                                            <Box component="span" sx={{ fontSize: '18px' }}>×</Box>
                                        </IconButton>
                                    )}
                                    {isSearching && (
                                        <Box sx={{ 
                                            width: 16, 
                                            height: 16, 
                                            border: '2px solid #ccc',
                                            borderTop: '2px solid #1976d2',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                            mr: 1
                                        }} />
                                    )}
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 20,
                                backgroundColor: '#f5f5f5',
                                '&:hover': {
                                    backgroundColor: '#eeeeee',
                                },
                            },
                            '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' },
                            },
                        }}
                    />
                    {search && (
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                display: 'block', 
                                mt: 0.5, 
                                ml: 1, 
                                color: posts && posts.length === 0 ? 'error.main' : 'text.secondary',
                                fontSize: '0.75rem'
                            }}
                        >
                            {posts && posts.length > 0 
                                ? `Found ${posts.length} result${posts.length === 1 ? '' : 's'}`
                                : posts && posts.length === 0 && !isSearching
                                    ? 'No results found'
                                    : 'Press Enter or wait for auto-search'
                            }
                        </Typography>
                    )}
                </Box>

                {/* Create Post Button */}
                {isAuthenticated && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreatePost}
                        sx={{
                            borderRadius: 20,
                            mr: 2,
                            backgroundColor: '#1976d2',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                        }}
                    >
                        Create
                    </Button>
                )}

                {/* Auth Buttons */}
                {!isAuthenticated ? (
                    <Box>
                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/login')}
                            sx={{ mr: 1 }}
                        >
                            Login
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={() => navigate('/register')}
                            sx={{ 
                                borderRadius: 20,
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                '&:hover': {
                                    borderColor: '#1565c0',
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                },
                            }}
                        >
                            Register
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar 
                                sx={{ 
                                    width: 32, 
                                    height: 32,
                                    backgroundColor: '#1976d2'
                                }}
                            >
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                        </IconButton>
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
                        >
                            <MenuItem onClick={handleProfile}>
                                <Person sx={{ mr: 1 }} />
                                Profile
                            </MenuItem>
                            {user?.role === 'admin' && (
                                <MenuItem onClick={() => { navigate('/admin'); handleClose(); }}>
                                    <Person sx={{ mr: 1 }} />
                                    Admin Dashboard
                                </MenuItem>
                            )}
                            <MenuItem onClick={handleLogout}>
                                <ExitToApp sx={{ mr: 1 }} />
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
