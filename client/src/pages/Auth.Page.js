import React, { useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/Auth.Context'
import axios from 'axios'

export const AuthPage = () => {
   const auth = useContext(AuthContext)
   const message = useMessage()
   const { loading, request, error, clearError } = useHttp()
   const [form, setForm] = useState({
      email: '',
      password: '',
   })

   useEffect(() => {
      console.log(error)
      message(error)
      clearError()
   }, [error, message, clearError])

   useEffect(() => {
      window.M.updateTextFields()
   }, [])

   const changeHandler = (event) => {
      setForm({ ...form, [event.target.name]: event.target.value })
   }

   const registerHandler = async () => {
      try {
         await request('/api/auth/register', 'POST', { ...form })
      } catch (e) {}
   }
   const loginHandler = async () => {
      try {
         const data = await request('/api/auth/login', 'POST', { ...form })
         auth.login(data.token, data.userId)
      } catch (e) {}
   }
   return (
      <div className="row">
         <div className="col s6 offset-s3">
            <h1>Link</h1>
            <div className="card blue darken-1">
               <div className="card-content white-text">
                  <span className="card-title">Authorisation</span>
                  <div>
                     <div className="input-field">
                        <input
                           placeholder="Email address"
                           type="text"
                           id="email"
                           name="email"
                           className="yellow-input"
                           value={form.email}
                           onChange={changeHandler}
                        />
                        <label htmlFor="email">Email</label>
                     </div>

                     <div className="input-field">
                        <input
                           placeholder="Password"
                           type="password"
                           id="password"
                           name="password"
                           className="yellow-input"
                           value={form.password}
                           onChange={changeHandler}
                        />
                        <label htmlFor="password">Password</label>
                     </div>
                  </div>
               </div>
               <div className="card-action">
                  <button
                     className="btn yellow darken-4"
                     onClick={loginHandler}
                  >
                     Enter
                  </button>
                  <button
                     className="btn grey lighten-1 black-text"
                     onClick={registerHandler}
                     disabled={loading}
                  >
                     Registration
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}
