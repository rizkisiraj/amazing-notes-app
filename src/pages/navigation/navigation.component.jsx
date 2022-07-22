import { AppBar, Avatar, Divider, Drawer, Fab, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Toolbar, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PeopleIcon from '@mui/icons-material/People';
import { Box } from "@mui/system";
import { lightGreen } from "@mui/material/colors";
import ModalForm from "../../component/modal-form/modal-form.component";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { editedModalContext } from "../../contexts/editedModal.context";
import { userContext } from "../../contexts/user.context";
import { signOutUser } from "../../utils/firebase/firebase";


const drawerWidth = 240;
const setNickname = (name) => {
    const whiteSpace = name.indexOf(" ");
    return name.substring(0,whiteSpace)
}

const Navigation = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { userData,currentUser } = useContext(userContext);
    const location = useLocation()
    const handleAppBar = () => setMobileOpen(!mobileOpen)
    const { setModalOpen } = useContext(editedModalContext)
    const navigate = useNavigate();

    // useEffect(() => {
    //     if(!currentUser) {
    //         navigate("/signin")
    //     }
    // },[])

    return (
        
        <div style={{display: "flex"}}>
            <AppBar
            sx={{width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
            component="nav"
            color="primary"
            elevation={1}
            >
                <Toolbar
                sx={{display: "flex", justifyContent: "space-between"}}
                >
                    <IconButton
                    onClick={handleAppBar}
                    sx={{display: {sm: "none"}, mr: 1}}
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                    variant="h6"
                    component="div"
                    sx={{flexGrow: 1}}
                    >
                        Notes
                    </Typography>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Fab size="medium" color="secondary" aria-label="add" onClick={() => setModalOpen(true)}>
                        <AddOutlinedIcon />
                    </Fab>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleAppBar}
            anchor="left"
            ModalProps={{keepMounted: true}}
            sx={{display: {xs: 'block', sm: "none"}}}
            >
                <Toolbar>
                {
                    !userData ? 
                    <Skeleton animation="wave" variant="circular"><Avatar variant="circular" /></Skeleton>
                    :
                    <Avatar
                    variant="circular"
                    sx={{bgcolor: lightGreen[500]}}
                    >
                        {userData.displayName.substring(0,1)}
                    </Avatar>
                }
                <Typography variant="body1" component="h1" sx={{paddingLeft: "1rem"}}>
                    {
                        userData ? setNickname(userData.displayName) : <Skeleton animation="wave" width={90} />
                    }
                </Typography>
            </Toolbar>
            <Divider />
            <Box sx={{height: "100%" ,overflow: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <List>
                    <ListItem component={NavLink} key="my notes" to="/" selected={location.pathname === "/"}>
                        <ListItemIcon>
                            <ArticleIcon />
                        </ListItemIcon>
                        <ListItemText primary="My Notes" />
                    </ListItem>
                    <ListItem component={NavLink} key="shared notes" to="/shared-notes" selected={location.pathname === "/shared-notes"}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Shared Notes" />
                    </ListItem>
                </List>
                <List>
                    <ListItem key="signout">
                        <ListItemButton>
                        <ListItemIcon>
                            <LogoutOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" />
                    </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            </Drawer>
            <Drawer color="primary"
            variant="permanent"
            sx={{
              display: {xs: "none", sm: "block"},
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
            >
            <Toolbar>
                {
                    !userData ? 
                    <Skeleton animation="wave" variant="circular"><Avatar variant="circular" /></Skeleton>
                    :
                    <Avatar
                    variant="circular"
                    sx={{bgcolor: lightGreen[500]}}
                    >
                        {userData.displayName.substring(0,1)}
                    </Avatar>
                }
                <Typography variant="body1" component="h1" sx={{paddingLeft: "1rem"}}>
                    {
                        userData ? setNickname(userData.displayName) : <Skeleton animation="wave" width={90} />
                    }
                </Typography>
            </Toolbar>
            <Divider />
            <Box sx={{height: "100%" ,overflow: "auto", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <List>
                    <ListItem component={NavLink} key="my notes" to="/" selected={location.pathname === "/"}>
                        <ListItemIcon>
                            <ArticleIcon />
                        </ListItemIcon>
                        <ListItemText primary="My Notes" />
                    </ListItem>
                    <ListItem component={NavLink} key="shared notes" to="/shared-notes" selected={location.pathname === "/shared-notes"}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Shared Notes" />
                    </ListItem>
                </List>
                <List>
                    <ListItem key="signout">
                        <ListItemButton onClick={() => {
                            signOutUser().then(() => navigate("/signin"))
                            
                            }}>
                        <ListItemIcon>
                            <LogoutOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" />
                    </ListItemButton>
                    </ListItem>
                </List>
            </Box>
            </Drawer>
            <Box sx={{width: "100%", paddingTop: "5rem", paddingBottom: "2rem"}}>
                <Outlet />
            </Box>
            <ModalForm />
        </div>
    )
}

export default Navigation;