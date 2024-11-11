import {
  Card,
  CardContent,
  CardMedia,
  ClickAwayListener,
  Typography,
} from '@mui/material';
import { memo } from 'react';

const CharacterContentCard = ({ character, onClickAway }) => {
  const keysToOmit = [
    'id',
    'created_at',
    'updated_at',
    'episodes',
    'family',
    'relatives',
    'url',
  ]; // Add any keys you want to exclude

  // Filter out null, undefined, and omitted keys
  const characterDetails = Object.entries(character || {}).filter(
    ([key, value]) => value !== null && value !== undefined && !keysToOmit.includes(key)
  );

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Card>
        <CardMedia
          loading="lazy"
          component="img"
          height="192"
          image={
            'https://static.wikia.nocookie.net/southpark/images/0/07/GingerKids09.jpg' //just an empty image to render - cause no images in characters api call
          }
          alt={character?.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {character?.name}
          </Typography>
          {characterDetails.map(([key, value]) => (
            <Typography key={key} variant="body2" color="text.secondary">
              {`${key.replace('_', ' ')}: ${value}`}
            </Typography>
          ))}
        </CardContent>
      </Card>
    </ClickAwayListener>
  );
};

export default memo(CharacterContentCard);
