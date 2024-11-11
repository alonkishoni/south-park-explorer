import { useInfiniteQuery } from '@tanstack/react-query';
import useEpisodesStore from '../../stores/episodes.store.js';
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll.hook.jsx';
import { getEpisodes } from '../../network/apiClient.js';
import { Container, Grid, Skeleton } from '@mui/material';
import { toast } from 'react-toastify';
import { Search } from '../../components/Search/Search.jsx';
import { useDebounce } from '../../hooks/useDebounce.hook.jsx';
import AutoSizer from 'react-virtualized-auto-sizer';
import { areEqual, FixedSizeGrid } from 'react-window';

const EpisodeCard = lazy(() => import('./EpisodeCard/EpisodeCard.jsx'));

export const Episodes = () => {
  const episodes = useEpisodesStore((state) => state.episodes);
  const addEpisodes = useEpisodesStore((state) => state.addEpisodes);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const onSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((episode) =>
      episode.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm, episodes]);

  const displayedEpisodes = debouncedSearchTerm ? filteredEpisodes : episodes;

  const fetchItems = useCallback(
    async ({ pageParam = 1 }) => {
      try {
        const response = await getEpisodes(pageParam);
        const pageEpisodes = response?.data?.data;
        const currentPage = response?.data?.meta?.current_page;
        const lastPage = response?.data?.meta?.last_page;

        if (pageEpisodes.length > 0) {
          addEpisodes(pageEpisodes);
        }

        return { pageEpisodes, currentPage, lastPage };
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
    [addEpisodes]
  );

  const { fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['episodes'],
    queryFn: fetchItems,
    getNextPageParam: (queryData) => {
      return queryData?.currentPage < queryData?.lastPage && !searchTerm
        ? queryData.currentPage + 1
        : undefined;
    },
    enabled: episodes.length === 0,
  });

  const { lastItemRef } = useInfiniteScroll(
    fetchNextPage,
    hasNextPage && !isLoading,
    '2500px'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [debouncedSearchTerm]);

  const getVirtualizedColumnCount = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) {
      return 1;
    } else if (width < 1120) {
      return 2;
    } else {
      return 3;
    }
  }, []);

  const VirtualizedEpisodeGridItem = memo(({ columnIndex, rowIndex, style }) => {
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
  }, areEqual);
  VirtualizedEpisodeGridItem.displayName = 'VirtualizedEpisodeGridItem';

  return (
    <Container style={{ paddingTop: '90px', display: 'flex', justifyContent: 'center' }}>
      <Search value={searchTerm} onChange={onSearchChange} />
      <Suspense
        fallback={
          <Grid
            style={{ height: 'calc(100vh - 90px)', width: '100%' }}
            justifyContent={'center'}
            alignItems="center"
            container
            spacing={6}
          >
            <Skeleton variant="rectangular" width={345} height={330} />
          </Grid>
        }
      >
        <Grid style={{ height: '100vh' }} container spacing={6}>
          <AutoSizer>
            {({ height, width }) => {
              const columnCount = getVirtualizedColumnCount();
              const columnWidth = width / columnCount;
              const rowCount = Math.ceil(displayedEpisodes.length / columnCount);

              return (
                <FixedSizeGrid
                  columnCount={columnCount}
                  columnWidth={columnWidth}
                  height={height - 74}
                  rowCount={rowCount}
                  rowHeight={330}
                  width={width}
                  style={{ top: '32px' }}
                >
                  {VirtualizedEpisodeGridItem}
                </FixedSizeGrid>
              );
            }}
          </AutoSizer>
        </Grid>
      </Suspense>
    </Container>
  );
};
