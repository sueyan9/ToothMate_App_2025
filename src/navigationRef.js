import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  console.log("navigate to:{},{}", name, params);
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function reset(state) {
  if (navigationRef.isReady()) {
    navigationRef.reset(state);
  }
}
