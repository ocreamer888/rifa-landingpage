# ProductCard Component Guide

A flexible and animated product card component built with React, TypeScript, and Tailwind CSS. This component is inspired by modern e-commerce designs and includes hover animations, dynamic image handling, and customizable interactions.

## Table of Contents
- [Installation & Setup](#installation--setup)
- [Basic Usage](#basic-usage)
- [Props Reference](#props-reference)
- [Usage Examples](#usage-examples)
- [Advanced Patterns](#advanced-patterns)
- [Styling Customization](#styling-customization)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Installation & Setup

The ProductCard component is already set up in your project. Make sure you have the required dependencies:

```bash
npm install next react react-dom
```

## Basic Usage

### Import the Component

```tsx
import ProductCard from "@/components/ProductCard";
// or for the showcase component
import { ProductCardShowcase } from "@/components/ProductCard";
```

### Simple Product Card

```tsx
<ProductCard 
  title="My Product" 
  price="$29.99" 
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Oxford Shoe"` | Product title displayed on the card |
| `price` | `string` | `"$99"` | Product price (supports any format) |
| `image` | `string` | `"/oxford-shoe.png"` | Path to product image (relative to public folder) |
| `imageAlt` | `string` | `"Product image"` | Alt text for accessibility |
| `showButton` | `boolean` | `false` | Whether to show the "ADD TO CARD" button |
| `isAnimated` | `boolean` | `false` | Enable hover animations (rotation, scale, button slide) |
| `onAddToCart` | `() => void` | `undefined` | Callback function when add to cart button is clicked |

## Usage Examples

### 1. Static Product Card (No Animation)

```tsx
<ProductCard 
  title="Classic T-Shirt" 
  price="$19.99" 
  image="/tshirt.jpg"
  imageAlt="Classic T-Shirt"
/>
```

### 2. Animated Product Card with Button

```tsx
<ProductCard 
  title="Premium Headphones" 
  price="$199.99" 
  image="/headphones.jpg"
  imageAlt="Premium Headphones"
  showButton={true}
  isAnimated={true}
/>
```

### 3. Product Card with Custom Add to Cart Handler

```tsx
const handleAddToCart = (productName: string) => {
  console.log(`Added ${productName} to cart`);
  // Add your cart logic here
  // e.g., update state, call API, show notification
};

<ProductCard 
  title="Wireless Mouse" 
  price="$49.99" 
  image="/mouse.jpg"
  imageAlt="Wireless Mouse"
  showButton={true}
  isAnimated={true}
  onAddToCart={() => handleAddToCart("Wireless Mouse")}
/>
```

### 4. Product Card Without Image (Shows Placeholder)

```tsx
<ProductCard 
  title="Digital Product" 
  price="$9.99" 
  showButton={true}
  isAnimated={true}
/>
```

### 5. Multiple Product Cards in a Grid

```tsx
const products = [
  { title: "Laptop", price: "$999", image: "/laptop.jpg", alt: "Gaming Laptop" },
  { title: "Phone", price: "$699", image: "/phone.jpg", alt: "Smartphone" },
  { title: "Tablet", price: "$399", image: "/tablet.jpg", alt: "Tablet" },
];

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
  {products.map((product, index) => (
    <ProductCard
      key={index}
      title={product.title}
      price={product.price}
      image={product.image}
      imageAlt={product.alt}
      showButton={true}
      isAnimated={true}
      onAddToCart={() => console.log(`Added ${product.title} to cart`)}
    />
  ))}
</div>
```

### 6. Using the Showcase Component

```tsx
// Shows both static and animated versions side by side
<ProductCardShowcase />
```

## Advanced Patterns

### 1. Dynamic Product Loading with State

```tsx
import { useState, useEffect } from 'react';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    };
    
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.name}
          price={product.price}
          image={product.imageUrl}
          imageAlt={product.description}
          showButton={true}
          isAnimated={true}
          onAddToCart={() => addToCart(product.id)}
        />
      ))}
    </div>
  );
};
```

### 2. Product Card with Quantity and Variants

```tsx
const ProductCardWithVariants = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  
  return (
    <div className="space-y-4">
      <ProductCard
        title={product.name}
        price={selectedVariant.price}
        image={selectedVariant.image}
        imageAlt={product.description}
        showButton={true}
        isAnimated={true}
        onAddToCart={() => addToCart(product.id, selectedVariant.id)}
      />
      
      {/* Variant selector */}
      <div className="flex gap-2">
        {product.variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => setSelectedVariant(variant)}
            className={`px-3 py-1 rounded ${
              selectedVariant.id === variant.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200'
            }`}
          >
            {variant.name}
          </button>
        ))}
      </div>
    </div>
  );
};
```

### 3. Product Card with Wishlist Functionality

```tsx
const ProductCardWithWishlist = ({ product, isWishlisted, onToggleWishlist }) => {
  return (
    <div className="relative">
      <ProductCard
        title={product.title}
        price={product.price}
        image={product.image}
        imageAlt={product.alt}
        showButton={true}
        isAnimated={true}
        onAddToCart={() => addToCart(product.id)}
      />
      
      {/* Wishlist button */}
      <button
        onClick={() => onToggleWishlist(product.id)}
        className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
      >
        {isWishlisted ? '❤️' : '🤍'}
      </button>
    </div>
  );
};
```

## Styling Customization

### 1. Custom Card Dimensions

```tsx
// Override with custom classes
<div className="w-80 h-96"> {/* Custom size */}
  <ProductCard
    title="Custom Size Product"
    price="$99"
    showButton={true}
    isAnimated={true}
  />
</div>
```

### 2. Custom Button Styling

You can extend the component to accept custom button props:

```tsx
// In ProductCard.tsx, add these props to the interface:
interface ProductCardProps {
  // ... existing props
  buttonText?: string;
  buttonClassName?: string;
}

// Then use in the button:
<button 
  className={`w-full py-3 px-4 font-medium rounded-md transition-all duration-200 ${
    buttonClassName || 'bg-gray-800 text-white'
  } ${
    isAnimated && isHovered 
      ? 'transform translate-y-0 opacity-100' 
      : 'transform translate-y-2 opacity-0'
  }`}
  onClick={handleAddToCart}
>
  {buttonText || 'ADD TO CARD'}
</button>
```

### 3. Custom Animation Timing

```tsx
// Add custom animation duration
<div 
  className={`relative transition-all duration-500 ease-out ${
    isAnimated && isHovered 
      ? 'transform rotate-12 scale-110' 
      : 'transform rotate-0 scale-100'
  }`}
>
```

## Best Practices

### 1. Image Optimization
- Always provide high-quality images (recommended: 400x300px minimum)
- Use WebP format when possible for better performance
- Provide meaningful alt text for accessibility
- Test with different image aspect ratios

### 2. Performance
- Use `React.memo` for static product cards if rendering many items
- Implement virtual scrolling for large product lists
- Lazy load images below the fold

```tsx
const MemoizedProductCard = React.memo(ProductCard);
```

### 3. Accessibility
- Always provide meaningful alt text
- Ensure sufficient color contrast
- Make buttons keyboard accessible
- Use semantic HTML structure

### 4. Error Handling
- The component includes built-in image error handling
- Always provide fallback content
- Test with broken image URLs

### 5. Mobile Responsiveness
- Test on different screen sizes
- Consider touch interactions for mobile
- Adjust animation intensity for mobile devices

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check image paths are relative to the `public` folder
   - Verify image files exist
   - Check console for 404 errors

2. **Animations not working**
   - Ensure `isAnimated={true}` is set
   - Check for CSS conflicts
   - Verify hover events are firing

3. **Button not showing**
   - Set `showButton={true}`
   - Check if button is hidden by CSS
   - Verify button container height

4. **Layout issues**
   - Check parent container constraints
   - Verify Tailwind CSS is properly configured
   - Test with different content lengths

### Debug Mode

Add this to see component state:

```tsx
const ProductCardDebug = (props) => {
  console.log('ProductCard props:', props);
  return <ProductCard {...props} />;
};
```

## Examples in Your Project

Based on your current setup, here are some practical examples:

```tsx
// In your page.tsx
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <HeroSection />
      
      {/* Product showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCard 
              title="Rifa Coffee" 
              price="$15" 
              image="/coffee bean 1.png"
              imageAlt="Premium Coffee Beans"
              showButton={true} 
              isAnimated={true}
              onAddToCart={() => console.log('Added coffee to cart')}
            />
            <ProductCard 
              title="Orchid Collection" 
              price="$25" 
              image="/orchid1.png"
              imageAlt="Beautiful Orchid"
              showButton={true} 
              isAnimated={true}
              onAddToCart={() => console.log('Added orchid to cart')}
            />
            <ProductCard 
              title="Dental Package" 
              price="$500" 
              image="/HeroRifa1.png"
              imageAlt="Dental Treatment Package"
              showButton={true} 
              isAnimated={true}
              onAddToCart={() => console.log('Added dental package to cart')}
            />
          </div>
        </div>
      </section>
      
      {/* Other sections */}
      <TripSection />
      <DentalSection />
      <RifaNumbers />
    </div>
  );
}
```

This guide covers all possible usage patterns and best practices for the ProductCard component. The component is flexible, accessible, and ready for production use!
