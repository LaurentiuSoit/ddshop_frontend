import React, {useState} from 'react'
import {Avatar, Button, Container, Grid, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [sentEmail, setSentEmail] = useState<boolean>(false);
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const handleSubmitEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        setSentEmail(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/forgotPassword?email=${email}`);
            if (!response.ok) {
                throw new Error("Could not send email.");
            }
        } catch (err: unknown) {
            console.log((err as Error).message);
        }
    }

    return (
        <div>
            {sentEmail && (
                <h1 className="confirm-text">
                    Email for changing password has been sent!
                </h1>
            )}
            {!sentEmail && (
                <Container className="container">
                    <Avatar className="avatar">
                        <EmailIcon/>
                    </Avatar>
                    <Typography className="signup-typography">
                        Please enter your email
                    </Typography>
                    <form className="signup-form" onSubmit={handleSubmitEmail}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    className="signup-textfield"
                                    name="email"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    onChange={handleEmailChange}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            className="signup-button"
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                        >
                            SEND EMAIL
                        </Button>
                    </form>
                </Container>
            )}
        </div>
    )
}

export default ForgotPassword;