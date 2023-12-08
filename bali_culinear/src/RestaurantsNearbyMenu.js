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

const RestaurantsNearbyMenu = () => {
  const storedToken2 = sessionStorage.getItem('token2');
  const username = sessionStorage.getItem('username');
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRestaurant, setSelectedRestaurant] = useState({})

  useEffect(() => {
    const storedSelectedRestaurant = sessionStorage.getItem('selectedRestaurant');
    const parsedSelectedRestaurant = JSON.parse(storedSelectedRestaurant) || {};
    setSelectedRestaurant(parsedSelectedRestaurant);
  
    if (parsedSelectedRestaurant.restaurant_name) {
      console.log('Token:', storedToken2);
      console.log('Selected Restaurant:', parsedSelectedRestaurant);

      axios.get(`http://ucanteen2.g3cwh8fvd9frdmeg.southeastasia.azurecontainer.io/users/restaurant/nearby/${parsedSelectedRestaurant.restaurant_name}/menu`, {
        headers: {
          Authorization: `Bearer ${storedToken2}`,
        },
      })
        .then((response) => {
          setRestaurantMenu(response.data);
        console.log(restaurantMenu);
        })
        .catch((error) => {
          console.error('Error fetching menu:', error);
        });
    }
  }, [storedToken2, restaurantMenu]);
  

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
                  <Link to="/login" onClick={Logout}>Logout</Link>
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
        {storedToken2 ? (
          <Box margin="auto">
            <Heading fontSize={'4xl'} mb={2} mt={5}>
              {selectedRestaurant.restaurant_name} Menu
            </Heading>

            {/* Display menu cards */}
            {restaurantMenu ? (
              <SimpleGrid spacing={10} mt={5} columns={[1, null, 3]}>
                {restaurantMenu.map((menuItem) => (
                  <Card key={menuItem.menu_id} bg={boxColor}>
                    <CardHeader>
                      <strong>{menuItem.dish_name}</strong>
                    </CardHeader>
                    <CardBody>
                      <Text>Price: Rp {menuItem.price_rupiah.toLocaleString()}</Text>
                    </CardBody>
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

export default RestaurantsNearbyMenu;