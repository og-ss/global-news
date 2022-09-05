import React, { useEffect } from 'react'
import './App.css'
import Child from './Child'
import axios from 'axios'
import IndexRouter from './router/IndexRouter'

export default function App() {
  // useEffect(()=>{
  //   axios.get("/api/mmdb/movie/v3/list/hot.json?ct=%E5%8D%97%E6%98%8C&ci=83&channelId=4").then(res=>{console.log("=====>",res.data)})

  // },[])

  return (
      <IndexRouter>
      </IndexRouter>
  )
}

