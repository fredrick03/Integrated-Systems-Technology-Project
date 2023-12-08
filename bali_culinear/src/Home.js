import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Flex,
  Box,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  useColorModeValue,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Stack,
  Avatar,
  useDisclosure,
} from '@chakra-ui/react';
import {
  Search2Icon,
  AddIcon,
  HamburgerIcon,
  CloseIcon,
} from '@chakra-ui/icons';

const Links = ['Home', 'Itinerary', 'Loan'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const Home = () => {
  const [token1, setToken1] = useState('');
  const [username, setUsername] = useState('');
  const [destinations, setDestinations] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Ambil token dari sessionStorage atau localStorage saat komponen dipasang
    const storedToken1 = sessionStorage.getItem('token1');
    console.log('Token1:', storedToken1);
    setToken1(storedToken1 || ''); // Jika tidak ada token, gunakan string kosong

    const storedUsername = sessionStorage.getItem('username');
    console.log('Username:', storedUsername);
    setUsername(storedUsername || ''); // Jika tidak ada token, gunakan string kosong

    // Ambil data destinasi dari API saat komponen dipasang
    axios
      .get('https://ayokebalitst.azurewebsites.net/destination', {
        headers: {
          Authorization: `Bearer ${token1}`, // Menggunakan token1 dalam header Authorization
        },
      })
      .then((response) => {
        setDestinations(response.data);
      })
      .catch((error) => {
        console.error('Error fetching destinations:', error);
      });
  }, [token1]); // Perubahan token1 akan memicu pengambilan data ulang

  const Logout = () => {
    sessionStorage.setItem('token1', '');
    sessionStorage.setItem('token2', '');
  };

  const bgColor = useColorModeValue('teal.200', 'teal.900');
  const boxColor = useColorModeValue('white', 'gray.700');

  return (
    <Box>
      {token1 ? (
        <Box bg={bgColor} px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <IconButton
              size={'md'}
              icon={<HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={'center'}>
              <Box>BALI CULINEAR</Box>
              <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                {Links.map((link) => (
                  <Button
                    bg={bgColor}
                    key={link}
                    as={Link}
                    to={`/${link.toLowerCase()}`}
                    variant="ghost"
                  >
                    {link}
                  </Button>
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={'center'}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Text>Hi, {username.toUpperCase()}</Text>
                </MenuButton>
                <MenuList>
                  <Link to="/" onClick={Logout}>
                    Logout
                  </Link>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as={'nav'} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link} to={`/${link.toLowerCase()}`}>
                    {link}
                  </NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>
      ) : null}

      <Flex
        align={'center'}
        justify={'center'}
        textAlign="center"
        mt={token1 ? 0 : 10}
        mx={10}
      >
        {/* Konten utama */}
        {token1 ? (
          <Box margin="auto">
            <Heading fontSize={'5xl'} mb={8} mt={5}>
              Where to Go in Bali
            </Heading>
            <Button bg={'teal.200'} as={Link} to={`/add-itinerary`} mb={4}>
              Create Itinerary
            </Button>

            {/* Destinasi Wisata */}
            {destinations ? (
              <SimpleGrid spacing={10} mt={5} columns={[1, null, 5]}>
                {destinations.map((destination) => (
                  <Card key={destination.destination_id} bg={boxColor}>
                    <CardHeader>
                      <Link
                        to={`/destination/${destination.destination_id}`}
                      >
                        <strong>{destination.name}</strong>
                      </Link>
                    </CardHeader>
                    <CardBody>{destination.location}</CardBody>
                    <CardFooter align={'center'} justify={'center'}>
                      <Button
                        bg={'teal.200'}
                        as={Link}
                        to={`/destination/${destination.destination_id}`}
                      >
                        Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            ) : (
              <p>Loading...</p>
            )}
          </Box>
        ) : (
          <p>Anda tidak memiliki akses. Silakan login terlebih dahulu.</p>
        )}
      </Flex>
    </Box>
  );
};

export default Home;

