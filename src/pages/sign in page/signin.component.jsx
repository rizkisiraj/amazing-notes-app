import { Box, Button, InputAdornment, TextField, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth, setUserObject, signAuthUserWithEmailAndPassword} from "../../utils/firebase/firebase";
import { userContext } from "../../contexts/user.context";
import { useNavigate } from "react-router-dom";
import LoadingDialog from "../../component/loadingDialog/loadingDialog.component";


const inputStyle = {
    display: "block",
    marginBottom: "20px"
}

const inputs = {
    fullname: "",
    email: "",
    password: ""
}

const SignIn = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [input, setInput] = useState(inputs);
    const [fullnameError, setFullNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const { fullname,email,password } = input;
    const { setUserData,currentUser } = useContext(userContext);
    const navigate = useNavigate()

    const theme = useTheme();
    useEffect(() => {
        if(currentUser) {
            navigate("/");
        }
    },[currentUser])

    const resetTextField = () => {
        setInput({
            fullname: "",
            email: "",
            password: ""
        })
    }

    const handleModal = () => {
        setDialogOpen(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError(false)
        setPasswordError(false)
        setFullNameError(false)

        if(!email) {
            setEmailError(true)
        }

        if(!password) {
            setPasswordError(true)
        }

        if(isRegistering) {
            if(!fullname) {
                setFullNameError(true)
            }

            if(fullname && email && password) {
                setDialogOpen(true)
                const response = await createAuthUserWithEmailAndPassword(email,password);
                await createUserDocumentFromAuth(response.user, { displayName: fullname })
                const userCred = await setUserObject(response.user);
                setUserData(userCred);
                resetTextField();
                navigate("/")
            }
            return;
        }

        if(email && password) {
            setDialogOpen(true)
            const response = await signAuthUserWithEmailAndPassword(email, password);
            await createUserDocumentFromAuth(response.user, { displayName: fullname })
            const userCred = await setUserObject(response.user);
            setUserData(userCred);
            resetTextField();
            navigate("/")
        }
    }

    const handleChange = e => {
        const { name,value } = e.target;
        setInput({
            ...input,
            [name] : value
        })

    }

    return (
        <Box sx={{display: "flex", minHeight: "100vh", width: "100%", backgroundColor: theme.palette.primary.main, justifyContent: "center", alignItems: {xs: "end", sm: "center"}}}>
        <Box borderRadius={2} boxShadow={10} sx={{width: "100%", maxWidth: {sm: "512px"}, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", bgcolor:"white", pb: {xs:13, sm: 5}}}>
            <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="primary"
            >
                {!isRegistering ? "Sign In" : "Sign Up"}
            </Typography>
            <form noValidate autoComplete="off" style={{width: "100%", marginTop: "2rem"}} onSubmit={handleSubmit}>
                {
                    isRegistering ?
                    (
                        <TextField 
                        name="fullname"
                        type="text"
                        color="secondary"
                        value={fullname}
                        variant="filled"
                        placeholder="Name"
                        style={inputStyle}
                        error={fullnameError}
                        fullWidth
                        onChange={handleChange}
                        InputProps={{
                        endAdornment: (
                        <InputAdornment position="start">
                            <AccountCircleIcon />
                        </InputAdornment>
                        )}
                        }
                    />
                    ) : null
                }
                <TextField 
                    name="email"
                    type="email"
                    color="secondary"
                    variant="filled"
                    value={email}
                    onChange={handleChange}
                    error={emailError}
                    placeholder="Email"
                    style={inputStyle}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="start">
                            <AlternateEmailIcon />
                        </InputAdornment>
                        )}
                    }
                />
                <TextField 
                    name="password"
                    type="password"
                    color="secondary"
                    variant="filled"
                    onChange={handleChange}
                    value={password}
                    error={passwordError}
                    placeholder="Password"
                    style={inputStyle}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="start">
                            <LockRoundedIcon />
                        </InputAdornment>
                        )}
                    }
                />
                <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                >
                    {!isRegistering ? "Sign In" : "Register"}
                    
                </Button>
                {
                    !isRegistering && (
                        <>
                        <Typography
                        mt={1}
                        mb={1}
                        variant="body2"
                        component="span"
                        display="block"
                        textAlign="center"
                        >
                            OR
                        </Typography>
                        <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        color="secondary"
                        onClick={() => {
                            setIsRegistering(true)
                            setEmailError(false)
                            setFullNameError(false)
                            setPasswordError(false)
                            resetTextField();
                        }}
                        >
                            Register
                        </Button>
                        </>
                    )  
                }
            </form>
        </Box>
            <LoadingDialog modalOpen={dialogOpen} handleModal={handleModal} />
        </Box>
    )
}

export default SignIn;