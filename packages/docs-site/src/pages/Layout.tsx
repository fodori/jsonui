import * as React from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Home from '@mui/icons-material/Home'
import GitHub from '@mui/icons-material/GitHub'
import RocketLaunch from '@mui/icons-material/RocketLaunch'
import Container from '@mui/material/Container'
import { Outlet, Link } from 'react-router-dom'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Slide from '@mui/material/Slide'
import SvgIcon from '@mui/material/SvgIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import SportsEsports from '@mui/icons-material/SportsEsports'
import MuiLink from '@mui/material/Link'
import { ReactComponent as NpmIcon } from '../assets/npmIcon.svg'
import { ReactComponent as JsonIcon } from '../assets/jsonIcon.svg'
import { ReactComponent as ReactIcon } from '../assets/reactIcon.svg'

interface HideOnScrollProps {
  children: React.ReactElement
}

const HideOnScroll = ({ children }: HideOnScrollProps) => {
  const trigger = useScrollTrigger()

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}
export default function Layout() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <HideOnScroll>
        <AppBar>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu button"
              sx={{ mr: 2 }}
              id="menu-button"
              aria-controls={open ? 'menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose} {...{ component: Link }} to="/">
                <ListItemIcon>
                  <Home fontSize="small" />
                </ListItemIcon>
                <ListItemText>Homepage</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose} {...{ component: Link }} to="/try">
                <ListItemIcon>
                  <SportsEsports fontSize="small" />
                </ListItemIcon>
                <ListItemText>Try</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose} {...{ component: Link }} to="/getting-started">
                <ListItemIcon>
                  <RocketLaunch fontSize="small" />
                </ListItemIcon>
                <ListItemText>Getting started</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose} {...{ component: Link }} to="/api-react">
                <ListItemIcon>
                  <SvgIcon>
                    <ReactIcon />
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText>React API</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose} {...{ component: Link }} to="/api-json">
                <ListItemIcon>
                  <SvgIcon>
                    <JsonIcon />
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText>Json API</ListItemText>
              </MenuItem>
            </Menu>
            <MuiLink {...{ component: Link }} to="/" underline="none" color="inherit">
              <Typography variant="h6" noWrap>
                JsonUI
              </Typography>
            </MuiLink>

            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
              <IconButton size="large" color="inherit" component="a" href="https://github.com/fodori/jsonui">
                <GitHub />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
              <IconButton size="large" color="inherit" component="a" href="https://www.npmjs.com/package/@jsonui/react">
                <SvgIcon>
                  <NpmIcon />
                </SvgIcon>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Container sx={{ mt: 10 }}>
        <div style={{ paddingBottom: 40 }}>
          <Outlet />
        </div>
      </Container>
    </Box>
  )
}
