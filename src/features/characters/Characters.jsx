import useCharactersStore from '../../stores/characters.store.js';
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll.hook.jsx';
import { getCharacters } from '../../network/apiClient.js';
import { Backdrop, Box, Container, List, Popover, Popper, Skeleton } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ToastContainer, Zoom, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDebounce } from '../../hooks/useDebounce.hook.jsx';
import { Search } from '../../components/Search/Search.jsx';
import { areEqual, FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import CharacterContentCard from './CharacterContentCard/CharacterContentCard.jsx';

const CharacterListItem = lazy(() => import('./CharacterListItem/CharacterListItem.jsx'));

export const Characters = () => {
  const characters = useCharactersStore((state) => state.characters);
  const addCharacters = useCharactersStore((state) => state.addCharacters);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [popperPosition, setPopperPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const onCharacterSelect = useCallback(
    (id, element) => {
      const selectedChar = characters.find((character) => character.id === id);
      setSelectedCharacter(selectedChar);
      setIsCardOpen(true);
      const rect = element.getBoundingClientRect();
      setPopperPosition({
        top: rect?.top + window?.scrollY,
        left: rect?.left,
      });
    },
    [characters]
  );

  const handleCardClose = useCallback(() => {
    setSelectedCharacter(null);
    setIsCardOpen(false);
  }, []);

  const onSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) =>
      character.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [characters, debouncedSearchTerm]);

  const displayedCharacters = debouncedSearchTerm ? filteredCharacters : characters;

  const fetchItems = useCallback(
    async ({ pageParam = 1 }) => {
      try {
        const response = await getCharacters(pageParam);
        const pageCharacters = response?.data?.data;
        const currentPage = response?.data?.meta?.current_page;
        const lastPage = response?.data?.meta?.last_page;

        addCharacters(pageCharacters);

        return { pageCharacters, currentPage, lastPage };
      } catch (error) {
        console.error('Error fetching items:', error);
        toast(`${error.message}`, {
          position: 'bottom-right',
          type: 'error',
          autoClose: 1500,
        });

        throw error;
      }
    },
    [addCharacters]
  );

  const { fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['characters'],
    queryFn: fetchItems,
    getNextPageParam: (queryData) => {
      return queryData?.currentPage < queryData?.lastPage
        ? queryData.currentPage + 1
        : undefined;
    },
    enabled: characters.length === 0,
  });

  const { lastItemRef } = useInfiniteScroll(
    fetchNextPage,
    !isLoading && hasNextPage,
    '100px'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [debouncedSearchTerm]);

  const VirtualizedCharacterRow = memo(({ index, style }) => {
    const character = displayedCharacters[index];

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
  }, areEqual);
  VirtualizedCharacterRow.displayName = 'VirtualizedCharacterRow';

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', paddingTop: '70px' }}>
      <ToastContainer hideProgressBar transition={Zoom} />
      <Search onChange={onSearchChange} value={searchTerm} />
      <Suspense fallback={<Skeleton variant="rounded" width={360} height={100} />}>
        <List
          sx={{
            height: '100vh',
            width: '100%',
            paddingInline: '40px',
          }}
        >
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemSize={80}
                itemCount={displayedCharacters.length}
              >
                {VirtualizedCharacterRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        </List>
        <Popover
          open={isCardOpen}
          style={{
            ...popperPosition,
          }}
        >
          <Box>
            <CharacterContentCard
              onClickAway={handleCardClose}
              character={selectedCharacter}
            />
          </Box>
        </Popover>
        <Backdrop open={!!selectedCharacter} onClick={handleCardClose}></Backdrop>
      </Suspense>
    </Container>
  );
};
