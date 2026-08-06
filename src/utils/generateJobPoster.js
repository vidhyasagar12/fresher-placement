/**
 * HTML5 Canvas 1080x1080 Instagram Poster Generator for FresherPlacement
 */
export async function generateJobPoster(job) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Background Gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1080);
  bgGradient.addColorStop(0, '#0f0c1b');
  bgGradient.addColorStop(0.5, '#181033');
  bgGradient.addColorStop(1, '#0b0614');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1080, 1080);

  // Decorative ambient glow circles
  const glow1 = ctx.createRadialGradient(200, 200, 10, 200, 200, 450);
  glow1.addColorStop(0, 'rgba(108, 60, 252, 0.35)');
  glow1.addColorStop(1, 'rgba(108, 60, 252, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, 1080, 1080);

  const glow2 = ctx.createRadialGradient(880, 880, 10, 880, 880, 450);
  glow2.addColorStop(0, 'rgba(233, 30, 140, 0.25)');
  glow2.addColorStop(1, 'rgba(233, 30, 140, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, 1080, 1080);

  // Outer border frame
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, 1020, 1020);

  // 2. Header Bar
  ctx.fillStyle = '#6c3cfc';
  ctx.roundRect(80, 70, 920, 70, 16);
  ctx.fill();

  ctx.font = '900 28px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('🚨 NEW JOB OPENING • FRESHER PLACEMENT 🚨', 540, 115);

  // 3. Main Content Card Container
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.roundRect(80, 175, 920, 740, 28);
  ctx.fill();
  ctx.stroke();

  // 4. Company Logo & Name
  const logoColor = job.logoColor || job.logo_color || '#6c3cfc';
  const logoChar = (job.logo || job.company || 'C').charAt(0).toUpperCase();

  // Draw Logo Circle
  ctx.fillStyle = logoColor;
  ctx.beginPath();
  ctx.arc(160, 260, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '900 48px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(logoChar, 160, 276);

  // Company Name
  ctx.textAlign = 'left';
  ctx.font = '800 36px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText(job.company || 'Top Tech Company', 230, 255);

  // Verified Badge
  ctx.fillStyle = '#10b981';
  ctx.font = '600 20px Inter, sans-serif';
  ctx.fillText('✓ Verified Hiring', 230, 285);

  // 5. Job Role / Title
  ctx.font = '900 48px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  
  // Wrap role title if too long
  const roleText = job.role || 'Software Engineer';
  if (roleText.length > 32) {
    ctx.font = '900 38px Inter, sans-serif';
  }
  ctx.fillText(roleText, 120, 370);

  // Line Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 410);
  ctx.lineTo(960, 410);
  ctx.stroke();

  // 6. Details Grid (2x2 Boxes)
  const gridItems = [
    { label: '📍 LOCATION', value: job.location || 'Pan India' },
    { label: '💼 WORK MODE', value: job.type || 'Onsite' },
    { label: '💰 SALARY PACKAGE', value: job.salary || 'Best in Industry' },
    { label: '🎯 ELIGIBILITY', value: job.experience || 'Fresher (0-1 yr)' },
  ];

  gridItems.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 120 + col * 420;
    const y = 440 + row * 125;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.roundRect(x, y, 400, 105, 16);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 18px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText(item.label, x + 20, y + 38);

    ctx.font = '800 24px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(item.value, x + 20, y + 76);
  });

  // 7. Tech Stack Pills
  ctx.font = '700 20px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText('⚡ TECH STACK & SKILLS:', 120, 725);

  const tags = Array.isArray(job.tags) ? job.tags : (job.tags || 'Java, Python, DSA').split(',');
  let tagX = 120;
  const tagY = 750;

  tags.slice(0, 5).forEach((t) => {
    const tagText = t.trim();
    if (!tagText) return;
    
    ctx.font = '700 20px Inter, sans-serif';
    const textWidth = ctx.measureText(tagText).width;
    const pillWidth = textWidth + 36;

    ctx.fillStyle = 'rgba(108, 60, 252, 0.25)';
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.roundRect(tagX, tagY, pillWidth, 44, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#a78bfa';
    ctx.fillText(tagText, tagX + 18, tagY + 29);

    tagX += pillWidth + 14;
  });

  // 8. Footer Bar & Call to Action
  ctx.fillStyle = 'linear-gradient(90deg, #6c3cfc, #e91e8c)';
  const footerGrad = ctx.createLinearGradient(80, 945, 1000, 945);
  footerGrad.addColorStop(0, '#6c3cfc');
  footerGrad.addColorStop(1, '#e91e8c');
  ctx.fillStyle = footerGrad;
  ctx.roundRect(80, 935, 920, 75, 20);
  ctx.fill();

  ctx.font = '900 26px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('👉 LINK IN BIO TO APPLY • fresherplacement.com', 540, 982);

  // Return Data URL and Blob
  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

  return { canvas, dataUrl, blob };
}
