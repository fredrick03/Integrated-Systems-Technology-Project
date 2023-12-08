import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import Login from './Login';
import Register from './Register';
import DestinationDetail from './DestinationDetail';
import Itinerary from './Itinerary';
import AddItinerary from './AddItinerary';
import Home from './Home';
import RestaurantsNearby from './RestaurantsNearby';
import RestaurantsNearbyMenu from './RestaurantsNearbyMenu';


const PrivateRoute = ({ element }) => {
  const token1 = sessionStorage.getItem('token1');
  const token2 = sessionStorage.getItem('token2');

  // Redirect to  if tokens are not present
  if (token1 === '' && token2 === '') {
    return <Navigate to="/Login" />;
  }

  // Render the protected component if tokens are present
  return element;
};

const App = () => {
  return (
    <ChakraProvider>
      <CSSReset />
      <Box textAlign="center" fontSize="xl" bg="D6E8E0" minHeight="100vh">
        <Router>
          <Fragment>
            <Routes>
            <Route
              path="/home"
              element={<PrivateRoute element={<Home />} />}
            />
            <Route
              path="/destination/:id"
              element={<PrivateRoute element={<DestinationDetail />} />}
            />
            <Route
              path="/itinerary"
              element={<PrivateRoute element={<Itinerary />} />}
            />
            <Route
              path="/add-itinerary"
              element={<PrivateRoute element={<AddItinerary />} />}
            />
            <Route
              path="/restaurants-nearby"
              element={<PrivateRoute element={<RestaurantsNearby />} />}
            />
            <Route
              path="/restaurant/nearby/:restaurantName/menu"
              element={<PrivateRoute element={<RestaurantsNearbyMenu />} />}
            />

            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            </Routes>
          </Fragment>
        </Router>
      </Box>
    </ChakraProvider>
    
    
  );
}
export default App;