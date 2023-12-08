import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const apiUrlRegister1 = 'https://ayokebalitst.azurewebsites.net/register';
        const apiUrlRegister2 = 'https://ucanteen.azurewebsites.net/signup';

        // Membuat dua permintaan registrasi secara bersamaan
        const [response1, response2] = await Promise.all([
            axios.post(apiUrlRegister1, {
                username: username,
                password: password,
            }),
            axios.post(apiUrlRegister2, {
                username: username,
                email: email,
                password: password,
                name: name,
                university_name: location,
                phone_number: phone_number
            }),
        ]);

        // Handle respons dari kedua API sesuai kebutuhan aplikasi Anda
        // Handle response1
        if (response1.data.username) {
            // Handle successful registration for API 1
            console.log('API 1 Registration Success:', response1.data);
        } else {
            // Handle registration failure for API 1
            console.log('API 1 Registration Failed:', response1.data);
        }

        // Handle response2
        if (response2.data.username) {
            // Handle successful registration for API 2
            console.log('API 2 Registration Success:', response2.data);
        } else {
            // Handle registration failure for API 2
            console.log('API 2 Registration Failed:', response2.data);
        }

        // Check if both registrations were successful
        if (response1.data.username && response2.data.username) {
            alert('Registration Success!');
            navigate('/');
        } else {
            alert('Registration failed. Please try again.');
        }

    } catch (error) {
        if (error.response) {
            if (error.response.status === 422) {
                setError('Username is already in used');
            } else if (error.response.status === 400) {
                setError('Username is already in used');
            } else {
                console.log(error);
                setError('Error. Please try again.');
            }
        } else if (error.request) {
            console.log(error);
            setError('Failed to send request.');
        } else {
            console.log(error);
            setError('Error. Please try again.');
        }
    }
  };

  return (
    <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('#1C5739', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
                <Heading fontSize={'4xl'} textColor={'white'}>Welcome to Bali Culinear</Heading>
            </Stack>
            <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}>
                <Stack spacing={4}>
                    <Heading fontSize={'2xl'}>Register</Heading>
                <form onSubmit={handleSubmit}>
                    <FormControl mb={4} isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input type="text" value={username} onChange={handleUsernameChange} required />
                    </FormControl>
                    <FormControl id="email" mb={4} isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" value={email} onChange={handleEmailChange} autoComplete="email" required />
                    </FormControl>
                    <FormControl id="password" isRequired mb={4}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange}/>
                        <InputRightElement h={'full'}>
                        <Button
                            variant={'ghost'}
                            onClick={() => setShowPassword((showPassword) => !showPassword)}>
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                        </InputRightElement>
                    </InputGroup>
                    </FormControl>
                    <FormControl id="name" mb={4} isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input type="text" value={name} onChange={handleNameChange} autoComplete="name" required />
                    </FormControl>
                    <FormControl id="location" mb={4} isRequired>
                    <FormLabel>Location</FormLabel>
                    <Input type="text" value={location} onChange={handleLocationChange} required />
                    </FormControl>
                    <FormControl id="phone_number" mb={4} isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input type="text" value={phone_number} onChange={handlePhoneNumberChange} required />
                    </FormControl>
                    <Stack align={'center'}>
                    <Text fontSize={'md'} color={'black'}>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <Link to={`/`}>
                            <Text>Already a user? Login here</Text>
                        </Link>
                    </Text>
                    </Stack>
                    <Stack spacing={10} mt={5}>
                    <Button  type="submit"
                        bg={'#1C5739'}
                        color={'white'}
                        _hover={{
                        bg: '#D4E09B',
                        }}>
                        Register
                    </Button>
                    </Stack>
                </form>
                </Stack>
            </Box>
        </Stack>
    </Flex>
  )
};

export default Register;

