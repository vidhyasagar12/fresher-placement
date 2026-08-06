/**
 * HTML5 Canvas 1080x1080 Instagram Poster Generator for FresherPlacement
 * Renders high-contrast, crisp typography for Company, Role, Location, Salary, Experience & Tech Stack.
 */
export async function generateJobPoster(job) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  // Extract Job Data with fallback values
  const company = (job.company || 'Top Tech Company').trim();
  const role = (job.role || 'Software Development Engineer').trim();
  const location = (job.location || 'Pan India').trim();
  const type = (job.type || 'Onsite').trim();
  const salary = (job.salary || 'Best in Industry').trim();
  const experience = (job.experience || 'Fresher (0-1 yr)').trim();
  const logoChar = (job.logo || company || 'C').charAt(0).toUpperCase();
  const logoColor = job.logoColor || job.logo_color || '#6c3cfc';

  // 1. Canvas Background
  ctx.save();
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
  bgGrad.addColorStop(0, '#090714');
  bgGrad.addColorStop(0.5, '#160e2e');
  bgGrad.addColorStop(1, '#0b0616');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1080);

  // Radial Ambient Light
  const glow1 = ctx.createRadialGradient(200, 200, 10, 200, 200, 500);
  glow1.addColorStop(0, 'rgba(108, 60, 252, 0.4)');
  glow1.addColorStop(1, 'rgba(108, 60, 252, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, 1080, 1080);

  const glow2 = ctx.createRadialGradient(880, 880, 10, 880, 880, 500);
  glow2.addColorStop(0, 'rgba(233, 30, 140, 0.3)');
  glow2.addColorStop(1, 'rgba(233, 30, 140, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, 1080, 1080);

  // Outer Border Frame
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 4;
  ctx.rect(30, 30, 1020, 1020);
  ctx.stroke();

  // 2. Top Header Bar
  ctx.beginPath();
  const headerGrad = ctx.createLinearGradient(80, 70, 1000, 70);
  headerGrad.addColorStop(0, '#6c3cfc');
  headerGrad.addColorStop(1, '#9333ea');
  ctx.fillStyle = headerGrad;
  ctx.roundRect(80, 65, 920, 75, 18);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 28px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🚨 NEW JOB OPENING • FRESHER PLACEMENT 🚨', 540, 1025 / 10);

  // 3. Main Content Container Card
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.roundRect(80, 165, 920, 750, 24);
  ctx.fill();
  ctx.stroke();

  // 4. Company Logo Circle & Name
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Draw Logo Circle Background
  ctx.beginPath();
  ctx.fillStyle = logoColor;
  ctx.arc(160, 245, 46, 0, Math.PI * 2);
  ctx.fill();

  // Logo Border Ring
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 3;
  ctx.arc(160, 245, 46, 0, Math.PI * 2);
  ctx.stroke();

  // Logo Letter
  ctx.textAlign = 'center';
  ctx.font = '900 46px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(logoChar, 160, 261);

  // Company Name
  ctx.textAlign = 'left';
  ctx.font = '800 36px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(company, 230, 242);

  // Verified Badge
  ctx.font = '700 20px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.fillText('✓ Verified Hiring Drive', 230, 275);

  // 5. Job Role / Title
  ctx.font = '900 44px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#f8fafc';
  
  let roleTitle = role;
  if (roleTitle.length > 32) {
    ctx.font = '900 36px "Inter", system-ui, sans-serif';
  }
  ctx.fillText(roleTitle, 120, 360);

  // Line Divider
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.moveTo(120, 395);
  ctx.lineTo(960, 395);
  ctx.stroke();

  // 6. Details Grid (2x2 Cards with Icons & Typography)
  const gridItems = [
    { icon: '📍', label: 'LOCATION', value: location, color: '#38bdf8' },
    { icon: '💼', label: 'WORK MODE', value: type, color: '#a78bfa' },
    { icon: '💰', label: 'SALARY PACKAGE', value: salary, color: '#f43f5e' },
    { icon: '🎓', label: 'ELIGIBILITY', value: experience, color: '#34d399' },
  ];

  gridItems.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 120 + col * 430;
    const y = 425 + row * 135;
    const boxW = 410;
    const boxH = 118;

    // Card Fill
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.roundRect(x, y, boxW, boxH, 16);
    ctx.fill();
    ctx.stroke();

    // Accent Line on Left of Card
    ctx.beginPath();
    ctx.fillStyle = item.color;
    ctx.roundRect(x, y + 16, 5, boxH - 32, 4);
    ctx.fill();

    // Icon & Label Header
    ctx.textAlign = 'left';
    ctx.font = '800 18px "Inter", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText(`${item.icon} ${item.label}`, x + 24, y + 42);

    // Value Text
    ctx.font = '800 24px "Inter", system-ui, sans-serif';
    ctx.fillStyle = '#ffffff';

    // Truncate long value string if needed
    let valStr = item.value;
    if (valStr.length > 24) {
      ctx.font = '800 20px "Inter", system-ui, sans-serif';
    }
    ctx.fillText(valStr, x + 24, y + 84);
  });

  // 7. Tech Stack Section
  ctx.textAlign = 'left';
  ctx.font = '800 20px "Inter", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText('⚡ REQUIRED SKILLS & TECH STACK:', 120, 725);

  const tags = Array.isArray(job.tags) 
    ? job.tags 
    : (typeof job.tags === 'string' ? job.tags.split(',') : ['Java', 'Python', 'DSA']);

  let tagX = 120;
  const tagY = 750;

  tags.slice(0, 5).forEach((t) => {
    const tagText = String(t).trim();
    if (!tagText) return;

    ctx.font = '800 20px "Inter", system-ui, sans-serif';
    const textWidth = ctx.measureText(tagText).width;
    const pillWidth = textWidth + 36;

    // Check bounds
    if (tagX + pillWidth > 960) return;

    ctx.beginPath();
    ctx.fillStyle = 'rgba(108, 60, 252, 0.3)';
    ctx.strokeStyle = 'rgba(167, 139, 250, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.roundRect(tagX, tagY, pillWidth, 44, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#c084fc';
    ctx.fillText(tagText, tagX + 18, tagY + 29);

    tagX += pillWidth + 14;
  });

  // 8. Bottom CTA Banner
  ctx.beginPath();
  const footerGrad = ctx.createLinearGradient(80, 940, 1000, 940);
  footerGrad.addColorStop(0, '#6c3cfc');
  footerGrad.addColorStop(1, '#e91e8c');
  ctx.fillStyle = footerGrad;
  ctx.roundRect(80, 935, 920, 75, 20);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 26px "Inter", system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('👉 LINK IN BIO TO APPLY • fresherplacement.com', 540, 972.5);

  ctx.restore();

  // Return Data URL and Blob
  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

  return { canvas, dataUrl, blob };
}
