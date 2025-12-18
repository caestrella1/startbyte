import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Popover.css';

export default function Popover({ isOpen, onClose, anchorElement, children, onOpenChange }) {
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'bottom', maxWidth: 500, maxHeight: null, allowAutoHeight: false });
  const popoverRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const isClosed = !isOpen && !isClosing;

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      // Only call onOpenChange when opening (not closing, as that's handled in onClose)
      if (onOpenChange) {
        onOpenChange(true);
      }
      
      // Scroll the anchor element into view if it's not fully visible
      if (anchorElement) {
        const anchorRect = anchorElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        
        // Check if anchor is fully visible
        const isFullyVisible = 
          anchorRect.top >= 0 &&
          anchorRect.bottom <= viewportHeight &&
          anchorRect.left >= 0 &&
          anchorRect.right <= viewportWidth;
        
        if (!isFullyVisible) {
          // Calculate how much to scroll
          let scrollTop = scrollY;
          let scrollLeft = scrollX;
          
          // Vertical scrolling
          if (anchorRect.top < 0) {
            // Element is above viewport, scroll up
            scrollTop = scrollY + anchorRect.top - 8; // 8px padding from top
          } else if (anchorRect.bottom > viewportHeight) {
            // Element is below viewport, scroll down
            scrollTop = scrollY + (anchorRect.bottom - viewportHeight) + 8; // 8px padding from bottom
          }
          
          // Horizontal scrolling
          if (anchorRect.left < 0) {
            // Element is left of viewport, scroll left
            scrollLeft = scrollX + anchorRect.left - 8; // 8px padding from left
          } else if (anchorRect.right > viewportWidth) {
            // Element is right of viewport, scroll right
            scrollLeft = scrollX + (anchorRect.right - viewportWidth) + 8; // 8px padding from right
          }
          
          // Clamp scroll values to valid range
          scrollTop = Math.max(0, Math.min(scrollTop, document.documentElement.scrollHeight - viewportHeight));
          scrollLeft = Math.max(0, Math.min(scrollLeft, document.documentElement.scrollWidth - viewportWidth));
          
          // Scroll smoothly to position
          window.scrollTo({
            top: scrollTop,
            left: scrollLeft,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [isOpen, onOpenChange, anchorElement]);

  useEffect(() => {
    if (!isOpen || !anchorElement) return;

    const calculatePosition = () => {
      if (!popoverRef.current) return;
      
      const anchorRect = anchorElement.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      const spacing = 8; // 8px spacing from anchor
      
      // Calculate available space in viewport (not including scroll)
      const availableSpace = {
        top: anchorRect.top,
        bottom: viewportHeight - anchorRect.bottom,
        left: anchorRect.left,
        right: viewportWidth - anchorRect.right,
      };

      // Use actual popover size if available, otherwise estimate
      const popoverSize = {
        width: popoverRect.width > 0 ? popoverRect.width : 384, // Default to md:w-96 (384px)
        height: popoverRect.height > 0 ? popoverRect.height : 400, // Estimate
      };

      // Calculate scores for each position (higher is better)
      const scores = {
        bottom: availableSpace.bottom - popoverSize.height - spacing,
        top: availableSpace.top - popoverSize.height - spacing,
        right: availableSpace.right - popoverSize.width - spacing,
        left: availableSpace.left - popoverSize.width - spacing,
      };

      // Find the best position
      let bestPlacement = 'bottom';
      let bestScore = scores.bottom;

      if (scores.top > bestScore) {
        bestScore = scores.top;
        bestPlacement = 'top';
      }
      if (scores.right > bestScore) {
        bestScore = scores.right;
        bestPlacement = 'right';
      }
      if (scores.left > bestScore) {
        bestScore = scores.left;
        bestPlacement = 'left';
      }

      // If no position has enough space, use the one with the most space
      if (bestScore < 0) {
        const maxScore = Math.max(scores.bottom, scores.top, scores.right, scores.left);
        if (maxScore === scores.top) bestPlacement = 'top';
        else if (maxScore === scores.right) bestPlacement = 'right';
        else if (maxScore === scores.left) bestPlacement = 'left';
        else bestPlacement = 'bottom';
      }

      // Calculate max dimensions to prevent overlap with anchor
      let maxWidth = 500; // Default max-width
      let maxHeight = null; // Default max-height (unlimited)
      let allowAutoHeight = false; // Whether to allow auto-sizing based on content
      
      // Calculate position based on placement (using getBoundingClientRect which is relative to viewport)
      let top = 0;
      let left = 0;

      switch (bestPlacement) {
        case 'bottom':
          // For top/bottom: Shrink popover to not overlap the widget
          // Calculate available space below the anchor
          const availableBottom = viewportHeight - anchorRect.bottom - spacing - 8; // 8px viewport padding
          maxHeight = Math.max(200, availableBottom); // At least 200px, but don't exceed available space
          
          top = anchorRect.bottom + scrollY + spacing;
          left = anchorRect.left + scrollX + (anchorRect.width / 2) - (popoverSize.width / 2);
          
          // Check for horizontal overlap and limit width if needed
          const anchorLeft = anchorRect.left + scrollX;
          const anchorRight = anchorRect.right + scrollX;
          const popoverLeft = left;
          const popoverRight = left + popoverSize.width;
          
          if (popoverLeft < anchorRight && popoverRight > anchorLeft) {
            // Overlap detected - limit width to anchor width plus spacing
            maxWidth = Math.max(320, anchorRect.width - spacing * 2);
          }
          break;
        case 'top':
          // For top/bottom: Shrink popover to not overlap the widget
          // Calculate available space above the anchor
          const availableTop = anchorRect.top - spacing - 8; // 8px viewport padding
          maxHeight = Math.max(200, availableTop);
          
          top = anchorRect.top + scrollY - popoverSize.height - spacing;
          left = anchorRect.left + scrollX + (anchorRect.width / 2) - (popoverSize.width / 2);
          
          // Check for horizontal overlap and limit width if needed
          const anchorLeftTop = anchorRect.left + scrollX;
          const anchorRightTop = anchorRect.right + scrollX;
          const popoverLeftTop = left;
          const popoverRightTop = left + popoverSize.width;
          
          if (popoverLeftTop < anchorRightTop && popoverRightTop > anchorLeftTop) {
            maxWidth = Math.max(320, anchorRect.width - spacing * 2);
          }
          break;
        case 'right':
          // For left/right: Prefer no scrolling if content fits within 90vh
          // Set maxHeight to 90vh but allow auto-sizing
          maxHeight = viewportHeight * 0.9; // 90vh
          allowAutoHeight = true;
          
          top = anchorRect.top + scrollY + (anchorRect.height / 2) - (popoverSize.height / 2);
          left = anchorRect.right + scrollX + spacing;
          
          // Also limit width to available space
          maxWidth = Math.min(500, availableSpace.right - spacing);
          break;
        case 'left':
          // For left/right: Prefer no scrolling if content fits within 90vh
          // Set maxHeight to 90vh but allow auto-sizing
          maxHeight = viewportHeight * 0.9; // 90vh
          allowAutoHeight = true;
          
          top = anchorRect.top + scrollY + (anchorRect.height / 2) - (popoverSize.height / 2);
          left = anchorRect.left + scrollX - popoverSize.width - spacing;
          
          // Also limit width to available space
          maxWidth = Math.min(500, availableSpace.left - spacing);
          break;
      }

      // Clamp to viewport (accounting for scroll)
      const minLeft = scrollX + 8;
      const maxLeft = scrollX + viewportWidth - Math.min(popoverSize.width, maxWidth) - 8;
      const minTop = scrollY + 8;
      const maxTop = scrollY + viewportHeight - Math.min(popoverSize.height, maxHeight || Infinity) - 8;
      
      left = Math.max(minLeft, Math.min(left, maxLeft));
      top = Math.max(minTop, Math.min(top, maxTop));

      setPosition({ top, left, placement: bestPlacement, maxWidth, maxHeight, allowAutoHeight });
    };

    // Calculate position after popover is rendered and has dimensions
    const timeoutId = setTimeout(() => {
      calculatePosition();
      // Recalculate once more after a brief delay to get accurate dimensions
      setTimeout(calculatePosition, 50);
    }, 0);

    // Recalculate on scroll/resize
    window.addEventListener('scroll', calculatePosition, true);
    window.addEventListener('resize', calculatePosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isOpen, anchorElement]);

  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay, not on the popover
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      setIsClosing(true);
    }
  };

  const finishClosing = () => {
    if (isClosing) {
      setIsClosing(false);
      setTimeout(() => {
        onClose();
      }, 0);
    }
  };

  if (isClosed && !isClosing) return null;

  return createPortal(
    <>
      <div 
        className="fixed inset-0 z-40 bg-transparent"
        onClick={handleOverlayClick}
      />
      <div
        ref={popoverRef}
        className={`popover__container popover__container--${position.placement} ${
          position.allowAutoHeight ? 'popover__container--auto-height' : ''
        } ${
          isClosing ? 'animate-popover-out' : 'animate-popover-in'
        }`}
        style={{
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          maxWidth: `${position.maxWidth}px`,
          ...(position.maxHeight && { maxHeight: `${position.maxHeight}px` }),
          ...(position.allowAutoHeight && { height: 'auto' }),
        }}
        onClick={e => e.stopPropagation()}
        onAnimationEnd={finishClosing}
      >
        <div className="popover__container__content">
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}

