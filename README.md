# reNamerX Website

This is the official website for reNamerX, a powerful file batch renaming application for Windows.

## Website Features

- **Modern Design**: Clean, responsive design with cyberpunk aesthetics
- **Documentation**: Comprehensive guides and documentation
- **SEO Optimized**: Meta tags, structured data, and sitemap
- **Analytics Ready**: Google Analytics integration
- **User Feedback**: Form for collecting user feedback
- **GitHub Integration**: Star button and direct links to repo

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
cd reNamerX-website
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure

```
reNamerX-website/
├── public/              # Static assets
│   ├── images/          # Image files
│   ├── robots.txt       # SEO instructions for crawlers
│   ├── sitemap.xml      # Site structure for search engines 
│   └── favicon.ico      # Website favicon
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── FeedbackForm.tsx  # User feedback component
│   │   └── ...          # Other components
│   ├── layouts/         # Page layout components
│   ├── pages/           # Next.js pages
│   │   ├── _app.tsx     # App component with analytics
│   │   ├── docs/        # Documentation pages
│   │   ├── feedback.tsx # Feedback collection page
│   │   ├── index.tsx    # Home page
│   │   └── ...          # Other pages
│   └── styles/          # CSS files
└── ...                  # Config files
```

## Building for Production

To build the website for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## Deploying to GitHub Pages

This website is designed to be easily deployed to GitHub Pages:

1. Make sure your repository is set up for GitHub Pages
2. The easiest way to deploy is to run the deployment script:

```bash
# For Windows
.\deploy-gh-pages.ps1

# For macOS/Linux
chmod +x deploy-gh-pages.sh
./deploy-gh-pages.sh
```

Alternatively, run the deploy command manually:

```bash
npm run deploy
```

This will:
- Build the site
- Export static files
- Create a .nojekyll file (required for Next.js on GitHub Pages)
- Push to the gh-pages branch

The site will be available at: https://gcavazo1.github.io/reNamerX/

## Configuration

### Google Analytics

To configure Google Analytics:

1. Create a Google Analytics account and property
2. Get your measurement ID (format: G-XXXXXXXXXX)
3. Replace the placeholder in `src/pages/_app.tsx`:

```javascript
const GA_TRACKING_ID = 'G-XXXXXXXXXX' // Replace with your actual Google Analytics tracking ID
```

### Feedback Form

The feedback form is configured to use Formspree. To set it up:

1. Create an account at [Formspree](https://formspree.io/)
2. Create a new form and get your form ID
3. Replace the placeholder in `src/components/FeedbackForm.tsx`:

```javascript
const response = await fetch('https://formspree.io/f/yourformid', {
```

## SEO Features

The website includes several SEO optimizations:

- Meta tags for search engines
- Open Graph tags for social media sharing
- Twitter card tags
- Structured data (JSON-LD)
- robots.txt file
- sitemap.xml file

## Customization

- **Colors**: Edit `tailwind.config.js` to change the color scheme
- **Content**: Update the markdown content in documentation pages
- **Images**: Replace images in the `public/images` directory

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Gabriel Cavazos (GigaCode) - [GitHub Profile](https://github.com/Gcavazo1)

## Deployment to GitHub Pages

This site is configured for simple deployment to GitHub Pages. Follow these steps to deploy:

1. **Build the site**
   ```
   npm run build
   ```
   This will create a static export in the `out` directory.

2. **Add a `.nojekyll` file to the `out` directory**
   This prevents GitHub Pages from ignoring files that start with an underscore.
   ```
   touch out/.nojekyll
   ```

3. **Configure GitHub Pages in repository settings**
   - Go to your GitHub repository → Settings → Pages
   - For "Source", select "Deploy from a branch"
   - For "Branch", select the branch containing your built site (typically "main" or "gh-pages")
   - For "Folder", select "/out" if using the main branch, or "/" (root) if using a dedicated gh-pages branch

The site will be available at `https://gcavazo1.github.io/reNamerX/`

**Note**: After initial setup, you can simply rebuild and push changes to update the site. 