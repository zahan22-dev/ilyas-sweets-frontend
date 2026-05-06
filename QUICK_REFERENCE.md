# 🚀 TANSTACK QUERY - QUICK REFERENCE

## 📦 IMPORT HOOKS

```typescript
// Products
import { useProducts, useProduct, useCreateProduct, useDeleteProduct } from "@/hooks/useProducts";

// Categories
import { useCategories, useCategory, useCreateCategory, useDeleteCategory } from "@/hooks/useCategories";

// Cart
import { useCart, useAddToCart, useRemoveCartItem } from "@/hooks/useCart";

// Orders
import { useOrders, useCreateOrder, useUpdateOrderStatus } from "@/hooks/useOrders";

// Upload
import { useUploadImage } from "@/hooks/useUpload";
```

---

## 🔍 FETCH DATA (Queries)

### **Get All Products**
```typescript
const { data: products, isLoading, isError, error } = useProducts();

// With category filter
const { data: products } = useProducts("samosas");
```

### **Get Single Product**
```typescript
const { data: product, isLoading } = useProduct("chicken-samosa");
```

### **Get Categories**
```typescript
const { data: categories } = useCategories();
```

### **Get Cart**
```typescript
const { data: cart } = useCart(cartId);
```

### **Get Orders**
```typescript
const { data: orders } = useOrders();

// With status filter
const { data: orders } = useAdminOrders("PENDING");
```

---

## ✏️ MUTATE DATA (Mutations)

### **Create Product**
```typescript
const createProduct = useCreateProduct();

await createProduct.mutateAsync({
  name: "New Product",
  categoryId: 1,
  images: ["url"],
  variants: [
    { weight: "1kg", price: 1000, stock: 50 }
  ]
});
```

### **Delete Product**
```typescript
const deleteProduct = useDeleteProduct();

await deleteProduct.mutateAsync(productId);
```

### **Create Category**
```typescript
const createCategory = useCreateCategory();

await createCategory.mutateAsync({
  name: "New Category",
  image: "url"
});
```

### **Add to Cart**
```typescript
const addToCart = useAddToCart();

await addToCart.mutateAsync({
  cartId: 1,
  data: {
    productId: 1,
    variantId: 1,
    quantity: 2
  }
});
```

### **Create Order**
```typescript
const createOrder = useCreateOrder();

await createOrder.mutateAsync({
  customerName: "John Doe",
  phone: "03001234567",
  address: "123 Main St",
  items: [
    { productId: 1, variantId: 1, quantity: 2 }
  ]
});
```

### **Upload Image**
```typescript
const uploadImage = useUploadImage();

const result = await uploadImage.mutateAsync(file);
const imageUrl = result.url;
```

---

## 🎨 UI PATTERNS

### **Loading State**
```typescript
const { data, isLoading } = useProducts();

if (isLoading) {
  return <div>Loading...</div>;
}
```

### **Error State**
```typescript
const { data, isError, error } = useProducts();

if (isError) {
  return <div>Error: {error?.message}</div>;
}
```

### **Mutation Loading**
```typescript
const createProduct = useCreateProduct();

<button disabled={createProduct.isPending}>
  {createProduct.isPending ? "Creating..." : "Create"}
</button>
```

### **Safe Data Access**
```typescript
const { data: products } = useProducts();

// Use optional chaining
{products?.map(product => ...)}
```

---

## 🔄 COMMON PATTERNS

### **Fetch on Mount**
```typescript
// Automatic! Just use the hook
const { data } = useProducts();
```

### **Refetch on Action**
```typescript
// Automatic! Cache invalidated after mutations
const createProduct = useCreateProduct();
await createProduct.mutateAsync(data);
// Products list automatically refetches
```

### **Conditional Fetch**
```typescript
const { data } = useProduct(slug, {
  enabled: !!slug  // Only fetch if slug exists
});
```

---

## 🎯 COMPLETE EXAMPLE

```typescript
"use client";

import { useProducts, useDeleteProduct } from "@/hooks/useProducts";

export default function ProductsPage() {
  const { data: products, isLoading, isError, error } = useProducts();
  const deleteProduct = useDeleteProduct();

  async function handleDelete(id: number) {
    if (!confirm("Delete?")) return;
    
    try {
      await deleteProduct.mutateAsync(id);
    } catch (error) {
      alert("Failed to delete");
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <button 
            onClick={() => handleDelete(product.id)}
            disabled={deleteProduct.isPending}
          >
            {deleteProduct.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🛠️ DEVTOOLS

### **Open DevTools**:
- Look for floating icon (bottom-left)
- Click to open
- Explore queries and cache

### **Useful Features**:
- View all queries
- See cache data
- Track mutations
- Inspect query keys
- Debug refetching

---

## ⚡ TIPS

1. **Always use optional chaining** for data: `products?.map()`
2. **Check isPending** for mutations, not isLoading
3. **Use try/catch** for mutation error handling
4. **Let TanStack Query handle** loading/error states
5. **Don't manually refetch** - cache invalidation does it

---

## 🚫 DON'T DO THIS

```typescript
// ❌ Manual state management
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

// ❌ Manual fetching
useEffect(() => {
  fetch('/api/products').then(...)
}, []);

// ❌ Manual refetching
await createProduct();
fetchProducts(); // Don't do this!
```

---

## ✅ DO THIS

```typescript
// ✅ Use hooks
const { data, isLoading } = useProducts();

// ✅ Let cache handle refetching
const createProduct = useCreateProduct();
await createProduct.mutateAsync(data);
// Auto refetches!
```

---

**Happy Coding!** 🚀
