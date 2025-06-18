import React, {useState} from 'react'
import {Avatar, Button, Container, Grid, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import PasswordIcon from '@mui/icons-material/Password';
import {Visibility, VisibilityOff} from "@mui/icons-material";

const ChangePassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const [changedPassword, setChangedPassword] = useState<boolean>(false);
    const {userId} = useParams();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const comparePasswords = (password1: string, password2: string) => {
        setPasswordsMatch(password1 === password2);
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);
        comparePasswords(value, confirmNewPassword);
    }

    const handleConfirmNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmNewPassword(value);
        comparePasswords(newPassword, value);
    }


    const handleSubmitChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordsMatch) {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/changePassword?id=${userId}&newPassword=${newPassword}`, {
                    method: 'PUT'
                });
                if (response.ok) {
                    setChangedPassword(true);
                } else {
                    throw new Error("Could not change password.");
                }
            } catch (err: unknown) {
                console.log((err as Error).message);
            }
        }
    }

    return (
        <div>
            {changedPassword && (
                <h1 className="confirm-text">
                    Your password has been changed. You can now log in.
                </h1>
            )}
            {!changedPassword && (
                <Container className="container">
                    <Avatar className="avatar">
                        <PasswordIcon/>
                    </Avatar>
                    <Typography className="signup-typography">
                        Please enter your new password
                    </Typography>
                    <form className="signup-form" onSubmit={handleSubmitChange}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    className="signup-textfield"
                                    name="newPassword"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    defaultValue={newPassword}
                                    label="New Password"
                                    onChange={handleNewPasswordChange}
                                    type={showPassword ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff
                                                            className="password-icon"/>
                                                        :
                                                        <Visibility className="password-icon"/>}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className="signup-textfield"
                                    name="confirmNewPassword"
                                    variant="outlined"
                                    error={!passwordsMatch}
                                    defaultValue={confirmNewPassword}
                                    required
                                    fullWidth
                                    label="Confirm New Password"
                                    onChange={handleConfirmNewPasswordChange}
                                    type={showPassword ? 'text' : 'password'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff
                                                            className="password-icon"/>
                                                        :
                                                        <Visibility className="password-icon"/>}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
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
                            CHANGE PASSWORD
                        </Button>
                    </form>
                </Container>
            )}
        </div>
    )
}

export default ChangePassword;