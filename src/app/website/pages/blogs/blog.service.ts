import { Injectable } from '@angular/core';

// ✅ Interface declared OUTSIDE class (but in same file)
export interface Blog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  tags: string[];
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  // ✅ Blog data stored directly in service
  private blogs: Blog[] = [

    {
      id: 1,
      slug: 'ai-changing-frontend-development',
      title: 'How AI Is Changing Frontend Development (And What Developers Should Learn Next)',
      excerpt: 'AI tools are not replacing frontend developers — they are transforming how we build UI.',
      cover: '../../../../assets/images/ai_changing.png',
      date: '2025-12-08',
      tags: ['AI', 'Web Development', 'Future Tech'],
      content: `
  <p>AI has evolved from concept to coworker. It is no longer a futuristic buzz — it is quietly rewriting how 
  frontend development works, making workflows faster, intuitive and more data—driven.</p>

  <p>Instead of asking “Will AI replace developers?” the better question is:
  “Which developers will learn to use AI, and which ones will get replaced?”</p>

  <h2>1. AI—Powered Code Generation — Not Just Autocomplete</h2>
  <p>From snippet generation and component scaffolding to API integration and test generation,
  tools like GitHub Copilot, ChatGPT and Cursor are reshaping how developers start projects.</p>

  <p><strong>AI is no longer a suggestion tool — it is a thinking assistant.</strong></p>

  <ul>
    <li>Generate boilerplate files in seconds</li>
    <li>Refactor and optimise completed code</li>
    <li>Explain code blocks like a mentor</li>
    <li>Produce documentation based on your logic</li>
  </ul>

  <p>This means a developer’s value moves from typing speed to system thinking ability.</p>

  <h2>2. Smart UI Design Suggestions & UX Support</h2>
  <p>AI tools are analysing UI behaviour and giving feedback like:</p>

  <ul>
    <li>Accessibility warnings</li>
    <li>Alignment/sizing issues</li>
    <li>UI density adjustments</li>
    <li>Colour contrast suggestions based on standards</li>
  </ul>

  <p>Design tools like Figma, Framer and Uizard are embedding AI to auto—generate layouts 
  based on natural language prompts.</p>

  <blockquote>“When UI becomes AI—generated, custom UX thinking becomes your competitive edge.”</blockquote>

  <h2>3. Will AI Replace Developers?</h2>
  <p>AI will replace:</p>
  <ul>
    <li>Repetitive coding</li>
    <li>Manual documentation</li>
    <li>Basic debugging</li>
  </ul>

  <p>But it cannot replace:</p>
  <ul>
    <li>Architecture decisions</li>
    <li>Creative problem solving</li>
    <li>User empathy and experience thinking</li>
    <li>Understanding business logic</li>
  </ul>

  <p><strong>AI augments developers — it does not erase them.</strong></p>

  <h2>4. Real—World Impact On Job Skills</h2>
  <p>The new “top skills” required are shifting:</p>

  <ul>
    <li>Prompt engineering — communicating intent properly</li>
    <li>System thinking — understanding how parts connect</li>
    <li>Reviewing AI output — judgement > typing</li>
    <li>Rapid prototyping — shipping faster</li>
  </ul>

  <p>Those who learn these skills will build better products faster.</p>

  <h2>5. What Should Developers Learn Next?</h2>

  <p>To stay relevant, frontend engineers must expand beyond code.</p>

  <ul>
    <li><strong>AI—assisted development:</strong> experiment with Copilot, Replit AI, ChatGPT</li>
    <li><strong>Product & UX thinking:</strong> understand user intent, empathy, and journeys</li>
    <li><strong>Automation:</strong> scripts, generator tools, reusable dev workflows</li>
    <li><strong>Communication:</strong> because prompting is the new coding language</li>
  </ul>

  <blockquote>“The developers who thrive aren’t the ones who write the most code, 
  but the ones who can <strong>build the smartest systems with the least typing</strong>.”</blockquote>

  <h2>6. The Future — AI as Pair Programmer, Not Replacement</h2>
  <p>AI will be:</p>

  <ul>
    <li>Pair—programmer for debugging</li>
    <li>UX reviewer during development</li>
    <li>A prototype engine for ideas</li>
    <li>A validator for logic and security</li>
  </ul>

  <p>But humans will remain responsible for:</p>
  <ul>
    <li>Project vision</li>
    <li>Ethics</li>
    <li>Experience design</li>
    <li>Innovation</li>
  </ul>

  <p>The development space is transforming — <strong>not replacing — but elevating</strong>.</p>

  <h2>Final Thought</h2>
  <p>AI is not your competition.</p>
  <p>It is your amplifier — turning you into a faster, clearer, more strategic engineer.</p>

  <p>The only developers at risk are those who refuse to adapt.</p>

  <p><strong>The ones who learn to use AI will lead the next generation of frontend engineering.</strong></p>
`

    },

    {
      id: 2,
      slug: 'website-speed-new-seo',
      title: 'Why Website Speed Is the New SEO (How Google Actually Ranks You)',
      excerpt: 'Faster websites convert more, rank higher, and deliver better user satisfaction.',
      cover: '../../../../assets/images/google-spped.png',
      date: '2025-12-10',
      tags: ['SEO', 'Performance', 'Web'],
      content: `
<p>Search ranking is no longer about keywords alone <strong>performance is now one of Google’s strongest ranking signals.</strong>  
In 2025, Google rewards websites that feel fast, stable, and interactive. If your page is slow, no amount of keyword optimization can save you.</p>

<h2>1. Core Web Vitals Are Ranking Factors</h2>
<p>Google evaluates your site using three critical metrics that directly impact SEO:</p>

<ul>
  <li><strong>LCP (Largest Contentful Paint)</strong> — How fast the main content loads.</li>
  <li><strong>CLS (Cumulative Layout Shift)</strong> — How stable the page is while loading.</li>
  <li><strong>FID / INP (Interaction Delay)</strong> — How quickly the page responds when a user taps or clicks.</li>
</ul>

<p>A poor score in any of these areas sends a clear signal to Google:  
<strong>“This page is frustrating do not rank it highly.”</strong></p>

<h2>2. Why Users Leave Slow Sites</h2>
<p>The biggest reason Google emphasizes performance is simple: <strong>humans hate waiting.</strong></p>

<ul>
  <li><strong>53%</strong> of users abandon a site if it takes more than 3 seconds to load.</li>
  <li>Mobile users expect it to load in <strong>2 seconds or less.</strong></li>
  <li>Every 1-second delay can reduce conversions by <strong>7%.</strong></li>
</ul>

<p>A slow website doesn’t just lose rankings it loses money.</p>

<h2>3. Practical Speed Boosts (That Actually Matter)</h2>
<p>These are the highest impact optimizations developers can apply today:</p>

<ul>
  <li><strong>Lazy load</strong> images and components to reduce initial load size.</li>
  <li><strong>Compress images</strong> using next-gen formats like WebP or AVIF.</li>
  <li><strong>Preload critical routes</strong> to speed up navigation.</li>
  <li><strong>Enable caching layers</strong> and use a global CDN.</li>
  <li><strong>Use async or defer</strong> on blocking JavaScript files.</li>
  <li><strong>Minify CSS/JS</strong> and remove unused code.</li>
</ul>

<p>Even small improvements like shaving off 300ms can move your page from “average” to “fast” in Google’s eyes.</p>

<blockquote>“Only developers who measure performance actually improve it.”  
Great SEO starts with Lighthouse, PageSpeed Insights, and real user monitoring.</blockquote>

<h2>The Bottom Line</h2>
<p>The best SEO tactic in 2025 is no longer backlinks or keyword stuffing —  
<strong>it’s building blazing-fast, frictionless web experiences.</strong></p>

<p>If your website loads instantly, Google rewards you, users stay longer, and conversions naturally rise.</p>
  `
    },

    {
      id: 3,
      slug: 'psychology-of-trusting-ai',
      title: 'Why We Believe AI Even When It’s Wrong — The Psychology of Machine Trust',
      excerpt: 'Humans doubt humans but trust algorithms. Why do we believe AI, even when it lies?',
      cover: '../../../../assets/images/ai-image.png', // save the generated image with this name
      date: '2025-12-09',
      tags: ['AI Psychology', 'Digital Behavior', 'Future Tech'],
      content: `
<p>We live in a strange moment — people argue with family, ignore experts, but blindly follow suggestions from Siri, Google, or ChatGPT. Why do humans trust machines more than humans?</p>

<p>The answer lies in psychology, not technology.</p>

<p>AI doesn’t think—it predicts. Unlike humans, it never says “I’m not sure.” Instea d, it confidently fills gaps with the most statistically likely answer. The result? We mistake confidence for correctness. That’s why AI can be wrong, yet still persuasive.</p>


<h2>1. Algorithm Authority Bias — Machines Feel “Objective”</h2>
<p>Humans have bias, ego, emotion. But algorithms appear neutral — even when they aren’t.</p>
<p>When a system presents an answer confidently, the brain assumes:</p>

<ul>
  <li>Computers can’t lie</li>
  <li>Machines don’t judge us</li>
  <li>Technology is precise</li>
</ul>

<p>This illusion of objectivity gives AI psychological authority.</p>

<blockquote>“Humans trust code because they assume it has no motive — even when the motive is hidden in design.”</blockquote>

<h2>2. The Google Effect — Our Brain Outsourced Memory</h2>
<p>Research shows people don’t store facts anymore — they store where to find them.</p>
<p>This dependency creates a belief:</p>
<p><strong>“If it came from Google (or AI), it must be true.”</strong></p>

<p>We trust sources we rely on daily — repetition breeds credibility.</p>

<h2>3. Confidence Bias — AI Never Doubts Itself</h2>
<p>Humans hesitate, AI doesn’t.</p>
<p>Even when wrong, AI phrases responses with certainty. The brain confuses certainty with correctness.</p>

<h2>4. Low Social Risk — Machines Can’t Judge You</h2>
<p>People fear looking stupid in front of other humans.</p>
<p>Asking AI feels safer because there is:</p>
<ul>
  <li>No shame</li>
  <li>No ego</li>
  <li>No rejection</li>
</ul>

<p>So we subconsciously prefer machine help over human help — it protects our identity.</p>

<h2>5. Familiarity = Trust</h2>
<p>The more often we interact with something, the safer it feels.</p>
<p>AI is everywhere — phones, cars, shopping, search. Ubiquity rewires trust pathways.</p>

<h2>6. The Danger — We Believe AI Even When It’s Wrong</h2>
<p>AI confidently invents facts, references, medical advice, and calculations — yet studies show people still follow it.</p>

<blockquote>“Confidence is more influential than accuracy.”</blockquote>

<h2>7. The Future — Trust Will Shift from Accuracy to Alignment</h2>
<p>We will not trust AI because it is correct —  
but because it aligns with <em>how we think</em> and <em>what we want to hear</em>.</p>

<p>This brings a risk:</p>
<ul>
  <li>Echo chambers become algorithmically reinforced</li>
  <li>AI becomes emotional validation instead of knowledge</li>
  <li>People stop verifying truth</li>
</ul>

<h2>Final Thought</h2>
<p>AI is not inherently trustworthy — 
our minds simply evolved to trust confident, accessible, non-judgmental systems.</p>

<p><strong>The real question is:</strong>  
Are we using AI as a tool — or a replacement for thinking?</p>
  `
    },

    {
      id: 4,
      slug: 'burnout-doesnt-come-from-coding-it-comes-from-context-switching',
      title: 'Burnout Doesn’t Come From Coding — It Comes From Context Switching',
      excerpt: 'Coding isn’t what exhausts developers. Meetings, notifications, tools, and constant task-switching slowly drain focus and energy.',
      cover: '../../../../assets/images/worklife.png', // save image with this name
      date: '2025-12-15',
      tags: ['Work-Life Balance', 'Developer Wellness', 'Tech Culture'],
      content: `
<p>Most people think developers burn out because they code too much.</p>

<p>That’s rarely true.</p>

<p>Burnout doesn’t come from writing code for hours.  
It comes from constantly stopping and restarting your brain.</p>

<p><strong>It comes from context switching.</strong></p>

<h2>What Context Switching Really Looks Like</h2>
<p>Context switching isn’t just changing tasks — it’s changing <em>mental states</em>.</p>

<p>A typical developer day looks like this:</p>
<ul>
  <li>Start coding</li>
  <li>Slack notification</li>
  <li>Quick meeting invite</li>
  <li>Review someone else’s code</li>
  <li>Back to your task — but the flow is gone</li>
</ul>

<p>You didn’t code less — you just never went deep.</p>

<h2>Coding Creates Flow — Switching Breaks It</h2>
<p>Deep coding is one of the few activities that creates flow.</p>

<p>Flow is calm. Focused. Absorbing.</p>

<p>Context switching does the opposite:</p>
<ul>
  <li>It increases cognitive load</li>
  <li>It fragments attention</li>
  <li>It creates mental residue</li>
</ul>

<p>Your brain keeps partially thinking about the previous task — even after you’ve moved on.</p>

<blockquote>“You’re tired not because the work is hard, but because your attention never rests.”</blockquote>

<h2>Tools Were Meant to Help — Not Interrupt</h2>
<p>Ironically, many tools designed to improve productivity do the opposite.</p>

<ul>
  <li>Slack encourages instant responses</li>
  <li>Project tools demand constant updates</li>
  <li>Calendars slice days into tiny fragments</li>
</ul>

<p>Each tool is useful on its own.  
Together, they create a constant state of alertness.</p>

<h2>Multitasking Is the Fastest Path to Burnout</h2>
<p>Multitasking feels productive — but it’s biologically expensive.</p>

<p>Every switch has a cost:</p>
<ul>
  <li>More mistakes</li>
  <li>Lower code quality</li>
  <li>Longer recovery time</li>
</ul>

<p>The result is exhaustion without satisfaction.</p>

<h2>Why This Is a Work-Life Balance Problem</h2>
<p>Burnout isn’t always about working late.</p>

<p>It’s about never mentally disconnecting.</p>

<p>When your day is filled with interruptions, your brain stays in work mode even after logging off.</p>

<p>You close your laptop — but the noise continues.</p>

<h2>What Actually Helps</h2>
<ul>
  <li>Fewer meetings, not shorter ones</li>
  <li>Clear focus blocks</li>
  <li>Async communication when possible</li>
  <li>Protecting uninterrupted coding time</li>
</ul>

<p>Good work-life balance starts with respecting attention — not just time.</p>

<h2>Final Thought</h2>
<p>Coding didn’t burn you out.</p>

<p><strong>Constant interruption did.</strong></p>

<p>Focus is not a luxury in tech — it’s a requirement.</p>
`
    },

    {
      id: 5,
      slug: 'most-tech-managers-dont-lead-they-bottleneck',
      title: 'Most Tech Managers Don’t Lead They Bottleneck',
      excerpt: 'In an AI-powered world, control-heavy tech management slows teams down. Real leadership is about systems, trust, and removing blockers.',
      cover: '../../../../assets/images/TechLeadBalance.webp', // save image with this name
      date: '2026-01-09',
      tags: ['Tech Leadership', 'Engineering Management', 'Future of Work', 'AI'],
      content: `
<p><strong>Hot take:</strong> Most tech managers don’t fail because of bad technical decisions.</p>

<p>They fail because they confuse <em>control</em> with <em>leadership</em>.</p>

<p>In today’s AI-powered world, a Tech Lead’s job is no longer about tracking every task or reviewing every small decision.</p>

<p><strong>It’s about designing systems where teams can move without you.</strong></p>

<h2>What Bad Tech Leadership Looks Like</h2>
<ul>
  <li>Approving every PR personally</li>
  <li>Monitoring hours instead of outcomes</li>
  <li>Being the single point of decision-making</li>
  <li>Jumping into every problem to “help”</li>
</ul>

<p>If your team slows down when you’re unavailable, that’s not reliability that’s dependency.</p>

<h2>AI Didn’t Kill Leadership It Exposed Weak Leadership</h2>
<p>AI can now:</p>
<ul>
  <li>Write boilerplate code</li>
  <li>Detect bugs early</li>
  <li>Automate deployments</li>
</ul>

<p>But it can’t create clarity.</p>
<p>It can’t build trust.</p>
<p>And it can’t design healthy engineering systems.</p>

<p>That’s still the leader’s job.</p>

<h2>Real Tech Leaders Remove Friction</h2>
<p>Strong tech managers don’t try to be the smartest person in the room.</p>

<p>They focus on:</p>
<ul>
  <li>Removing blockers</li>
  <li>Reducing decision fatigue</li>
  <li>Protecting deep work</li>
  <li>Letting engineers think</li>
</ul>

<p>They build teams that can operate and even thrive without constant oversight.</p>

<h2>The Bottleneck Test</h2>
<p>Ask yourself honestly:</p>

<blockquote>
<p>Can my team ship confidently if I step away for a week?</p>
</blockquote>

<p>If the answer is no, the problem isn’t the team.</p>
<p><strong>It’s the system.</strong></p>

<h2>Final Thought</h2>
<p>If AI can replace most of what you do as a tech manager, you weren’t leading.</p>

<p>You were executing.</p>

<p>Great tech leadership scales people not control.</p>
`
    }

  ];

  constructor() { }

  // ✅ Get all blogs
  getBlogs(): Blog[] {
    return this.blogs;
  }

  // ✅ Get single blog by slug
  getBlogBySlug(slug: string): Blog | undefined {
    return this.blogs.find(blog => blog.slug === slug);
  }
}
