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
import { useParams } from 'react-router-dom';


const Links = ['Home', 'Itinerary', 'Loan'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const RestaurantsNearbyMenu = () => {
  const [token2, setToken2] = useState('');
  const [username, setUsername] = useState('');
  const [restaurantMenu, setRestaurantMenu] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRestaurant, setSelectedRestaurant] = useState({})
  
  useEffect(() => {
    const storedToken2 = sessionStorage.getItem('token2');
    setToken2(storedToken2 || '');
    console.log(token2);
  
    const storedUsername = sessionStorage.getItem('username');
    setUsername(storedUsername || '');
    console.log(username);
  
    const storedSelectedRestaurant = sessionStorage.getItem('selectedRestaurant');
    const parsedSelectedRestaurant = JSON.parse(storedSelectedRestaurant) || {};
    setSelectedRestaurant(parsedSelectedRestaurant);
  
    if (parsedSelectedRestaurant.restaurant_name) {
      axios.get(`http://ucanteen2.g3cwh8fvd9frdmeg.southeastasia.azurecontainer.io/users/restaurant/nearby/${parsedSelectedRestaurant.restaurant_name}/menu`, {
        headers: {
          Authorization: `Bearer ${token2}`,
        },
      })
        .then((response) => {
          setRestaurantMenu(response.data);
        })
        .catch((error) => {
          console.error('Error fetching menu:', error);
        });
    }
  }, [token2, selectedRestaurant]); // Dependency array for useEffect
  

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
        {token2 ? (
          <Box margin="auto">
            <Heading fontSize={'4xl'} mb={2} mt={5}>
              Food Menu in,
            </Heading>
            <Heading fontSize={'4xl'} mb={8} mt={2}>{selectedRestaurant.restaurant_name}</Heading>

            {/* Display menu cards */}
            {restaurantMenu ? (
              <p>Loading menu...</p>
            ) : (
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
            )}
          </Box>
        ) : (
          <p>Anda tidak memiliki akses. Silakan login terlebih dahulu.</p>
        )}
      </Flex>
    </Box>
  );
};

export default RestaurantsNearbyMenu;