import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import querystring from 'querystringify';
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

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const loginToAPI = async () => {
        try {
            const apiUrlLogin1 = 'https://ayokebalitst.azurewebsites.net/signin';
            const apiUrlLogin2 = 'https://ucanteen.azurewebsites.net/login';
            
            const dataForApi2 = querystring.stringify({
                username: username,
                password: password,
            });

            const [response1, response2] = await Promise.all([
                axios.post(apiUrlLogin1, {
                    username: username,
                    password: password,
                }),
                axios.post(apiUrlLogin2, dataForApi2, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                      },
                }),
            ]);

            if (response1.data.token || response2.data.accsess_token) {
                const token1 = response1.data.token;
                const token2 = response2.data.access_token;
                
                console.log('Token1:', token1);
                sessionStorage.setItem('token1', token1);
                console.log('Token2:', token2);
                sessionStorage.setItem('token2', token2);
                console.log('Username:', username);
                sessionStorage.setItem('username', username);

                navigate('/home');
                alert('Login berhasil');
            } else {
                console.log(response1.data, response2.data);
                alert('Login gagal. Coba lagi.');
            }

        } catch (error) {
        if (error.response) {
            if (error.response.status === 403 || error.response.status === 404 ) {
                setError('Kombinasi username dan password tidak valid.');
            } else {
                console.log(error);
                setError('Terjadi kesalahan. Silakan coba lagi.');
            }
        } else if (error.request) {
            setError('Terjadi kesalahan dalam mengirim permintaan.');
        } else {
            console.log(error);
            setError('Terjadi kesalahan. Silakan coba lagi.');
        }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        loginToAPI();
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
                    <Heading fontSize={'2xl'}>Login</Heading>
                    <form onSubmit={handleSubmit}>
                        <FormControl mb={4} isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input type="text" value={username} onChange={handleUsernameChange} required />
                        </FormControl>
                        <FormControl id="password" isRequired mb={4}>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                            <Input type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} />
                            <InputRightElement h={'full'}>
                            <Button
                                variant={'ghost'}
                                onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                            </InputRightElement>
                        </InputGroup>
                        </FormControl>
                        <Stack align={'center'}>
                        <Text fontSize={'md'} color={'black'}>
                            {error && <span style={{ color: 'red' }}>{error}</span>}
                            <Link to={`/register`}>
                                <Text>Don't have an account?</Text>
                            </Link>
                        </Text>
                        </Stack>
                        <Stack spacing={10} mt={5}>
                        <Button type='submit'
                            bg={'#1C5739'}
                            color={'white'}
                            _hover={{
                            bg: '#D4E09B',
                            }}>
                            Login
                        </Button>
                        </Stack>
                    </form>
                </Stack>
            </Box>
        </Stack>
    </Flex>
  )
}

export default Login;

