import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Badge,
  Flex,
  IconButton,
  VStack,
  HStack,
  useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  Button,
  Stack
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import DestinationModal from './DestinationModal'; // Import the new component  
import { Wrap, WrapItem } from '@chakra-ui/react';



const Links = [ 'Home','Itinerary'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const Itinerary = () => {
  const [itineraries, setItineraries] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const username = sessionStorage.getItem('username');
  const storedToken1 = sessionStorage.getItem('token1');

  const handleStartItinerary = (itinerary) => {
    setSelectedItinerary(itinerary);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const fetchData = useCallback(async () => {
    if (username) {
      try {
        // Fetch data itinerary berdasarkan username dari API
        const response = await axios.get(`https://ayokebalitst.azurewebsites.net/itinerary/user/${username}`, {
          headers: {
            Authorization: `Bearer ${storedToken1}` // Menyertakan token dalam header Authorization
          }
        });

        // Ambil data detail destinasi untuk setiap destination_id dalam itinerary
        const itinerariesWithDestinations = await Promise.all(
          response.data.map(async (itinerary) => {
            const destinationDetails = await Promise.all(
              itinerary.destination.map(async (destinationId) => {
                const destinationResponse = await axios.get(`https://ayokebalitst.azurewebsites.net/destination/${destinationId}`, {
                  headers: {
                    Authorization: `Bearer ${storedToken1}` // Menyertakan token dalam header Authorization
                  }
                });
                return destinationResponse.data;
              })
            );

            return {
              ...itinerary,
              destination: destinationDetails,
            };
          })
        );

        setItineraries(itinerariesWithDestinations);
      } catch (error) {
        console.error('Error fetching itinerary data:', error);
      }
    }
  }, [username, storedToken1]);

  useEffect(() => {
    fetchData(); // Now you can use fetchData in useEffect without any warning
  }, [fetchData]);

  const handleDeleteItinerary = async (itineraryId) => {
    try {
      // Panggil API untuk melakukan penghapusan
      await axios.delete(`https://ayokebalitst.azurewebsites.net/itinerary/${itineraryId}`,{
        headers: {
          Authorization: `Bearer ${storedToken1}` // Menyertakan token dalam header Authorization
        }
      });
  
      fetchData()
      alert(`Itinerary berhasil dihapus`);
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
  };

  const Logout = () => {
    sessionStorage.setItem('token1', '');
    sessionStorage.setItem('token2', '');
  };

  const bgColor = useColorModeValue('#1C5739', 'teal.900');

  return (
    <Box>
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
                  <Link to="/" onClick={Logout}>Logout</Link>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as={'nav'} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link} to={`/${link.toLowerCase()}`}>{link}</NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>
      <Heading fontSize={'4xl'} mb={4} mt={4} color={'#1C5739'}>Your Bali Itinerary</Heading>
      <Button bg={'#1C5739'} as={Link} to={`/add-itinerary`} mb={4} color={'#F5FFF5'}>
        Create Itinerary
      </Button>

      {itineraries.map(itinerary => (
        <Box key={itinerary.id} borderWidth="2px" borderColor={'#1C5739'} borderRadius="lg" p={6} mx={10} mb={5}>
          <VStack align="start">
            <Text>Date: {itinerary.date}</Text>
            <Text>Trip Duration: {itinerary.lama_kunjungan} days</Text>
            <Text>Accommodation: {itinerary.accommodation} hotel</Text>

            <Wrap spacing={2} mb={2}>
              <Text>Destinations:</Text>
              {itinerary.destination.map((destination) => (
                <WrapItem key={destination.destination_id}>
                  <Badge colorScheme=''>
                    {destination.name} ({destination.location})
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>


            <Text>Estimated Budget: Rp {itinerary.estimasi_budget.toLocaleString()}</Text>

            {/* Tombol Delete */}
            <Flex alignItems={'center'} justifyContent={'space-between'}>
            <Button
              bg={'#1C5739'}
              color={'white'}
              onClick={() => handleStartItinerary(itinerary)}
              _hover={{
                bg: '#D4E09B'
                }}
              mr={4}
              mt={4}
              mb={2}
            >
              Start Itinerary
            </Button>
              <Button colorScheme="red" mt={4} mb={2} onClick={() => handleDeleteItinerary(itinerary.id)}>
                Delete
              </Button>
            </Flex>
            
          </VStack>
        </Box>
      ))}
    {/* Use DestinationModal component */}
    <DestinationModal isOpen={isModalOpen} onClose={handleCloseModal} itinerary={selectedItinerary} />
    </Box>
  );
};

export default Itinerary;
