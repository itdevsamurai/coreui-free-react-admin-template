/**
  * Login to web api
  */
export function login(data) {
	const {
	    user,
	    pass,
	} = data;

  	fetch( config.baseURI + '/login',
    {   
        method: 'POST',
        headers: {
            'Accept'      : 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            org_id,
            worker_id,
            worker_password,
        })
    })
    .then(res => res.json());
}

