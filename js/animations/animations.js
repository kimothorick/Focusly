window.taskAnimations = (function () {
    'use strict';

    let scrollSpeed = 0.4; // Controls the speed of the scroll
    let accumulatedScroll = 0;
    let taskListElement = null;
    let originalScrollHeight = 0;
    let animationFrameId = null; // To control the animation frame
    let observer = null; // To watch for content changes
    let debounceTimer = null; // To prevent rapid re-initialization

    function autoScroll() {
        if (!taskListElement) return;

        if (taskListElement.scrollHeight <= taskListElement.clientHeight) {
            animationFrameId = requestAnimationFrame(autoScroll);
            return;
        }

        accumulatedScroll += scrollSpeed;
        if (accumulatedScroll < 1) {
            animationFrameId = requestAnimationFrame(autoScroll);
            return;
        }

        const scrollIncrement = Math.floor(accumulatedScroll);
        accumulatedScroll -= scrollIncrement;

        taskListElement.scrollTop += scrollIncrement;

        if (taskListElement.scrollTop >= originalScrollHeight) {
            taskListElement.scrollTop -= originalScrollHeight;
        }

        animationFrameId = requestAnimationFrame(autoScroll);
    }

    function setupObserver() {
        if (observer) {
            observer.disconnect();
        }
        observer = new MutationObserver(() => {
            // Debounce the re-initialization to handle batch updates gracefully.
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                window.taskAnimations.initScrolling();
            }, 100); // Wait 100ms after the last change.
        });
        observer.observe(taskListElement, { childList: true, subtree: true });
    }

    return {
        initScrolling: function () {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (observer) observer.disconnect();

            accumulatedScroll = 0;
            taskListElement = document.getElementById('task-list');

            if (taskListElement) {
                // --- Robust Cleanup: Remove only marked clones ---
                Array.from(taskListElement.children).forEach(child => {
                    if (child.dataset.isClone) {
                        taskListElement.removeChild(child);
                    }
                });

                originalScrollHeight = taskListElement.scrollHeight;
                const clientHeight = taskListElement.clientHeight;

                if (originalScrollHeight > clientHeight) {
                    // --- Robust Cloning: Mark new clones ---
                    const originalChildren = Array.from(taskListElement.children);
                    const clonedChildren = originalChildren.map(child => {
                        const clone = child.cloneNode(true);
                        clone.dataset.isClone = 'true'; // Mark as a clone
                        return clone;
                    });
                    clonedChildren.forEach(clone => taskListElement.appendChild(clone));
                }

                autoScroll();
                setupObserver();
            }
        }
    };
})();