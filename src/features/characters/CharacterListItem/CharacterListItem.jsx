import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import { memo, useCallback } from 'react';

const StyledListItem = styled(ListItem)`
  transition: all 0.1s;
  background-color: ${(props) => (props.selected ? '#f5f5f5' : 'white')};
  cursor: pointer;
  &: hover {
    background-color: #1976d214;
  }
`;

const CharacterListItem = ({ id, name, onClick, isSelected }) => {
  const handleClick = useCallback(
    (e) => {
      onClick(id, e.target);
    },
    [onClick, id]
  );

  return (
    <StyledListItem onClick={handleClick} selected={isSelected}>
      <ListItemAvatar>
        <Avatar></Avatar>
      </ListItemAvatar>
      <ListItemText primary={name} />
    </StyledListItem>
  );
};

export default memo(CharacterListItem);
