import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const GuestRouter = ({ children }) => {
  const { mainState, value } = useContext(AuthContext);
  const {  userPath } = value;

  if (mainState.access_token) {
    if(userPath){
        return <Navigate to={`${userPath}`} replace />;
    }else{
        // Sudah login, redirect ke dashboard
        return <Navigate to="/home" replace />;
    }
  }

  return children;
};
export default GuestRouter