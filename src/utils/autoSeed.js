import { supabase } from '../supabase';
import { jobs as staticJobs } from '../data/jobs';
import { blogs as staticBlogs } from '../data/blogs';
import { interviewCategories as staticCats } from '../data/interviewPrep';
import { parseRelativeTimeToIso } from './formatTime';
import { generateJobFingerprint } from './cleanDuplicates';

/**
 * Smart Deduplicated Seeding Engine
 * Prevents any duplicate rows when seeding or populating Supabase database.
 */
export async function smartSeedAll(logCallback = () => {}) {
  const logs = [];
  const addLog = (msg, type = 'info') => {
    logs.push({ msg, type });
    logCallback(msg, type);
  };

  try {
    // 1. Jobs Deduplication Check
    addLog('🔍 Checking jobs table for duplicates...', 'info');
    const { data: existingJobs } = await supabase.from('jobs').select('*');
    const existingJobFingerprints = new Set(
      (existingJobs || []).map(j => generateJobFingerprint(j))
    );

    const newJobs = staticJobs.filter(j => {
      const fp = generateJobFingerprint(j);
      return !existingJobFingerprints.has(fp);
    }).map(j => ({
      company: j.company,
      logo: j.logo,
      logo_color: j.logoColor,
      role: j.role,
      location: j.location,
      type: j.type,
      experience: j.experience,
      salary: j.salary,
      tags: j.tags,
      posted: j.posted,
      apply_link: j.applyLink,
      description: j.description,
      requirements: j.requirements,
      created_at: parseRelativeTimeToIso(j.posted),
    }));

    if (newJobs.length > 0) {
      const { error: jErr } = await supabase.from('jobs').insert(newJobs);
      if (jErr) addLog(`⚠️ Jobs insert warning: ${jErr.message}`, 'error');
      else addLog(`✅ Inserted ${newJobs.length} new jobs (skipped ${staticJobs.length - newJobs.length} existing duplicates)`, 'success');
    } else {
      addLog(`ℹ️ All jobs already exist (${existingJobs?.length || 0} total). Skipped duplicates.`, 'info');
    }

    // 2. Blogs Upsert by unique slug
    addLog('🔍 Syncing blogs by unique slug...', 'info');
    const blogPayloads = staticBlogs.map(b => ({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      category: b.category,
      date: b.date,
      read_time: b.readTime,
      tags: b.tags,
      content: b.content,
    }));
    const { error: bErr } = await supabase.from('blogs').upsert(blogPayloads, { onConflict: 'slug' });
    if (bErr) addLog(`⚠️ Blogs sync warning: ${bErr.message}`, 'error');
    else addLog(`✅ Synced ${blogPayloads.length} blogs (0 duplicates)`, 'success');

    // 3. Interview Categories Upsert by unique id
    addLog('🔍 Syncing interview categories...', 'info');
    const catPayloads = staticCats.map(c => ({ id: c.id, label: c.label, icon: c.icon, color: c.color }));
    const { error: cErr } = await supabase.from('interview_categories').upsert(catPayloads, { onConflict: 'id' });
    if (cErr) addLog(`⚠️ Categories sync warning: ${cErr.message}`, 'error');
    else addLog(`✅ Synced ${catPayloads.length} categories`, 'success');

    // 4. Interview Topics Deduplication
    addLog('🔍 Syncing interview topics...', 'info');
    const { data: existingTopics } = await supabase.from('interview_topics').select('category_id, title');
    const existingTopicSet = new Set(
      (existingTopics || []).map(t => `${t.category_id}|${(t.title || '').toLowerCase().trim()}`)
    );

    const newTopics = staticCats.flatMap(c =>
      c.topics.map(t => ({
        category_id: c.id,
        title: t.title,
        difficulty: t.difficulty,
        time: t.time,
        description: t.desc,
      }))
    ).filter(t => !existingTopicSet.has(`${t.category_id}|${(t.title || '').toLowerCase().trim()}`));

    if (newTopics.length > 0) {
      const { error: tErr } = await supabase.from('interview_topics').insert(newTopics);
      if (tErr) addLog(`⚠️ Topics sync warning: ${tErr.message}`, 'error');
      else addLog(`✅ Inserted ${newTopics.length} new topics`, 'success');
    } else {
      addLog(`ℹ️ All interview topics already exist. Skipped duplicates.`, 'info');
    }

    addLog('🎉 Smart Seed Completed! Zero duplicate entries.', 'success');
    return true;
  } catch (err) {
    addLog(`❌ Smart seed error: ${err.message}`, 'error');
    return false;
  }
}

/**
 * Auto-Seed Hook Helper for Data Hooks:
 * Checks if Supabase table is empty on startup, and if empty, automatically populates initial data.
 */
export async function autoSeedIfEmpty(tableName, checkAndSeedFn) {
  try {
    const { count, error } = await supabase.from(tableName).select('*', { count: 'exact', head: true });
    if (!error && count === 0) {
      console.log(`Table ${tableName} is empty. Auto-seeding initial data...`);
      await checkAndSeedFn();
    }
  } catch (err) {
    console.warn(`Auto-seed check failed for ${tableName}:`, err);
  }
}
