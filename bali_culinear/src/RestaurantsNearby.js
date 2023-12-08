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
  HStack,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
} from '@chakra-ui/icons';
import axios from 'axios';


const Links = ['Home', 'Itinerary'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const RestaurantsNearby = () => {
    const storedToken2 = sessionStorage.getItem('token2');
    const username = sessionStorage.getItem('username');
    const [location, setLocation] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate(); 


  useEffect(() => {
    const storedLocation = sessionStorage.getItem('location');
    setLocation(storedLocation || '');

    axios.get('http://ucanteen2.g3cwh8fvd9frdmeg.southeastasia.azurecontainer.io/users/restaurants/nearby', {
      headers: {
        Authorization: `Bearer ${storedToken2}`,
      },
    })
      .then((response) => {
        setRestaurants(response.data);
      })
      .catch((error) => {
        console.error('Error fetching restaurants:', error);
      });
  }, [storedToken2]);

  const handleCheckMenu = (restaurant) => {
    sessionStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
    navigate(`/restaurant/nearby/${restaurant.restaurant_name}/menu`);
  };

  const Logout = () => {
    sessionStorage.setItem('token1', '');
    sessionStorage.setItem('token2', '');
  };

  const bgColor = useColorModeValue('#1C5739', 'teal.900');
  const boxColor = useColorModeValue('white', 'gray.700');

  return (
    <Box bg={'#F5FFF5'}>
      <Box bg={useColorModeValue('#1C5739', 'teal.900')} px={4}>
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
                  <Link to="/" onClick={Logout}>Logout</Link>
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
      <Flex
        minH={'10vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        {/* Konten utama */}
        {storedToken2 ? (
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
                        bg={'#1C5739'}
                        color={'white'}
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
          <p>You don't have access. Please login</p>
        )}
      </Flex>
    </Box>
  );
};

export default RestaurantsNearby;

