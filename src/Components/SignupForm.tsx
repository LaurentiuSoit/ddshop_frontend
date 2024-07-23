import React, {useState} from 'react';

interface ShopUserCreationDTO {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
}

const SignupForm: React.FC = () => {
    const [shopUserCreationDTO, setShopUserCreationDTO] = useState<ShopUserCreationDTO>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setShopUserCreationDTO(prevState => ({
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
            <h2>Signup</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>Signup successful</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor={"firstName"}>First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={shopUserCreationDTO.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor={"lastName"}>Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shopUserCreationDTO.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor={"email"}>Email:</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={shopUserCreationDTO.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor={"phoneNumber"}>Phone Number:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={shopUserCreationDTO.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor={"password"}>PassWord:</label>
                    <input
                        type="text"
                        id="password"
                        name="password"
                        value={shopUserCreationDTO.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Signup</button>
            </form>
        </div>
    )
};

export default SignupForm;