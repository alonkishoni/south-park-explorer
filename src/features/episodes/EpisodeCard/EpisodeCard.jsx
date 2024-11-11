import {
  Alert,
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  ClickAwayListener,
  Fade,
  Typography,
} from '@mui/material';
import styled from '@emotion/styled';
import { memo, useState } from 'react';
import { formatDate } from '../../../utils/date.utils.js';

const StyledCard = styled(Card)`
  width: 345px;
  height: 318px;
  transition: all 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-bottom: 10px;

  &:hover {
    box-shadow:
      rgba(0, 0, 0, 0.19) 0px 10px 20px,
      rgba(0, 0, 0, 0.23) 0px 6px 6px;
  }
`;

const FlashContent = styled.div`
  animation: fade 500ms ease-in-out;
  pointer-events: ${({ isSelected }) => (isSelected ? 'auto' : 'none')};

  @keyframes fade {
    0% {
      opacity: 0;
      background-color: white;
    }
    100% {
      opacity: 1;
      background-color: white;
    }
  }
`;

const EpisodeCard = ({ episode }) => {
  const {
    thumbnail_url,
    name,
    description,
    air_date,
    season,
    episode: ep,
    wiki_url,
  } = episode;
  const [isSelected, setIsSelected] = useState(false);

  const revisionlessUrl = thumbnail_url?.split('/revision')[0];

  const handleCardClick = () => {
    setIsSelected(!isSelected);
  };

  const handleClickAway = () => {
    setIsSelected(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <StyledCard onClick={handleCardClick}>
        {!isSelected ? (
          <>
            <CardMedia
              loading="lazy"
              component="img"
              height="192"
              image={revisionlessUrl}
            />
            <CardContent>
              <Typography
                variant="h6"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                component="div"
              >
                {name}
              </Typography>
              <Typography
                fontSize={'12px'}
                variant="overline"
                color="text.secondary"
                component="div"
              >
                {`Season: ${season} / Episode: ${ep}`}
              </Typography>
              <Typography fontSize={'12px'} variant="overline" color="text.secondary">
                {`First aired: ${formatDate(air_date)}`}
              </Typography>
            </CardContent>
          </>
        ) : (
          <FlashContent>
            <>
              <CardContent>
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{ width: 72, height: 72 }}
                      alt="avatar"
                      src={revisionlessUrl}
                    />
                  }
                  title={name}
                  subheader={formatDate(air_date)}
                  titleTypographyProps={{ variant: 'p1' }}
                  subheaderTypographyProps={{ variant: 'overline' }}
                />
                <Alert style={{ height: '120px' }} icon={false} severity="info">
                  {description}
                </Alert>
              </CardContent>
              <CardActions dir={'rtl'}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(wiki_url, '_blank');
                  }}
                  size="small"
                >
                  More
                </Button>
              </CardActions>
            </>
          </FlashContent>
        )}
      </StyledCard>
    </ClickAwayListener>
  );
};

export default memo(EpisodeCard);
