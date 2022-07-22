import { Card, CardActions, CardContent, CardHeader, IconButton, Typography } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import PushPinIcon from '@mui/icons-material/PushPin';
import { deleteNotes, pinNote } from "../../utils/firebase/firebase";
import { useContext } from "react";
import { userContext } from "../../contexts/user.context";
import { editedModalContext } from "../../contexts/editedModal.context";

const cardColors = {
    reminder: "#B2C8DF",
    money: "#C9BBCF",
    todos: "#C4DFAA",
    work: "#E4DCCF"
}

const NoteCard = ({note}) => {

    const { title,details,category, createdAt, pinned } = note;
    const { currentUser } = useContext(userContext);
    const { setEditedModal, setModalOpen } = useContext(editedModalContext)

    const handleDelete = async (createdAt) => {
       await deleteNotes(currentUser, createdAt)
    }

    const handlePin = async (createdAt,pinned) => {
        await pinNote(currentUser, createdAt, pinned)
    }

    return (

    <Card elevation={3} sx={{bgcolor: cardColors[category]}}>
            <CardHeader
                action={
                    <IconButton onClick={() => handlePin(createdAt, !pinned)} color={pinned ? "info" : "default"}>
                        <PushPinIcon />
                    </IconButton>
                }
                title={title}
                subheader={category}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary">
                    {details}
                </Typography>
            </CardContent>
            <CardActions disableSpacing sx={{display: "flex", justifyContent: "space-between"}}>
                    <IconButton color="default" onClick={() => {setEditedModal(note)
                        setModalOpen(true)
                    }} >
                        <DriveFileRenameOutlineOutlinedIcon />
                    </IconButton>
                    <IconButton color="default" onClick={() => handleDelete(createdAt)}>
                        <DeleteOutlineIcon />
                    </IconButton>
            </CardActions>
        </Card>
    )
}


export default NoteCard;