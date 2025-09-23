# Image Grid Component

A responsive, reusable 3x3 thumbnail grid component with click-to-maximize functionality. Compatible with modern browsers and mobile-friendly.

## Features

- **3x3 Grid Layout**: Displays up to 9 images in a perfect square grid
- **Click to Maximize**: Click any thumbnail to expand it to full size
- **Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Touch Friendly**: Optimized for touch interactions
- **Keyboard Support**: ESC key to close maximized image
- **Loading States**: Shows loading animation while images load
- **Error Handling**: Gracefully handles failed image loads
- **Custom Events**: Fires events when images are maximized/minimized
- **Cross-browser Compatible**: Works in all modern browsers
- **Before/After Visual Distinction**: Red/green diagonal banners to distinguish image types

## Usage

### Basic Setup

1. Include the JavaScript file:
```html
<script src="image-grid-component.js"></script>
```

2. Create a container element:
```html
<div id="my-gallery"></div>
```

3. Initialize the component:
```javascript
const images = [
    'path/to/image1.jpg',
    'path/to/image2.jpg',
    'path/to/image3.jpg',
    // ... up to 9 images
];

const gallery = new ImageGridComponent('#my-gallery', images);
```

### Advanced Usage

#### Using Image Objects
```javascript
const images = [
    {
        src: 'path/to/image1.jpg',
        alt: 'Description of image 1',
        title: 'Image 1 Title',
        type: 'before'  // Optional: adds red "before" banner
    },
    {
        src: 'path/to/image2.jpg',
        alt: 'Description of image 2',
        title: 'Image 2 Title',
        type: 'after'   // Optional: adds green "after" banner
    }
    // ... more images
];

const gallery = new ImageGridComponent('#my-gallery', images);
```

#### Before/After Visual Distinction
Add `type: 'before'` or `type: 'after'` to image objects to display diagonal banners:
- **Before**: Red banner (50% opacity) in bottom-left corner
- **After**: Green banner (50% opacity) in bottom-left corner

```javascript
const beforeAfterImages = [
    { src: 'dirty-shoe.jpg', type: 'before', alt: 'Dirty shoe' },
    { src: 'clean-shoe.jpg', type: 'after', alt: 'Clean shoe' }
];
```

#### Custom Options
```javascript
const gallery = new ImageGridComponent('#my-gallery', images, {
    aspectRatio: '1/1',           // Grid aspect ratio
    gap: '12px',                  // Space between thumbnails
    borderRadius: '16px',         // Border radius for images
    transition: '0.3s ease',      // CSS transition duration
    maxWidth: '600px'            // Maximum width of the grid
});
```

## API Methods

### Constructor
```javascript
new ImageGridComponent(container, images, options)
```

- **container**: String selector or DOM element
- **images**: Array of image URLs or image objects
- **options**: Configuration object (optional)

### Methods

#### `updateImages(newImages)`
Replace all images with new ones:
```javascript
gallery.updateImages(newImageArray);
```

#### `getCurrentMaximized()`
Get the index of currently maximized image (or null):
```javascript
const currentIndex = gallery.getCurrentMaximized();
```

#### `destroy()`
Clean up and remove the component:
```javascript
gallery.destroy();
```

## Events

The component fires custom events on the container element:

### `imageMaximized`
Fired when an image is maximized:
```javascript
container.addEventListener('imageMaximized', (event) => {
    console.log('Image maximized:', event.detail.index);
    console.log('Image data:', event.detail.imageData);
});
```

### `imageMinimized`
Fired when an image is minimized:
```javascript
container.addEventListener('imageMinimized', (event) => {
    console.log('Image minimized:', event.detail.index);
});
```

## CSS Classes

The component adds these CSS classes that you can style:

- `.image-grid-component` - Main container
- `.image-grid-container` - Grid container
- `.image-grid-item` - Individual thumbnail
- `.image-grid-item.maximized` - Maximized image
- `.image-grid-item.loading` - Loading state
- `.image-grid-overlay` - Dark overlay when maximized
- `.image-grid-close-btn` - Close button

## Browser Support

- Chrome 58+
- Firefox 52+
- Safari 10.1+
- Edge 79+
- iOS Safari 10.3+
- Android Chrome 62+

## Examples

See `image-grid-demo.html` for complete working examples including:
- Basic grid
- Customized styling
- Dynamic image updates
- Event handling

## Notes

- Images are automatically cropped to fit square thumbnails using `object-fit: cover`
- HEIC images may not display in all browsers (use JPEG/PNG for best compatibility)
- The component handles up to 9 images optimally
- Loading states help with slower network connections
- Keyboard navigation (ESC key) for accessibility