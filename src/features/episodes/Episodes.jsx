import { useInfiniteQuery } from '@tanstack/react-query';
import useEpisodesStore from '../../stores/episodes.store.js';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll.hook.jsx';
import { getEpisodes } from '../../network/apiClient.js';
import { Container, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { Search } from '../../components/Search/Search.jsx';
import { useDebounce } from '../../hooks/useDebounce.hook.jsx';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid } from 'react-window';
import GridSkeletonLoader from "../../components/GridSkeletonLoader/GridSkeletonLoader.jsx";
import ListSkeletonLoader from "../../components/ListSkeletonLoader/ListSkeletonLoader.jsx";

const VirtualizedEpisodeGridItem = lazy(() => import('./EpisodeCard/VirtualizedEpisodeCard/VirtualizedEpisodeCard.jsx'));

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
  
  const itemData = useMemo(() => ({ 
      displayedEpisodes, 
      getVirtualizedColumnCount,
      lastItemRef
    }), [displayedEpisodes, getVirtualizedColumnCount, lastItemRef]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [debouncedSearchTerm]);
  
  return (
    <Container style={{ paddingTop: '90px', display: 'flex', justifyContent: 'center' }}>
      <Search value={searchTerm} onChange={onSearchChange} />
      <Suspense fallback={<GridSkeletonLoader itemCount={9}/>} >
        <Grid style={{ height: '100vh' }} container spacing={6}>
          {!episodes.length && <GridSkeletonLoader itemCount={9} />}

          <AutoSizer>
            {({ height, width }) => {
              const columnCount = getVirtualizedColumnCount();
              const columnWidth = width / columnCount;
              const rowCount = Math.ceil(displayedEpisodes.length / columnCount);

              return (
                <FixedSizeGrid
                  itemData={itemData}
                  itemKey={({ columnIndex, rowIndex }) => {
                    const index = rowIndex * columnCount + columnIndex;
                    return displayedEpisodes?.[index]?.id;
                  }}
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
