import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import { collection, orderBy, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react"
import NoteCard from "../../component/note-card/noteCard.component";
import SharedNotesForm from "../../component/sharedNotes-form/sharedNotesForm.component";
import { userContext } from "../../contexts/user.context";
import { db, onDocumentSnapshotListener } from "../../utils/firebase/firebase";


const SharedNotes = () => {
    const [notes,setNotes] = useState([]);
    const [loader,setLoader] = useState(true);
    const [noteDocsId, setNoteDocsId] = useState(null);
    const [isOpen, setModalOpen] = useState(false);
    const { userData, currentUser } = useContext(userContext);

    useEffect(() => {
        if(currentUser && userData) {
            if(userData.sharedNotes) {
                setNoteDocsId(userData.sharedNotes);
                const collectionRef = collection(db, "shared notes", userData.sharedNotes, "notelist");
                const q = query(collectionRef,orderBy("pinned",'desc'))
                const unsubsctibe = onDocumentSnapshotListener(q,(snapshot) => {
                    const liberalData = [];
                    snapshot.forEach(snap => liberalData.push(snap.data()))
                    setNotes(liberalData);
                    setLoader(false);
                })
            return unsubsctibe
            } 
            setLoader(false);
        }
    },[currentUser, userData])

    return (
        <>
        <Container>
            {   loader ? 
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                    <CircularProgress />
                </Box> :
             !noteDocsId ? 
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%", flexDirection: "column"}}>
                    <Typography variant="h4" component="h1" gutterBottom>You have no shared notes...</Typography>
                    <Button variant="contained" color="secondary" onClick={() => setModalOpen(true)} >Create Shared Notes</Button>
                </Box> :
            
            <Grid container spacing={3}>
                {
                    notes && notes.map((note) => {
                        return (
                        <Grid key={note.createdAt} item xs={12} md={6} lg={4}>
                            <NoteCard note={note} />
                        </Grid>
                        )
                    })
                }
            </Grid>
            }
        </Container>
        <SharedNotesForm modalOpen={isOpen} setModalOpen={setModalOpen} /> 
        </>
    )
}

export default SharedNotes