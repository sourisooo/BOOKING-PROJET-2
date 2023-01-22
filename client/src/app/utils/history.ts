import { createBrowserHistory, Location } from 'history';

type LocationState = {
  from: Location;
};

const history = createBrowserHistory<LocationState>();

export default history;


//Commentaires
// How do I create a browser history in React?
//Install react router dom. npm install --save react-router-dom.
//Import the history package from react router dom. import { useHistory } from "react-router-dom"
//Assign the history function to a variable (not necessary but. recommended) ...
//Use the push() function to redirect the user after a successful login, for example.
// Location : This ensures your assumptions about React are correct in lifecycle hooks.
//