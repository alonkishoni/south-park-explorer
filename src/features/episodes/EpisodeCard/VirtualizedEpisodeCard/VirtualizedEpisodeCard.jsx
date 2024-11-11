import {memo} from "react";
import {areEqual} from "react-window";
import EpisodeCard from "../EpisodeCard.jsx";

const VirtualizedEpisodeGridItem = ({ data, columnIndex, rowIndex, style }) => {
  const { displayedEpisodes, getVirtualizedColumnCount, lastItemRef } = data;
  const index = rowIndex * getVirtualizedColumnCount() + columnIndex;
  const episode = displayedEpisodes[index];

  if (!episode) return;

  return (
    <div
      style={{ ...style, ...{ display: 'flex', justifyContent: 'center' } }}
      ref={index === displayedEpisodes.length - 1 ? lastItemRef : null}
    >
      <EpisodeCard episode={episode} />
    </div>
  );
};
VirtualizedEpisodeGridItem.displayName = 'VirtualizedEpisodeGridItem';

export default memo(VirtualizedEpisodeGridItem, areEqual);
