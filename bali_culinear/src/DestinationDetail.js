import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Flex,
  Stack,
  IconButton,
  useColorModeValue,
  useDisclosure,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Button
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Spinner } from '@chakra-ui/react';

const Links = ['Home', 'Itinerary', 'Loan'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const storedToken1 = sessionStorage.getItem('token1');
  const username = sessionStorage.getItem('username');

  useEffect(() => {
    if (storedToken1 && id) {
      axios
        .get(`https://ayokebalitst.azurewebsites.net/destination/${id}`, {
          headers: {
            Authorization: `Bearer ${storedToken1}`,
          },
        })
        .then((response) => {
          setDestination(response.data);
        })
        .catch((error) => {
          console.error('Error fetching destination details:', error);
        });
    }
  }, [id, storedToken1]);

  const Logout = () => {
    sessionStorage.setItem('token1', '');
    sessionStorage.setItem('token2', '');
  };

  const bgColor = useColorModeValue('#1C5739', 'gray.700');
  const boxShadow = useColorModeValue('lg', 'dark-lg');


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
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          {destination ? (
            <Box rounded={'lg'} bg={"#D4E09B"} boxShadow={boxShadow} p={8}>
              <Heading as="h2" mb={4} color={'#1C5739'}>
                {destination.name}
              </Heading>

              <Box textAlign={'left '}>
                <Text>Category: {destination.category}</Text>
                <Text>Lokasi: {destination.location}</Text>
                <Text>Latitude: {destination.latitude}</Text>
                <Text>Longitude: {destination.longitude}</Text>
                <Text>Estimasi Biaya: {destination.perkiraan_biaya}</Text>
              </Box>
            </Box>
          ) : (
            <Spinner size="xl" />
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default DestinationDetail;
