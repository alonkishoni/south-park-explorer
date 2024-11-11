import {memo, useMemo} from "react";
import {areEqual} from "react-window";
import CharacterListItem from "../CharacterListItem/CharacterListItem.jsx";

const VirtualizedCharacterRow = ({ data, index, style }) => {
  const { displayedCharacters, onCharacterSelect, lastItemRef, selectedCharacter } = data;

  const character = useMemo(() => displayedCharacters[index], [displayedCharacters, index]);

  if (!character) return;

  return (
    <div
      id={`character-${character.id}`}
      style={{
        ...style,
        ...{ display: 'flex', justifyContent: 'center', alignItems: 'center' },
      }}
      ref={index === displayedCharacters.length - 1 ? lastItemRef : null}
    >
      <CharacterListItem
        onClick={onCharacterSelect}
        name={character?.name}
        id={character?.id}
        isSelected={selectedCharacter?.id === character?.id}
      />
    </div>
  );
}
VirtualizedCharacterRow.displayName = 'VirtualizedCharacterRow';

export default memo(VirtualizedCharacterRow, areEqual);
