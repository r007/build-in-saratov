import { useEffect, useRef, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';

export interface ProseProps {
  /** Trusted, pre-rendered HTML. Never pass anything a visitor typed. */
  html: string;
  /**
   * CSS selector for images that open enlarged when clicked. The viewer is
   * downloaded only when the content actually has such an image.
   */
  zoomSelector?: string;
  className?: string;
}

/**
 * Renders a block of rich text and wires up the two behaviours its markup
 * cannot express on its own: zoomable images, and in-app navigation for links
 * that stay on the site.
 */
export const Prose = ({ html, zoomSelector, className }: ProseProps) => {
  const container = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const images = zoomSelector
      ? Array.from(container.current?.querySelectorAll<HTMLImageElement>(zoomSelector) ?? [])
      : [];
    if (images.length === 0) return undefined;

    let detach: (() => void) | undefined = undefined;
    let cancelled = false;

    void import('medium-zoom').then(({ default: mediumZoom }) => {
      if (cancelled) return;
      const zoom = mediumZoom(images, { margin: 24, background: '#ffffff' });
      detach = () => {
        zoom.detach();
      };
    });

    return () => {
      cancelled = true;
      detach?.();
    };
  }, [html, zoomSelector]);

  /*
   * Links inside the HTML are plain anchors, so left alone each one would
   * reload the whole document. Same-origin clicks are handed to the router
   * instead; anything modified, external or targeted is left to the browser.
   */
  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;

    const anchor = event.target.closest('a');
    if (!anchor || anchor.target || anchor.hasAttribute('download')) return;

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    void navigate(`${url.pathname}${url.search}${url.hash}`);
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- only intercepts clicks bubbling up from real links, which are focusable and keyboard-operable on their own
    <div
      ref={container}
      className={className ? `prose ${className}` : 'prose'}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
