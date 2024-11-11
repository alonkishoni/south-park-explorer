import {
  Card,
  ClickAwayListener,
} from '@mui/material';
import styled from '@emotion/styled';
import { memo, useState } from 'react';
import CardBack from "./CardBack/CardBack.jsx";
import CardFront from "./CardFront/CardFront.jsx";

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
      rgba(0, 0, 0, 0.19) 0 10px 20px,
      rgba(0, 0, 0, 0.23) 0 6px 6px;
  }
`;

const FadeIn = styled.div`
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
          <FadeIn>
            <CardFront name={name} imageUrl={revisionlessUrl} ep={ep} season={season} airDate={air_date} />
          </FadeIn>
        ) : (
          <CardBack name={name} imageUrl={revisionlessUrl} airDate={air_date} description={description} externalLink={wiki_url} />
        )}
      </StyledCard>
    </ClickAwayListener>
  );
};

export default memo(EpisodeCard);
