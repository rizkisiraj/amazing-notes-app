import { CircularProgress, Grid } from "@mui/material";
import { Box, Container } from "@mui/system";
import { collection, orderBy, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react"
import NoteCard from "../../component/note-card/noteCard.component";
import { userContext } from "../../contexts/user.context";
import { db, onDocumentSnapshotListener } from "../../utils/firebase/firebase";


const SharedNotes = () => {
    const [notes,setNotes] = useState([]);
    const [loader,setLoader] = useState(true);
    const { userData, currentUser } = useContext(userContext);

    useEffect(() => {
        if(currentUser && userData) {
            if(userData.sharedNotes) {
                const collectionRef = collection(db, "shared notes", userData.sharedNotes, "notelist");
                const q = query(collectionRef,orderBy("pinned",'desc'))
                console.log(currentUser)
                const unsubsctibe = onDocumentSnapshotListener(q,(snapshot) => {
                const liberalData = [];
                snapshot.forEach(snap => liberalData.push(snap.data()))
                setNotes(liberalData);
            })
            setLoader(false);
            return unsubsctibe
            }
        setLoader(false);
        }
    },[currentUser, userData])

    return (
        <Container>
            {
                loader ? 
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
                    <CircularProgress />
                </Box>
                :
            
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
    )
}

export default SharedNotes