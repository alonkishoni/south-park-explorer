import { useState } from 'react';
import { InputBase, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const Search = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false);

  return (
    <Stack
      style={{
        position: 'fixed',
        zIndex: 1,
        top: 90,
        right: 20,
        backgroundColor: 'white',
        borderRadius: '50px',
        border: focused ? '2px #1876d2 solid' : '1px #cccccc solid',
        paddingInline: '4px',
      }}
      alignItems={'center'}
      direction={'row'}
    >
      <SearchIcon />
      <InputBase
        value={value}
        sx={{
          ml: 1,
          flex: 1,
          width: focused ? '200px' : '70px',
          transition: 'width 0.3s',
        }}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChange}
      />
    </Stack>
  );
};
