import { AppBar, Toolbar, Button } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';

const StyledButton = styled(Button)`
  color: ${(props) => (props.active ? '#000' : '#fff')};
  background-color: ${(props) => (props.active ? '#fff' : 'transparent')};
  transition:
    background-color 0.3s,
    color 0.3s;
  &:hover {
    background-color: #8b3aa1;
    color: #fff;
  }
`;

function NavBar() {
  const location = useLocation();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <StyledButton
          active={location.pathname === '/episodes' ? 'true' : undefined}
          component={RouterLink}
          to="/episodes"
        >
          Episodes
        </StyledButton>
        <StyledButton
          active={location.pathname === '/characters' ? 'true' : undefined}
          component={RouterLink}
          to="/characters"
        >
          Characters
        </StyledButton>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
