import { useEffect, useContext } from 'react';
import { Context as AuthContext } from '../../context/AuthContext/AuthContext';

const ResolveAuthScreen = () => {
  const { tryLocalSignin } = useContext(AuthContext);

  useEffect(() => {
    tryLocalSignin(); // attempt automatic signin
  }, []);

  return null;
};

export default ResolveAuthScreen;
