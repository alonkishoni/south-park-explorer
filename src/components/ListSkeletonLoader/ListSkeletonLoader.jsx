import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Skeleton } from '@mui/material';

const ListSkeletonLoader = ({ itemCount = 5 }) => {
  return (
    <List>
      {Array.from(new Array(itemCount)).map((_, index) => (
        <ListItem key={index} alignItems="flex-start">
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40}>
              <Avatar />
            </Skeleton>
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton variant="text" width="60%" />}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ListSkeletonLoader;
