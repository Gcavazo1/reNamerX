/**
 * Theme utilities and constants
 */

const theme = {
  styles: {
    linkClasses: {
      // Link styles for navigation
      nav: "text-text-secondary hover:text-text-primary transition-colors",
      
      // Link styles for documentation navigation
      docNav: "block py-1 text-text-secondary hover:text-primary border-l-2 border-transparent hover:border-primary pl-3 transition-colors",
      
      // Link styles for active documentation navigation
      docNavActive: "block py-1 text-primary border-l-2 border-primary pl-3 font-medium",
      
      // Link styles for buttons
      button: "bg-primary hover:bg-primary-dark text-text-inverse font-medium py-2 px-4 rounded-lg transition-colors",
      
      // Link styles for secondary buttons
      buttonSecondary: "bg-background-alt hover:bg-background-alt-dark text-text-primary font-medium py-2 px-4 rounded-lg border border-border transition-colors",
    },
    containerClasses: {
      // Default container styles
      default: "container mx-auto px-4",
      
      // Narrow container styles
      narrow: "container mx-auto px-4 max-w-3xl",
      
      // Wide container styles
      wide: "container mx-auto px-4 max-w-6xl",
    },
    cardClasses: {
      // Default card styles
      default: "bg-background p-6 rounded-lg border border-border shadow-sm",
      
      // Interactive card styles (with hover effects)
      interactive: "bg-background p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow",
      
      // Feature card styles
      feature: "bg-background p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow",
    },
    headingClasses: {
      // Main page title
      h1: "text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-text-primary",
      
      // Section title
      h2: "text-3xl md:text-4xl font-bold mb-4 text-text-primary",
      
      // Sub-section title
      h3: "text-2xl font-bold mb-3 text-text-primary",
      
      // Component title
      h4: "text-xl font-bold mb-2 text-text-primary",
    },
  },
};

export default theme; 