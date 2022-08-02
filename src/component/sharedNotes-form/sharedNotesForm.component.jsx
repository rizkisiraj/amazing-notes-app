import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useContext, useState } from "react"
import { userContext } from "../../contexts/user.context";
import { addPublicUser, createPublicNotes, searchNote } from "../../utils/firebase/firebase";



const SharedNotesForm = ({modalOpen, setModalOpen}) => {
    const [inputId,setInputId] = useState("");
    const [searchId, setsearchId] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [alert, setAlert] = useState(false);
    const {userData, setUserData, currentUser} = useContext(userContext);
    const handleOpen = () => {
        setAlert(false)
        setModalOpen(false);
    }

    const handleChange = (e) => {
        if(!isCreating) {
            setsearchId(e.target.value);
            return;
        }
        setInputId(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!isCreating) {
           const notesId = await searchNote(searchId);
           await addPublicUser(currentUser,notesId);
           
           if(notesId) {
                setAlert(false);
                setUserData({
                    ...userData,
                    sharedNotes: notesId
                })
                setModalOpen(false);
                return;
            } 
            setAlert(true);

        } else {
            const notesId = await createPublicNotes(inputId);
            if(notesId) {
                await addPublicUser(currentUser, inputId);
                setUserData({
                    ...userData,
                    sharedNotes: inputId
                })
                setModalOpen(false);
            }

        }
    }

    return (
        <Dialog
        open={modalOpen}
        onClose={handleOpen}
        maxWidth={"md"}
        fullWidth
        >
            <DialogTitle sx={{display: "flex", justifyContent: "space-between"}}>
                {!isCreating ? "Search Notes" : "Create Notes"}
                <Button variant="text" color="primary" onClick={()=> setIsCreating(!isCreating)}>{!isCreating ? "Create notes" : "Search notes"}</Button>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                <TextField
                fullWidth
                label="Notes Id"
                variant="filled"
                value={isCreating ? inputId : searchId}
                onChange={handleChange}
                sx={{mb: 2}}

                />
                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                    <Button variant="contained" color="primary" type="submit">
                        {isCreating ? "Create Notes" : "Search Notes"}
                    </Button>
                    <Typography color={!alert ? "InactiveCaption" : "red"} component="span" variant="body2">No notes with that id</Typography>
                </Box>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default SharedNotesForm;