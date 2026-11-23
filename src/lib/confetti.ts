export const triggerConfetti = () => {
  if (typeof window === 'undefined') return;

  const colors = ['#EA580C', '#0F172A', '#16A34A', '#F59E0B', '#3B82F6', '#8B5CF6'];
  const count = 50;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.zIndex = '9999';
    el.style.width = `${Math.random() * 8 + 6}px`;
    el.style.height = `${Math.random() * 12 + 6}px`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.left = `${50 + (Math.random() * 30 - 15)}%`;
    el.style.top = '60%';
    el.style.borderRadius = '2px';
    el.style.pointerEvents = 'none';
    el.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
    el.style.transform = `translate(0, 0) rotate(0deg)`;

    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 300 + 150;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance - 200;
    const rot = Math.random() * 720 - 360;

    requestAnimationFrame(() => {
      el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      el.style.opacity = '0';
    });

    setTimeout(() => {
      el.remove();
    }, 1300);
  }
};
