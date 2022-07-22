import { Dialog, DialogContent, Typography } from "@mui/material"

const LoadingDialog = ({modalOpen, handleModal}) => {
        

        
     return (   
        <Dialog
            fullWidth
            maxWidth={"sm"}
            open={modalOpen}
            onClose={handleModal}
        >
            <DialogContent>
                <Typography
                variant="h4"
                component="p"
                >
                    Signing in...
                </Typography>
            </DialogContent>
        </Dialog>
    )
}

export default LoadingDialog;