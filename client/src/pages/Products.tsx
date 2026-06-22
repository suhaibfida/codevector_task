import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

interface Product {
  id: number
  name: string
  category: string
  price: number
  createdAt: string
  updatedAt: string
}

interface ProductsResponse {
  products: Product[]
  nextCursor: number | null
}

const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Sports', 'Furniture']

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlCategory = searchParams.get('category') || undefined
  const urlCursor = searchParams.get('cursor') ? Number(searchParams.get('cursor')) : null

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [category, setCategory] = useState<string | undefined>(urlCategory)

  const fetchProducts = useCallback(async (cursorOverride?: number | null, append?: boolean) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      if (cursorOverride) params.set('cursor', String(cursorOverride))

      const res = await fetch(`/api/products?${params}`)
      if (!res.ok) throw new Error('Failed to fetch products')

      const data = await res.json() as ProductsResponse

      if (append) {
        setProducts(prev => [...prev, ...data.products])
      } else {
        setProducts(data.products)
      }
      setCursor(data.nextCursor)
      setHasMore(data.nextCursor !== null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchProducts(urlCursor)
  }, [fetchProducts, urlCursor])

  const handleCategoryChange = (cat: string | undefined) => {
    const params = new URLSearchParams(searchParams)
    if (cat) {
      params.set('category', cat)
    } else {
      params.delete('category')
    }
    params.delete('cursor')
    setSearchParams(params)
    setCategory(cat)
  }

  const handleLoadMore = () => {
    fetchProducts(cursor, true)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Products</h1>
        <div className="filters">
          <button
            className={`filter-btn ${category === undefined ? 'active' : ''}`}
            onClick={() => handleCategoryChange(undefined)}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3 className="product-name">{product.name}</h3>
            <span className="product-category">{product.category}</span>
            <span className="product-price">
              ${product.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {loading && <div className="loading">Loading...</div>}

      {!loading && hasMore && (
        <button className="load-more" onClick={handleLoadMore}>
          Load More
        </button>
      )}

      {!loading && !hasMore && products.length > 0 && (
        <p className="end-message">All products loaded</p>
      )}
    </div>
  )
}

export default Products
