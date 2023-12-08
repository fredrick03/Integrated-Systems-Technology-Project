import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import axios from 'axios';


const Links = ['Home', 'Itinerary', 'Loan'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const RestaurantsNearby = () => {
    const [token2, setToken2] = useState('');
    const [username, setUsername] = useState('');
    const [location, setLocation] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedRestaurant, setSelectedRestaurant] = useState({});
    const navigate = useNavigate(); // Use useNavigate instead of useHistory


  useEffect(() => {
    const storedToken2 = sessionStorage.getItem('token2');
    setToken2(storedToken2 || '');

    const storedUsername = sessionStorage.getItem('username');
    setUsername(storedUsername || '');

    const storedLocation = sessionStorage.getItem('location');
    setLocation(storedLocation || '');

    axios.get('http://ucanteen2.g3cwh8fvd9frdmeg.southeastasia.azurecontainer.io/users/restaurants/nearby', {
      headers: {
        Authorization: `Bearer ${token2}`,
      },
    })
      .then((response) => {
        setRestaurants(response.data);
      })
      .catch((error) => {
        console.error('Error fetching restaurants:', error);
      });
  }, [token2]);

  const handleCheckMenu = (restaurant) => {
    sessionStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
    navigate(`/restaurant/nearby/${restaurant.restaurant_name}/menu`);
  };

  const Logout = () => {
    sessionStorage.setItem('token1', '');
    sessionStorage.setItem('token2', '');
  };

  const bgColor = useColorModeValue('teal.200', 'teal.900');
  const boxColor = useColorModeValue('white', 'gray.700');

  return (
    <Box>
      {token2 ? (
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
                  <Link to="/login" onClick={Logout}>
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
        mt={token2 ? 0 : 10}
        mx={10}
      >
        {/* Konten utama */}
        {token2 ? (
          <Box margin="auto">
            <Heading fontSize={'4xl'} mb={2} mt={5}>
              Restaurants Near Your Location,
            </Heading>
            <Heading fontSize={'4xl'} mb={8} mt={2}>{location}</Heading>

            {/* Menu Wisata */}
            {restaurants ? (
              <SimpleGrid spacing={10} mt={5} columns={[1, null, 3]}>
                {restaurants.map((restaurant) => (
                  <Card key={restaurant.restaurant_id} bg={boxColor}>
                    <CardHeader>
                      <Link
                        to={`/restaurants/${restaurant.restaurant_id}`}
                      >
                        <strong>{restaurant.restaurant_name}</strong>
                      </Link>
                    </CardHeader>
                    <CardBody>
                        <Text>Detail Location: {restaurant.detail_location}</Text>
                        <Text>Distance: {restaurant.distance_m} meters</Text>
                        <Text>Rating: {restaurant.rating}</Text>
                    </CardBody>
                    <CardFooter align={'center'} justify={'center'}>
                    <Button
                        bg={'teal.200'}
                        // as={Link}
                        // to="#"
                        onClick={() => handleCheckMenu(restaurant)}
                        >
                        Check Menu
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

export default RestaurantsNearby;

