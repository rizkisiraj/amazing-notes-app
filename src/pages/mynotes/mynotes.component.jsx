import { Box, CircularProgress, Grid} from "@mui/material";
import { Container } from "@mui/system";
import { collection, orderBy, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import NoteCard from "../../component/note-card/noteCard.component";
import { userContext } from "../../contexts/user.context";
import { db, onDocumentSnapshotListener } from "../../utils/firebase/firebase";

const MyNotes = () => {
    const [notes,setNotes] = useState([]);
    const [loader, setLoader] = useState(true);
    const { currentUser } = useContext(userContext);

    useEffect(() => {
        if(currentUser) {
            const collectionRef = collection(db, "users", currentUser.uid, "notelist");
            const q = query(collectionRef,orderBy("pinned",'desc'))
            console.log(currentUser)
            const unsubsctibe = onDocumentSnapshotListener(q,(snapshot) => {
                const liberalData = [];
                snapshot.forEach(snap => liberalData.push(snap.data()))
                setNotes(liberalData);
                setLoader(false);
            })
            return unsubsctibe
        }
    },[currentUser])

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


export default MyNotes;