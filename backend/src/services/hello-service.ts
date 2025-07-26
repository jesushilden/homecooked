import { getHelloFromRepository } from '../repositories/hello-repository.js';

export const getHelloMessage = () => {
  return getHelloFromRepository();
};
