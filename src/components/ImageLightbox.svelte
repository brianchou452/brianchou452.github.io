<script lang="ts">
  import { onMount } from 'svelte';

  let isOpen = $state(false);
  let imageSrc = $state('');
  let imageAlt = $state('');
  let scale = $state(1);

  // 拖曳相關狀態
  let isDragging = $state(false);
  let translateX = $state(0);
  let translateY = $state(0);
  let startX = 0;
  let startY = 0;

  export function open(src: string, alt: string) {
    imageSrc = src;
    imageAlt = alt;
    scale = 1;
    translateX = 0;
    translateY = 0;
    isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  // 在 mount 時將 open 函數掛載到 window 上
  onMount(() => {
    (window as any).__openImageLightbox = open;

    return () => {
      delete (window as any).__openImageLightbox;
    };
  });

  function close() {
    isOpen = false;
    scale = 1;
    translateX = 0;
    translateY = 0;
    document.body.style.overflow = '';
  }

  function zoomIn() {
    if (scale < 3) {
      scale = Math.min(scale + 0.5, 3);
    }
  }

  function zoomOut() {
    if (scale > 0.5) {
      scale = Math.max(scale - 0.5, 0.5);
    }
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isOpen) return;

    switch(e.key) {
      case 'Escape':
        close();
        break;
      case '+':
      case '=':
        zoomIn();
        break;
      case '-':
        zoomOut();
        break;
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  function handleMouseDown(e: MouseEvent) {
    if (scale > 1) {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      e.preventDefault();
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (isDragging) {
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
    }
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleTouchStart(e: TouchEvent) {
    if (scale > 1 && e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
      e.preventDefault();
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (isDragging && e.touches.length === 1) {
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
    }
  }

  function handleTouchEnd() {
    isDragging = false;
  }

  $effect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeydown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  });
</script>

{#if isOpen}
  <div
    class="lightbox-backdrop"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-label="圖片燈箱"
  >
    <div class="lightbox-container">
      <!-- 關閉按鈕 -->
      <button
        class="lightbox-close"
        onclick={close}
        aria-label="關閉"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- 縮放控制 -->
      <div class="lightbox-controls">
        <button
          class="lightbox-control-btn"
          onclick={zoomOut}
          aria-label="縮小"
          type="button"
          disabled={scale <= 0.5}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
        <span class="lightbox-zoom-level">{Math.round(scale * 100)}%</span>
        <button
          class="lightbox-control-btn"
          onclick={zoomIn}
          aria-label="放大"
          type="button"
          disabled={scale >= 3}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
      </div>

      <!-- 圖片 -->
      <div class="lightbox-image-wrapper">
        <img
          src={imageSrc}
          alt={imageAlt}
          class="lightbox-image"
          style="transform: scale({scale}) translate({translateX / scale}px, {translateY / scale}px); cursor: {scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'};"
          onwheel={handleWheel}
          onmousedown={handleMouseDown}
          ontouchstart={handleTouchStart}
          draggable="false"
        />
      </div>
    </div>
  </div>
{/if}

<style>
  .lightbox-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.95);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .lightbox-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lightbox-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    z-index: 10001;
  }

  .lightbox-close:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .lightbox-controls {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 0.75rem 1.5rem;
    border-radius: 2rem;
    backdrop-filter: blur(10px);
    z-index: 10001;
  }

  .lightbox-control-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: background-color 0.2s;
  }

  .lightbox-control-btn:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .lightbox-control-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .lightbox-zoom-level {
    color: white;
    font-size: 0.875rem;
    min-width: 3.5rem;
    text-align: center;
  }

  .lightbox-image-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem 6rem;
    overflow: hidden;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.2s ease-out;
    user-select: none;
  }

  @media (max-width: 768px) {
    .lightbox-close {
      top: 0.5rem;
      right: 0.5rem;
      width: 2.5rem;
      height: 2.5rem;
    }

    .lightbox-controls {
      bottom: 1rem;
      padding: 0.5rem 1rem;
    }

    .lightbox-image-wrapper {
      padding: 3rem 1rem 5rem;
    }
  }
</style>
