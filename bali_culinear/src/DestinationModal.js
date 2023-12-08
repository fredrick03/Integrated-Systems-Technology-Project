// DestinationModal.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import axios from 'axios';


// ... (other imports)

const DestinationModal = ({ isOpen, onClose, itinerary }) => {
  const navigate = useNavigate();

  const handleClick = async (destination) => {
    try {
      const userData = {
        university_name: destination.name,
      };

      // Send a request to update user data
      await axios.put(
        `https://ucanteen.azurewebsites.net/users/location?location=${userData.university_name}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token2')}`,
            'Content-Type': 'application/json', // Add Content-Type header
          },
        }
      );

      sessionStorage.setItem('location', userData.university_name);
      navigate('/restaurants-nearby');
      alert('User data updated successfully.');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="90%" maxH="90%" overflow="auto">
        <ModalHeader color={'#1C5739'} fontSize={30}>Choose Your Destination</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {itinerary && itinerary.destination ? (
            itinerary.destination.map((destination) => (
              <Button
                key={destination.destination_id}
                onClick={() => handleClick(destination)}
                variant="outline"
                bg={'#D4E09B'}
                m={4}
              >
                {destination.name} ({destination.location})
              </Button>
            ))
          ) : (
            <p>No destinations found for this itinerary.</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button bg={'#1C5739'} color={'#F5FFF5'} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DestinationModal;
