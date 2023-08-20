import React from 'react'
import ProductCard from '../product-card/product-card'
import data from "./data.json"
import "./product-list.css"
import Navbar from '../Navbar/Navbar'
// import Header from '../header/Header.js'
const ProductList = () => {
  return (
    <div className=''>
    <Navbar />
    <div className='product-list'>
        {data.map(product=> <ProductCard {...product} />)}
       
    </div>
    </div>
  )
}

export default ProductList