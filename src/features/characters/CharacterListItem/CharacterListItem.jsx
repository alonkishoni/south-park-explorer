import {
  Avatar, Fade,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import styled from '@emotion/styled';
import { memo, useCallback } from 'react';

const StyledListItem = styled(ListItem)`
  transition: all 0.1s;
  background-color: ${(props) => (props.selected ? '#f5f5f5' : 'white')};
  cursor: pointer;
  &:hover {
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
    <Fade in={true}>
      <StyledListItem onClick={handleClick} selected={isSelected}>
        <ListItemAvatar>
          <Avatar></Avatar>
        </ListItemAvatar>
        <ListItemText primary={name} />
      </StyledListItem>
    </Fade>
  );
};

export default memo(CharacterListItem);
