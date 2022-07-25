
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { editedModalContext } from "../../contexts/editedModal.context";
import { userContext } from "../../contexts/user.context";
import { addNotes, addPublicNotes, updateNotes, updatePublicNotes } from "../../utils/firebase/firebase";
import { useLocation } from "react-router-dom";


const noteConstructor = {
    title: "",
    details: ""
}

const ModalForm = () => {
    const [note, setNote] = useState(noteConstructor);
    const { title, details } = note;
    const [category,setCategory] = useState("");
    const [type, setType] = useState("Private");
    const [titleError, setTitleError] = useState(false);
    const [detailsError, setDetailsError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const location = useLocation();
    const { currentUser,userData } = useContext(userContext);
    const { modalOpen, setModalOpen, editedModal, setEditedModal } = useContext(editedModalContext);
    const theme = useTheme();
    const fullscreen = useMediaQuery(theme.breakpoints.down("md"))

    useEffect(() => {
        if(editedModal) {
            setNote({
                title: editedModal.title,
                details: editedModal.details
            })
            setCategory(editedModal.category)
            setType(editedModal.type)
        }
    },[editedModal]);

    useEffect(() => {
        if(location.pathname === "/shared-notes") {
            setType("Public")
        } else {
            setType("Private")
        }
    },[location.pathname])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNote({
            ...note,
            [name] : value
        })
    }

    const resetTextField = () => {
        setNote({
            title: "",
            details: "",
        })
        setCategory("");
    }

    const handleModal = () => {
        resetTextField();
        setEditedModal(null)
        setModalOpen(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTitleError(false);
        setDetailsError(false);
        setCategoryError(false)

        if(!title) {
            setTitleError(true)
        }

        if(!details) {
            setDetailsError(true)
        }

        if(!category) {
            setCategoryError(true)
        }

        if(title && details && category) {
            setModalOpen(false);
            if(editedModal) {
                if(type === "Public") {
                    await updatePublicNotes(userData,editedModal.createdAt,{
                        title,
                        details,
                        category,
                    })
                } else {
                    await updateNotes(currentUser,editedModal.createdAt,{
                        title,
                        details,
                        category,
                    })
                }
            } else {
                if(type === "Public") {
                    await addPublicNotes(userData,{title, details, category});
                } else {
                    await addNotes(currentUser,{title, details, category})
                    
                }
            }
            resetTextField();
            console.log("sudah ditambahkan kak");
            setEditedModal(null);
        }
    }

    return (
        <Dialog
            fullScreen={fullscreen}
            fullWidth
            maxWidth={"sm"}
            open={modalOpen}
            onClose={handleModal}
        >
            <DialogTitle>
                Add Note
            </DialogTitle>
            <Divider />
                <form onSubmit={handleSubmit}>
                <DialogContent>
                <Select
                    labelId="personal or shared select"
                    id="simple-select"
                    value={type}
                    sx={{mb: 2}}
                >
                    <MenuItem value={"Private"}>Private</MenuItem>
                    <MenuItem value={"Public"}>Public</MenuItem>
                </Select>
                <TextField
                name="title"
                value={title}
                onChange={handleChange}
                error={titleError}
                variant="outlined"
                color="secondary"
                label="Title"
                sx={{display: "block",mb: 2}}
                fullWidth
                required
                />
                <TextField
                name="details"
                value={details}
                onChange={handleChange}
                error={detailsError}
                variant="outlined"
                color="secondary"
                label="Body"
                sx={{display: "block", mb: 2}}
                fullWidth
                multiline
                rows={6}
                required
                />
                <FormControl color='secondary' error={categoryError}>
                    <FormLabel>Category</FormLabel>
                        <RadioGroup value={category} onChange={(e) => setCategory(e.target.value)} row>
                            <FormControlLabel value="money" control={<Radio />} label="Money"/>
                            <FormControlLabel value="todos" control={<Radio />} label="Todos"/>
                            <FormControlLabel value="reminder" control={<Radio />} label="Reminder"/>
                            <FormControlLabel value="work" control={<Radio />} label="Work"/>
                        </RadioGroup>
                </FormControl>
                 </DialogContent>
                 <Divider />
                 <DialogActions>
                    <Button type="submit" variant="contained" color="primary">Save</Button>
                    <Button type="button" variant="outlined" color="primary" onClick={handleModal}>Close</Button>
                 </DialogActions>
                </form>
        </Dialog>
    )
}

export default ModalForm;