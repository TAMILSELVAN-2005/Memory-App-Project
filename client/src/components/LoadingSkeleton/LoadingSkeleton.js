import React from 'react';
import { Card, CardContent, Skeleton, Box, Grid } from '@mui/material';

const LoadingSkeleton = () => {
  return (
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={6} key={item}>
          <Card sx={{ height: '100%', borderRadius: '15px' }}>
            <Skeleton 
              variant="rectangular" 
              height={200} 
              sx={{ borderRadius: '15px 15px 0 0' }}
            />
            <CardContent>
              <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="80%" height={16} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="60%" height={16} sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 12 }} />
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
                <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 12 }} />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 16 }} />
                <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 16 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingSkeleton;
