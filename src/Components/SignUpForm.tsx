import React, {useState} from 'react';
import {ShopUserCreationDTO} from "./Types/ShopUserCreationDTO";
import {LoginDTO} from "./Types/LoginDTO";
import {
    Avatar,
    Button,
    Container,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import {AccountCircle, Lock, Visibility, VisibilityOff} from "@mui/icons-material";
import "./SignUpForm.css"

const AccountForm: React.FC = () => {

    const [shopUserCreationDTO, setShopUserCreationDTO] = useState<ShopUserCreationDTO>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });

    const [loginDTO, setLoginDTO] = useState<LoginDTO>({
        email: '',
        password: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleChangeSignUp = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setShopUserCreationDTO(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChangeLogIn = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setLoginDTO(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shopUserCreationDTO)
            });

            if (!response.ok) {
                throw new Error('Signup failed.');
            }

            const result = await response.text();
            console.log('Response text: ', result);
            if (response.ok) {
                setSuccess(result);
                setError(null);
            } else {
                throw new Error('Signup failed.');
            }
        } catch (err: unknown) {
            setError((err as Error).message);
            setSuccess(null);
        }
    };

    return (
        <div>
            <header className="my-account-header">
                <picture className="header-image">
                    <img src="https://www.kultofathena.com/wp-content/uploads/2021/03/weapons_page_title_bar.jpg"/>
                </picture>
                <h1 className="my-account-text">
                    My Account
                </h1>
            </header>
            <Container className="container">
                <Avatar className="avatar">
                    <AccountCircle/>
                </Avatar>
                <Typography className="signup-typography">
                    Log In
                </Typography>
                <form className="signup-form">
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
                                onChange={handleChangeLogIn}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="signup-textfield"
                                name="password"
                                variant="outlined"
                                required
                                fullWidth
                                label="Password"
                                onChange={handleChangeLogIn}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
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
                        LOG IN
                    </Button>
                </form>
            </Container>
            <Container className="container">
                {error && <h2 style={{color: 'red'}}>{error}</h2>}
                {success && <h2 style={{color: 'green'}}>Signup successful</h2>}
                <Avatar className="avatar">
                    <Lock/>
                </Avatar>
                <Typography className="signup-typography">
                    Sign Up
                </Typography>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                className="signup-textfield"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                label="First Name"
                                type="text"
                                onChange={handleChangeSignUp}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="signup-textfield"
                                name="lastName"
                                variant="outlined"
                                required
                                fullWidth
                                label="Last Name"
                                type="text"
                                onChange={handleChangeSignUp}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="signup-textfield"
                                name="email"
                                variant="outlined"
                                required
                                fullWidth
                                label="Email"
                                type="email"
                                onChange={handleChangeSignUp}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="signup-textfield"
                                name="phoneNumber"
                                variant="outlined"
                                required
                                fullWidth
                                label="Phone Number"
                                type="text"
                                onChange={handleChangeSignUp}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="signup-textfield"
                                name="password"
                                variant="outlined"
                                required
                                fullWidth
                                label="Password"
                                onChange={handleChangeSignUp}
                                type={showPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
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
                        SIGN UP
                    </Button>
                </form>
            </Container>
        </div>

    )
}

export default AccountForm;