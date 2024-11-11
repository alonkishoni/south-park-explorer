import React from 'react';
import { Grid, Skeleton } from '@mui/material';

const GridSkeletonLoader = ({ itemCount = 6 }) => {
  return (
    <Grid container spacing={6}>
      {Array.from(new Array(itemCount)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="60%" />
        </Grid>
      ))}
    </Grid>
  );
};

export default GridSkeletonLoader;
