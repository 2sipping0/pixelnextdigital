# PixelNextDigital

A modern, responsive website for a web development agency specializing in small business websites.

## Overview

PixelNextDigital is a Next.js-based website for a web development agency that creates custom websites for small businesses. The site showcases the agency's services, portfolio, testimonials, pricing plans, and contact information.

## Features

- **Responsive Design**: Fully responsive design that looks great on all devices
- **Modern UI**: Clean, modern interface with smooth animations using Framer Motion
- **Interactive Components**: Carousel for portfolio showcase, dropdown navigation menu
- **Sections**:
  - Hero section with call-to-action
  - Services overview
  - Portfolio showcase with image slider
  - Client testimonials
  - Pricing plans
  - Contact information
- **Performance Optimized**: Uses Next.js image optimization for better page load times

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: Custom UI with [@/components/ui](https://github.com/shadcn/ui)
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/2sipping0/pixelnextdigital.git
   cd pixelnextdigital
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

```
pixelnextdigital/
├── components/         # Reusable UI components
│   └── ui/             # Base UI components
├── pages/              # Next.js pages
│   ├── index.js        # Home page
│   └── ...             # Other pages
├── public/             # Static files
│   └── images/         # Image assets
├── styles/             # Global styles
└── ...
```

## Customization

### Theme Colors

The website uses a peach-themed color palette. Colors can be customized in the Tailwind configuration:

- Primary color: peach-500 (#FF9A8B)
- Secondary colors: peach variations (100-900)
- Text colors: gray-500, white

### Content

To update the content:

1. **Projects**: Modify the `projects` array in `pages.tsx`
2. **Testimonials**: Update the testimonial content in the testimonials section
3. **Pricing**: Adjust pricing plans and features as needed
4. **Contact Information**: Update the contact details in the contact section

## Deployment

This site can be deployed to various platforms:

### Vercel (Recommended)

```
npm run build
vercel --prod
```

### Netlify

```
npm run build
netlify deploy --prod
```

## Performance Considerations

- Lazy loading is implemented for images below the fold
- Animations are optimized for performance with Framer Motion
- Next.js optimizes images for faster loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

PixelNextDigital - [info@pixelnextdigital.com](mailto:info@pixelnextdigital.com)

Project Link: [https://github.com/2sipping0/pixelnextdigital](https://github.com/2sipping0/pixelnextdigital)