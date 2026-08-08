/**
 * SEO Caption & Hashtag Engine for Instagram Posts
 */

// Helper to sanitize text for hashtags (e.g. "Node.js" -> "NodeJS", "Bangalore, India" -> "BangaloreJobs")
function toHashtag(str) {
  if (!str) return '';
  return str
    .replace(/[^a-zA-Z0-9]/g, '')
    .trim();
}

export function generateSeoCaption(job) {
  const company = job.company || 'Top Company';
  const role = job.role || 'Software Engineer';
  const location = job.location || 'India';
  const salary = job.salary || 'Best in Industry';
  const experience = job.experience || 'Fresher (0-1 yr)';
  const type = job.type || 'Full Time';
  const applyLink = job.apply_link || job.applyLink || 'https://fresherplacement.com/jobs';
  
  const tagsList = Array.isArray(job.tags) 
    ? job.tags 
    : (job.tags || 'Java, Python, Engineering').split(',').map(t => t.trim());

  const reqList = Array.isArray(job.requirements)
    ? job.requirements
    : (job.requirements || '').split('\n').filter(Boolean);

  // 1. Hook Line (SEO Title Keyword Heavy)
  const hook = `🚨 [HIRING ALERT] ${company} is hiring for ${role}! 💼✨`;

  // 2. Job Overview Grid
  const overview = `
🏢 Company: ${company}
📌 Role: ${role}
📍 Location: ${location}
💼 Work Mode: ${type}
🎓 Experience: ${experience}
💰 Salary: ${salary}`;

  // 3. Key Requirements
  let reqsText = '';
  if (reqList.length > 0) {
    const formattedReqs = reqList.slice(0, 4).map(r => `• ${r}`).join('\n');
    reqsText = `\n\n📋 Key Eligibility:\n${formattedReqs}`;
  }

  // 4. Call to Action (CTA)
  const cta = `
\n🚀 HOW TO APPLY:
1️⃣ Click the LINK IN OUR BIO (@fresherplacement)
2️⃣ Search for "${company}" or "${role}"
3️⃣ Direct Apply Link: ${applyLink}

💾 Save this post for later & 🏷️ Tag a friend who is looking for a job!`;

  // 5. Dynamic SEO Hashtag Engine
  const coreHashtags = [
    '#FresherJobs', '#Hiring2025', '#OffCampusDrive', '#FresherPlacement',
    '#ITJobs', '#SoftwareEngineerJobs', '#JobAlert', '#TechJobsIndia',
  ];

  // Tech Hashtags
  const techHashtags = tagsList.map(t => `#${toHashtag(t)}Jobs`).filter(h => h.length > 5);

  // Company Hashtag
  const companyHashtag = `#${toHashtag(company)}Careers`;

  // City Hashtag
  const firstCity = location.split(',')[0].trim();
  const cityHashtag = `#${toHashtag(firstCity)}Jobs`;

  // Combine unique hashtags
  const allHashtags = Array.from(new Set([
    ...coreHashtags,
    companyHashtag,
    cityHashtag,
    ...techHashtags,
    '#JobsForFreshers', '#GraduatesHiring', '#CSJobs',
  ])).join(' ');

  // Full Caption
  const fullCaption = `${hook}\n${overview}${reqsText}${cta}\n\n.\n.\n.\n${allHashtags}`;

  // 6. Instagram SEO Alt-Text for Accessibility & Recommendation Algorithm Indexing
  const altText = `${company} hiring ${role} in ${location}. Work mode: ${type}. Salary: ${salary}. Requirements: ${tagsList.join(', ')}. Official job alert on FresherPlacement.`;

  return {
    caption: fullCaption,
    altText,
    hashtags: allHashtags,
  };
}
