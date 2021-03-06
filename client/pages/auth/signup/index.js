import {useState} from 'react';
import Router from 'next/router';

import useRequest from "../../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  }

  return (
    <div className="col-md-3 mx-auto card mt-4 p-4">
      <h1>Sign up</h1>
      <hr />
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="text" 
            className="form-control"
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            className="form-control"
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        { errors }

        <div className="form-group">
          <button className="btn btn-success">Sign up</button>
        </div>
      </form>
    </div>
  );
};
