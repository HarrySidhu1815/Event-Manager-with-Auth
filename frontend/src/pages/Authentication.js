import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const server = process.env.REACT_APP_SERVER

function AuthenticationPage() {
  return <AuthForm />;
}

export async function action({request}){
  const data = await request.formData()
  const searchParam = new URL(request.url).searchParams

  const authData = {
    email: data.get('email'),
    password: data.get('password')
  } 
  
  const mode = searchParam.get('mode') || 'login'

  if(mode !== 'login' && mode !== 'signup'){
    throw json({message: 'Unsupported mode!'}, {status: 422})
  }
  
  const response = await fetch(`${server}/` + mode, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(authData)
  })

  if(response.status === 422 || response.status === 401){
    return response
  }

  if(!response.ok){
    return json({message: 'Could not fetch the user!'}, {status: 500})
  } 
    const resData = await response.json()
    const token = resData.token

    localStorage.setItem('token', token)
    const expiration = new Date()
    expiration.setHours(expiration.getHours() + 1)
    localStorage.setItem('expiration', expiration.toISOString)
    return redirect('/')
  
}

export default AuthenticationPage;