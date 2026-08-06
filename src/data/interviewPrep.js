export const interviewCategories = [
  {
    id: "dsa",
    label: "DSA & Coding",
    icon: "💻",
    color: "#6c3cfc",
    topics: [
      { title: "Arrays & Strings", difficulty: "Easy", time: "3 hrs", desc: "Master the foundation — two pointers, sliding window, prefix sums." },
      { title: "Linked Lists", difficulty: "Easy", time: "2 hrs", desc: "Reversal, cycle detection, merging, and two-pointer tricks." },
      { title: "Stacks & Queues", difficulty: "Medium", time: "2 hrs", desc: "Monotonic stacks, bracket matching, and BFS foundations." },
      { title: "Trees & BST", difficulty: "Medium", time: "4 hrs", desc: "DFS, BFS, LCA, diameter, and BST operations." },
      { title: "Dynamic Programming", difficulty: "Hard", time: "6 hrs", desc: "Memoization, tabulation, knapsack, LCS, and coin change patterns." },
      { title: "Graphs (BFS/DFS)", difficulty: "Hard", time: "5 hrs", desc: "Topological sort, Dijkstra, Union-Find, and shortest paths." },
    ]
  },
  {
    id: "hr",
    label: "HR Questions",
    icon: "🤝",
    color: "#e91e8c",
    topics: [
      { title: "Tell Me About Yourself", difficulty: "Easy", time: "30 min", desc: "Structure the perfect 2-minute self-introduction for any HR round." },
      { title: "Strengths & Weaknesses", difficulty: "Easy", time: "30 min", desc: "Answer honestly while framing weaknesses as growth opportunities." },
      { title: "Why This Company?", difficulty: "Easy", time: "30 min", desc: "Research-based answers that show genuine interest, not flattery." },
      { title: "Behavioral Questions (STAR)", difficulty: "Medium", time: "2 hrs", desc: "Use the Situation–Task–Action–Result method for situational questions." },
      { title: "Salary Negotiation", difficulty: "Medium", time: "1 hr", desc: "How to negotiate your first salary as a fresher without losing the offer." },
      { title: "Leadership & Teamwork", difficulty: "Medium", time: "1 hr", desc: "Examples from academics, internships, or projects to prove you're a team player." },
    ]
  },
  {
    id: "aptitude",
    label: "Aptitude",
    icon: "🧮",
    color: "#ff6b35",
    topics: [
      { title: "Number Systems & HCF/LCM", difficulty: "Easy", time: "1 hr", desc: "Base conversions, divisibility rules, and HCF/LCM shortcuts." },
      { title: "Percentages & Profit/Loss", difficulty: "Easy", time: "1 hr", desc: "Quick formula-based shortcuts for percentage and ratio problems." },
      { title: "Time, Speed & Distance", difficulty: "Medium", time: "2 hrs", desc: "Trains, boats, relative speed, and meeting-point problems." },
      { title: "Permutations & Combinations", difficulty: "Medium", time: "2 hrs", desc: "Counting principles, arrangements with restrictions." },
      { title: "Probability", difficulty: "Medium", time: "2 hrs", desc: "Classical probability, conditional probability, and Bayes theorem." },
      { title: "Logical Reasoning", difficulty: "Medium", time: "3 hrs", desc: "Blood relations, seating arrangements, direction sense, and syllogisms." },
    ]
  },
  {
    id: "system-design",
    label: "System Design",
    icon: "🏗️",
    color: "#0ea5e9",
    topics: [
      { title: "Basics of System Design", difficulty: "Easy", time: "2 hrs", desc: "Scalability, latency, throughput, CAP theorem, and load balancing." },
      { title: "Databases: SQL vs NoSQL", difficulty: "Easy", time: "1.5 hrs", desc: "When to use relational vs document stores, indexing, and sharding." },
      { title: "URL Shortener Design", difficulty: "Medium", time: "2 hrs", desc: "A classic beginner system design problem — hash generation, redirection." },
      { title: "Design a Chat App", difficulty: "Medium", time: "3 hrs", desc: "WebSockets, message queues, read receipts, and presence indicators." },
      { title: "Design Twitter Feed", difficulty: "Hard", time: "4 hrs", desc: "Fan-out on write vs read, caching, and timeline generation at scale." },
      { title: "Design Netflix", difficulty: "Hard", time: "4 hrs", desc: "CDN, video encoding, microservices, recommendations, and streaming." },
    ]
  },
  {
    id: "resume",
    label: "Resume Tips",
    icon: "📄",
    color: "#10b981",
    topics: [
      { title: "Resume Format & Structure", difficulty: "Easy", time: "1 hr", desc: "The proven single-column format that beats ATS systems every time." },
      { title: "Writing Project Descriptions", difficulty: "Easy", time: "1 hr", desc: "Use the Action–Result formula to make your projects pop." },
      { title: "Skills Section Optimization", difficulty: "Easy", time: "30 min", desc: "How to list skills in a way that matches job descriptions." },
      { title: "ATS Optimization Tricks", difficulty: "Medium", time: "1.5 hrs", desc: "Keyword matching, file format tips, and tools like Jobscan." },
      { title: "Quantifying Your Achievements", difficulty: "Medium", time: "1 hr", desc: "Turn vague bullets into measurable impact statements." },
      { title: "Tailoring Resume Per Job", difficulty: "Medium", time: "1.5 hrs", desc: "How to customize your resume for each application in 10 minutes." },
    ]
  }
];
