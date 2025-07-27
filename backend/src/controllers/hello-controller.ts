import { getHelloMessage } from '../services/hello-service.js';

export const getHello = async () => {
  return getHelloMessage();
};
