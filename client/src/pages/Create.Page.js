import React, { useState } from 'react'
import { useHttp } from '../hooks/http.hook'

export const CreatePage = () => {
   const [link, setLink] = useState()
   const { request } = useHttp()

   const pressHandler = async (event) => {
      if (event.key === 'Enter') {
         try {
            const data = await request('/api/link/generate', 'POST', {
               from: link,
            })
            console.log(data)
         } catch (e) {}
      }
   }

   return (
      <div className="row">
         <div className="col s8 offset s2">
            <div className="input-field">
               <input
                  placeholder="Add link"
                  type="text"
                  id="link"
                  value={link}
                  onKeyPress={pressHandler}
                  onChange={(e) => setLink(e.target.value)}
               />
               <label htmlFor="email">Add link</label>
            </div>
         </div>
      </div>
   )
}
