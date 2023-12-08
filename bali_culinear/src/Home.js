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
  HStack,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
} from '@chakra-ui/icons';

const Links = ['Home', 'Itinerary'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const storedToken1 = sessionStorage.getItem('token1');
  const username = sessionStorage.getItem('username');

  useEffect(() => {
    // fetch destination data
    axios.get('https://ayokebalitst.azurewebsites.net/destination', {
        headers: {
          Authorization: `Bearer ${storedToken1}`,
        },
      })
      .then((response) => {
        setDestinations(response.data);
      })
      .catch((error) => {
        console.error('Error fetching destinations:', error);
      });
  }, [storedToken1]);

  const Logout = () => {
    sessionStorage.setItem('token1', '');
    sessionStorage.setItem('token2', '');
  };

  const bgColor = useColorModeValue('#1C5739', 'teal.900');
  const boxColor = useColorModeValue('#D4E09B', 'gray.700');

  return (
    <Box color={'#F5FFF5'}>
      {storedToken1 ? (
        <Box bg={bgColor} px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <IconButton
              size={'md'}
              icon={<HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={'center'} textColor={'white'}>
              <Box>BALI CULINEAR</Box>
              <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                {Links.map((link) => (
                  <Button
                  bg={bgColor}
                  key={link}
                  as={Link}
                  to={`/${link.toLowerCase()}`}
                  variant="ghost"
                  color={'white'}
                  _hover={{
                    bg: '#D4E09B',
                    }}
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
                  bg={bgColor}
                  color={'white'}
                  cursor={'pointer'}
                  _hover={{
                    bg: '#D4E09B',
                    }}
                  minW={0}>
                  <Text>Hi, {username.toUpperCase()}</Text>
                </MenuButton>
                <MenuList>
                  <Link to="/" onClick={Logout} style={{color:'black'}}>
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
        mt={storedToken1 ? 0 : 10}
        mx={10}
      >
        {/* Konten utama */}
        {storedToken1 ? (
          <Box margin="auto">
            <Heading fontSize={'4xl'} mb={8} mt={5} color={'#1C5739'}>
              Where to Go in Bali
            </Heading>
            <Button bg={'#1C5739'} as={Link} to={`/add-itinerary`} mb={4} color={'white'}>
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
                        bg={'#1C5739'}
                        as={Link}
                        to={`/destination/${destination.destination_id}`}
                        color={'#F5FFF5'}
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

