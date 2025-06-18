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
import {Link, useNavigate} from "react-router-dom";
import {CartDTO} from "./Types/CartDTO";
import Header from "./Header";

interface LoginResponse {
    message: string;
    id: number;
}

const SignUpForm: React.FC<{ setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }> = ({setIsLoggedIn}) => {

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
    const navigate = useNavigate();

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

    const handleSubmitSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shopUserCreationDTO)
            });

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

    const handleSubmitLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDTO)
            });

            const result: LoginResponse = await response.json();
            if (response.ok) {
                setError(null);
                localStorage.setItem("logged-in", "true");
                localStorage.setItem("user-id", result.id.toString());
                setIsLoggedIn(true);

            } else {
                throw new Error(result.message);
            }
        } catch (err: unknown) {
            setError((err as Error).message);
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cart/get/${localStorage.getItem("user-id")}`);
            const result: CartDTO = await response.json();
            if (response.ok) {
                setError(null);
                localStorage.setItem("cart-id", result.id.toString());
                navigate("/");
            }
        } catch (err: unknown) {
        }
    };

    return (
        <div>
            <Header headerText="My Account"/>
            <Container className="container">
                <Avatar className="avatar">
                    <AccountCircle/>
                </Avatar>
                <Typography className="signup-typography">
                    Log In
                </Typography>
                <form className="signup-form" onSubmit={handleSubmitLogin}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                className="signup-textfield"
                                name="email"
                                variant="outlined"
                                required
                                fullWidth
                                label="Email"
                                type="text"
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
                    <div className="forgot-password-div">
                        <Link to="/forgot_password"
                              className="forgot-password-link"
                        >
                            Forgot Password?
                        </Link>
                    </div>
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
                <form className="signup-form" onSubmit={handleSubmitSignup}>
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
                                type="text"
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

export default SignUpForm;