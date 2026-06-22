import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">
      <h1>Welcome</h1>
      <p className="home-text">Go to /products to view the products</p>
      <Link to="/products" className="home-btn">Show Products</Link>
    </div>
  )
}

export default Home
