import { config } from '../constants';


/**
  * Login to web api
  */
export function login(data) {
	const {
	    user,
	    pass,
	} = data;

  	fetch( config.baseURI + '/auth/local',
    {   
        method: 'POST',
        headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        	identifier: user,
        	password: pass,
        })
    })
    .then(res => res.json());
}

