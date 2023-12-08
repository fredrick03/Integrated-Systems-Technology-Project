import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Stack,
  VStack,
  HStack,
  useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  Text,
  InputGroup,
  IconButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Links = ['Home', 'Itinerary'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const AddItinerary = () => {
  const username = sessionStorage.getItem('username');
  const storedToken1 = sessionStorage.getItem('token1');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const [itineraryData, setItineraryData] = useState({
    id: 0,
    username: username,
    date: '',
    lama_kunjungan: '',
    accommodation: '',
    destination: [],
    estimasi_budget: 0,
  });

  const generateRandomId = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  };

  const isIdAvailable = async (itineraryId) => {
    try {
      const response = await axios.get(`https://ayokebalitst.azurewebsites.net/itinerary/${itineraryId}`, {
        headers: {
          Authorization: `Bearer ${storedToken1}`,
        },
      });
      
      if (response.status){
        return false
      }  // Jika 404, artinya id belum digunakan
    } catch (error) {
      return true;  // Anda dapat menangani error sesuai kebutuhan aplikasi Anda
    }
  };

  const getAvailableId = async () => {
    const maxAttempts = 10;

    for (let i = 0; i < maxAttempts; i++) {
      const randomId = generateRandomId();
      const idAvailable = await isIdAvailable(randomId);

      if (idAvailable) {
        
        return randomId;
      }
    }

    console.error(`Failed to get an available id after ${maxAttempts} attempts`);
    // Handle the failure case as needed for your application
  };

  const [destinationsList, setDestinations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [destinationNames, setDestinationNames] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('https://ayokebalitst.azurewebsites.net/destination', {
          headers: {
            Authorization: `Bearer ${storedToken1}`,
          },
        });
        setDestinations(response.data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, [storedToken1]); // Fetch destinasi hanya sekali saat komponen dimount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItineraryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddDestination = (e) => {
    const value = e.target.value; // Retrieve the selected value from the event
    const destinationId = Number(value);
    if (!isNaN(destinationId) && destinationId > 0) {
      if (!itineraryData.destination.includes(destinationId)) {
        setItineraryData((prevData) => ({
          ...prevData,
          destination: [...prevData.destination, destinationId],
        }));

        // Update destinationNames with the new destination name
        const selectedDestination = destinationsList.find((dest) => dest.destination_id === destinationId);
        if (selectedDestination) {
          setDestinationNames((prevNames) => [...prevNames, selectedDestination.name]);
        }
      } else {
        alert('Destination already exists in the itinerary.');
      }
    } else {
      alert('Invalid Destination ID.');
    }
  };

  const handleLamaKunjunganChange = (e) => {
    const value = e.target.value;
    // Make sure the value is positive integer
    if (/^[1-9]\d*$/.test(value) || value === '') {
      setItineraryData((prevData) => ({
        ...prevData,
        lama_kunjungan: Number(value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const randomID = await getAvailableId();

    const lama_kunjungan = Number(itineraryData.lama_kunjungan);
    if (!isNaN(lama_kunjungan)) {
      setItineraryData((prevData) => ({
        ...prevData,
        lama_kunjungan: lama_kunjungan,
        searchQuery: '',
      }));
    }
    try {
      const response = await axios.post(
        'https://ayokebalitst.azurewebsites.net/itinerary',
        {
          id: randomID,
          username: itineraryData.username,
          date: itineraryData.date,
          lama_kunjungan: itineraryData.lama_kunjungan,
          accommodation: itineraryData.accommodation,
          destination: itineraryData.destination,
          estimasi_budget: itineraryData.estimasi_budget,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken1}`,
            'Content-Type': 'application/json', // Set Content-Type header to application/json
          },
        }
      );
      console.log(response);
      // Handle redirect or other actions after successful submission
    } catch (error) {
      console.error('Error submitting itinerary:', error);
    }
    navigate('/itinerary');
  };


  const Logout = () => {
    sessionStorage.setItem('token1', '');
    sessionStorage.setItem('token2', '');
  };

  const bgColor = useColorModeValue('#1C5739', 'teal.900');
  const boxColor = useColorModeValue('#D4E09B', 'gray.700');
  return (
    <Box>
      <Box bg={useColorModeValue('#1C5739', 'teal.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={<HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box color={'white'}>BALI CULINEAR</Box>
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

      <Heading fontSize={'4xl'} mb={8} mt={5} color={'#1C5739'}>
        Plan Your Bali Trip
      </Heading>
      <Box mx={40}>
        <form onSubmit={handleSubmit}>
          <VStack align="start">
            <FormControl id="date" isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                type="text"
                name="date"
                value={itineraryData.date}
                onChange={handleChange}
                placeholder="DD-MM-YYYY"
              />
            </FormControl>

            <FormControl id="lama_kunjungan" isRequired>
              <FormLabel>Total Trip Days</FormLabel>
              <Input
                type="number"
                name="lama_kunjungan"
                value={itineraryData.lama_kunjungan}
                onChange={handleLamaKunjunganChange}
                placeholder="1, 2, etc."
              />
            </FormControl>

            <FormControl id="accommodation" isRequired>
              <FormLabel>Accomdation</FormLabel>
              <Select name="accommodation" value={itineraryData.accommodation} onChange={handleChange}>
                <option value="3 star">3 Star Hotel</option>
                <option value="4 star">4 Star Hotel</option>
                <option value="5 star">5 Star Hotel</option>
              </Select>
            </FormControl>

            <FormControl id="destination">
              <FormLabel>Destination</FormLabel>
              <InputGroup>
                <Select
                  name="searchQuery"
                  value={searchQuery}
                  onChange={handleAddDestination} // Pass the event to handleAddDestination
                  placeholder="Choose your destination"
                >
                  {destinationsList.map((destination) => (
                    <option key={destination.destination_id} value={destination.destination_id}>
                      ({destination.location.toUpperCase()}) - {destination.name}
                    </option>
                  ))}
                </Select>
              </InputGroup>
            </FormControl>

            {/* Display the list of destination names */}
            <VStack align="start" mt={0}>
              <Text fontSize="17" mb={0}>
                <FormLabel> Your destinations in Bali: </FormLabel>
              </Text>
              {destinationNames.map((name, index) => (
                <Text key={index} fontSize="14">
                  {' '}
                  {index + 1}. {name}
                </Text>
              ))}
            </VStack>

            <Button type="submit" bg="#1C5739" mt={4} mx="auto" textColor={'#F5FFF5'}>
              Create
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default AddItinerary;
