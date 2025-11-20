/**
 * Smooth scroll utility for anchor links
 * Add this to any anchor link to enable smooth scrolling
 */

export const smoothScroll = (targetId: string) => {
  const element = document.getElementById(targetId.replace("#", ""));
  if (element) {
    const yOffset = -80; // Offset for sticky navbar
    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

/**
 * Hook for smooth scrolling behavior
 * Usage: <a onClick={(e) => handleAnchorClick(e, '#features')}>
 */
export const handleAnchorClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  if (href.startsWith("#")) {
    e.preventDefault();
    smoothScroll(href);
  }
};
