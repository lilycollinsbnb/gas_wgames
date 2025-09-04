import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export function useScrollableSlider(defaultActivePath: string = '/') {
  const router = useRouter();
  const sliderEl = useRef<HTMLDivElement>(null);
  const sliderPrevBtn = useRef<HTMLButtonElement>(null);
  const sliderNextBtn = useRef<HTMLButtonElement>(null);

  function scrollToTheRight() {
    if (sliderEl.current) {
      let offsetWidth = sliderEl.current.offsetWidth;
      sliderEl.current.scrollLeft += offsetWidth / 2;
      updateButtonVisibility();
    }
  }

  function scrollToTheLeft() {
    if (sliderEl.current) {
      let offsetWidth = sliderEl.current.offsetWidth;
      sliderEl.current.scrollLeft -= offsetWidth / 2;
      updateButtonVisibility();
    }
  }

  function updateButtonVisibility() {
    const filterBarEl = sliderEl.current;
    const prevBtn = sliderPrevBtn.current;
    const nextBtn = sliderNextBtn.current;

    if (!filterBarEl || !prevBtn || !nextBtn) return;

    const { scrollLeft, offsetWidth, scrollWidth } = filterBarEl;

    // Show/hide next button
    if (
      scrollWidth > offsetWidth &&
      scrollLeft + offsetWidth < scrollWidth - 1
    ) {
      nextBtn.classList.remove('opacity-0', 'invisible');
    } else {
      nextBtn.classList.add('opacity-0', 'invisible');
    }

    // Show/hide previous button
    if (scrollLeft > 0) {
      prevBtn.classList.remove('opacity-0', 'invisible');
    } else {
      prevBtn.classList.add('opacity-0', 'invisible');
    }
  }

  useEffect(() => {
    const filterBarEl = sliderEl.current;

    if (!filterBarEl) return;

    updateButtonVisibility();

    function handleResize() {
      updateButtonVisibility();
    }

    function handleScroll() {
      updateButtonVisibility();
    }

    window.addEventListener('resize', handleResize);
    filterBarEl.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      filterBarEl.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    sliderEl,
    sliderPrevBtn,
    sliderNextBtn,
    scrollToTheRight,
    scrollToTheLeft,
  };
}
