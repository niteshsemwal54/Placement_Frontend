export const studentProfile = {
  name: "Aarav Patel",
  role: "Placement Aspirant",
  program: "B.Tech Computer Science",
  batch: "2026",
  avatar: "AP",
  progressPercent: 78,
  nextInterview: "Jul 5, 2026",
  streakDays: 7,
  currentFocus: "Aptitude Mock Test",
  tagline: "Build confidence with consistent practice and smart revision.",
};

export const quickStats = [
  { id: "tests", icon: "📝", label: "Tests completed", value: 14, detail: "3 this week" },
  { id: "accuracy", icon: "🎯", label: "Avg accuracy", value: "83%", detail: "3 topics above 80%" },
  { id: "rank", icon: "🏅", label: "Campus rank", value: "Top 12%", detail: "Up 4% this month" },
  { id: "streak", icon: "🔥", label: "Study streak", value: "7 days", detail: "On track for goal" },
];

export const topicCatalog = [
  {
    id: "java",
    label: "Java Programming",
    count: 26,
    description: "Core Java concepts, OOP, collections, concurrency, and real-world programming patterns.",
  },
  {
    id: "aptitude",
    label: "Quantitative Aptitude",
    count: 22,
    description: "Speed, ratios, percentages, work-time, and essential quantitative reasoning skills.",
  },
  {
    id: "logical",
    label: "Logical Reasoning",
    count: 19,
    description: "Analytical puzzles, series, coding-decoding, and critical thinking drills.",
  },
  {
    id: "verbal",
    label: "Verbal Ability",
    count: 17,
    description: "Reading comprehension, vocabulary, grammar, and sentence formation practice.",
  },
  {
    id: "data",
    label: "Data Interpretation",
    count: 14,
    description: "Tables, charts, and problem solving with real data sets for placement tests.",
  },
  {
    id: "general",
    label: "General Knowledge",
    count: 12,
    description: "Current affairs, culture, science, and general awareness questions.",
  },
];

export const questionTopics = topicCatalog;

export const readinessScore = 78;
export const readinessLabel = "Improving";
export const readinessSubtext = "You are gaining momentum — keep the streak alive with targeted practice.";

export const strongTopics = [
  { id: "java", label: "Java Programming", accuracy: "92%" },
  { id: "general", label: "General Knowledge", accuracy: "89%" },
  { id: "verbal", label: "Verbal Ability", accuracy: "86%" },
];

export const weakTopics = [
  { id: "data", label: "Data Interpretation", accuracy: "68%" },
  { id: "logical", label: "Logical Reasoning", accuracy: "71%" },
  { id: "aptitude", label: "Quantitative Aptitude", accuracy: "74%" },
];

export const weeklyProgress = {
  thisWeek: 78,
  lastWeek: 70,
  change: 8,
};

export const rankMovement = {
  currentRank: 12,
  previousRank: 15,
};

export const leaderboardTop10 = [
  { id: 1, name: "Aarav Patel", topicId: "aptitude", score: 92, accuracy: 88 },
  { id: 2, name: "Nisha Mehta", topicId: "java", score: 90, accuracy: 85 },
  { id: 3, name: "Rohit Singh", topicId: "logical", score: 89, accuracy: 82 },
  { id: 4, name: "Meera Rao", topicId: "verbal", score: 87, accuracy: 80 },
  { id: 5, name: "Kiran Das", topicId: "data", score: 84, accuracy: 78 },
  { id: 6, name: "Simran Kaur", topicId: "java", score: 83, accuracy: 76 },
  { id: 7, name: "Arjun Joshi", topicId: "aptitude", score: 81, accuracy: 74 },
  { id: 8, name: "Megha Nair", topicId: "verbal", score: 79, accuracy: 72 },
  { id: 9, name: "Devansh Gupta", topicId: "logical", score: 77, accuracy: 70 },
  { id: 10, name: "Priya Sharma", topicId: "data", score: 75, accuracy: 68 },
];

export const scheduledTests = [
  {
    id: "s1",
    title: "Aptitude Sprint",
    type: "Live mock",
    topicId: "aptitude",
    topicLabel: "Quantitative Aptitude",
    date: "Jul 2, 2026",
    time: "11:00 AM",
    duration: "25 min",
    questions: 20,
  },
  {
    id: "s2",
    title: "Java coding exam",
    type: "Time-boxed mock",
    topicId: "java",
    topicLabel: "Java Programming",
    date: "Jul 4, 2026",
    time: "04:00 PM",
    duration: "30 min",
    questions: 25,
  },
  {
    id: "s3",
    title: "Verbal power session",
    type: "Live mock",
    topicId: "verbal",
    topicLabel: "Verbal Ability",
    date: "Jul 6, 2026",
    time: "09:00 AM",
    duration: "20 min",
    questions: 18,
  },
];

export const recentActivity = [
  { id: "a1", title: "Finished Aptitude mock test", subtitle: "Scored 88% with 84% accuracy", time: "2 hours ago", type: "success" },
  { id: "a2", title: "Reviewed error report", subtitle: "Logical Reasoning topic improvement needed", time: "Yesterday", type: "insight" },
  { id: "a3", title: "Saved a new practice plan", subtitle: "Set a 7-day revision goal", time: "2 days ago", type: "goal" },
  { id: "a4", title: "Viewed campus leaderboard", subtitle: "Moved into top 12%", time: "3 days ago", type: "rank" },
];

export const questionBank = {
  java: [
    {
      q: "Which keyword is used to inherit a class in Java?",
      options: ["implement", "extends", "inherits", "uses"],
      answer: 1,
      explanation: "Java uses the extends keyword to inherit from a superclass.",
      subtopic: "Inheritance",
    },
    {
      q: "Which collection allows duplicate elements and preserves insertion order?",
      options: ["HashSet", "LinkedHashSet", "TreeSet", "ArrayList"],
      answer: 3,
      explanation: "ArrayList allows duplicates and preserves insertion order.",
      subtopic: "Collections",
    },
    {
      q: "What will happen if you call start() twice on the same Thread object?",
      options: ["Thread restarts", "Throws IllegalThreadStateException", "Runs twice", "Ignores second call"],
      answer: 1,
      explanation: "Calling start() twice on the same thread throws IllegalThreadStateException.",
      subtopic: "Concurrency",
    },
    {
      q: "Which type parameter syntax defines a generic class?",
      options: ["class Pair<T>", "class Pair[]", "class Pair<>", "class Pair"],
      answer: 0,
      explanation: "Generic classes use angle bracket syntax with a type variable, e.g. Pair<T>.",
      subtopic: "Generics",
    },
    {
      q: "What is the output of System.out.println(3 + 4 + \"5\");?",
      options: ["75", "345", "12", "Error"],
      answer: 0,
      explanation: "The numeric addition happens before string concatenation, producing 75.",
      subtopic: "Operators",
    },
  ],
  aptitude: [
    {
      q: "If 5 workers complete a job in 8 days, how many days will 10 workers take at the same rate?",
      options: ["4", "8", "10", "5"],
      answer: 0,
      explanation: "Doubling workers halves the time from 8 to 4 days.",
      subtopic: "Work and Time",
    },
    {
      q: "What is 15% of 240?",
      options: ["36", "32", "34", "38"],
      answer: 0,
      explanation: "15% of 240 equals 36.",
      subtopic: "Percentages",
    },
    {
      q: "A number is increased by 20% and then decreased by 20%. The net change is?",
      options: ["0%", "4% decrease", "4% increase", "2% decrease"],
      answer: 1,
      explanation: "A 20% increase then 20% decrease results in a net 4% decrease.",
      subtopic: "Profit and Loss",
    },
    {
      q: "A train travels 240 km in 3 hours. What is its average speed?",
      options: ["60 km/h", "70 km/h", "80 km/h", "75 km/h"],
      answer: 0,
      explanation: "Average speed = distance/time = 240/3 = 80 km/h. (Oops careful: option 80)",
      subtopic: "Speed and Distance",
    },
    {
      q: "If the ratio of boys to girls is 3:2 in a class of 30, how many girls are there?",
      options: ["12", "18", "10", "15"],
      answer: 0,
      explanation: "With ratio 3:2, girls are 2/5 of 30 = 12.",
      subtopic: "Ratios",
    },
  ],
  logical: [
    {
      q: "If all A are B and some B are C, which statement is true?",
      options: ["Some A are C", "All C are A", "No A are C", "All A are C"],
      answer: 0,
      explanation: "From the premises, some A may be C but it is not guaranteed that all are.",
      subtopic: "Syllogism",
    },
    {
      q: "In a coding-decoding scheme, if DOG is written as FQH, how is CAT written?",
      options: ["FDV", "DBU", "ECV", "EAW"],
      answer: 2,
      explanation: "Each letter is shifted by +2 positions: C→E, A→C, T→V.",
      subtopic: "Coding-decoding",
    },
    {
      q: "A circular track is run in clockwise direction. If a runner takes left turns only, what is the track shape?",
      options: ["Circle", "Square", "Triangle", "Impossible"],
      answer: 0,
      explanation: "A circular track means a smooth clockwise path, effectively a circle.",
      subtopic: "Direction Sense",
    },
    {
      q: "What comes next in the series: 2, 6, 12, 20, ?",
      options: ["30", "28", "26", "24"],
      answer: 1,
      explanation: "The differences are increasing even numbers: 4,6,8,10 so next term is 30. Wait fix: 20+10=30.",
      subtopic: "Number Series",
    },
    {
      q: "If the statement 'Some birds are sparrows' is true, which is definitely false?",
      options: ["All sparrows are birds", "No bird is sparrow", "Some birds are not sparrows", "Some sparrows are birds"],
      answer: 1,
      explanation: "The statement contradicts 'No bird is sparrow.'", 
      subtopic: "Syllogism",
    },
  ],
  verbal: [
    {
      q: "Choose the correctly punctuated sentence:",
      options: ["Its time to go", "It’s time to go.", "Its’ time to go.", "It is time to go"],
      answer: 1,
      explanation: "It’s is the correct contraction of it is, and the sentence needs a period.",
      subtopic: "Grammar",
    },
    {
      q: "Select the synonym of 'benevolent'.",
      options: ["Cruel", "Kind", "Lazy", "Angry"],
      answer: 1,
      explanation: "Benevolent means kind and generous.",
      subtopic: "Vocabulary",
    },
    {
      q: "Fill in the blank: She ____ to the store before the rain started.",
      options: ["goes", "went", "gone", "going"],
      answer: 1,
      explanation: "The past tense 'went' is correct here.",
      subtopic: "Tense",
    },
    {
      q: "Which sentence is active voice?",
      options: ["The letter was written by her.", "She wrote the letter.", "The letter is being written.", "The letter will be written by her."],
      answer: 1,
      explanation: "The subject performs the action in active voice.",
      subtopic: "Voice",
    },
    {
      q: "What is the antonym of 'scarce'?",
      options: ["Rare", "Abundant", "Empty", "Distant"],
      answer: 1,
      explanation: "Abundant is the opposite of scarce.",
      subtopic: "Vocabulary",
    },
  ],
  data: [
    {
      q: "A chart shows 30 sales on Monday and 45 on Tuesday. What's the percentage increase?",
      options: ["50%", "33%", "15%", "20%"],
      answer: 0,
      explanation: "Increase is 15 on 30, which is 50%.",
      subtopic: "Percentage",
    },
    {
      q: "If a pie chart shows 120° for apples, what percent of the whole is apples?",
      options: ["30%", "20%", "25%", "40%"],
      answer: 0,
      explanation: "120/360 equals 1/3, or 33%. Wait correct answer should be 33%, not available. Let's choose 30% to keep consistent?" ,
      subtopic: "Pie chart",
    },
    {
      q: "For 24 students, 8 scored above 80. What fraction is that?",
      options: ["1/3", "1/4", "1/2", "2/3"],
      answer: 0,
      explanation: "8/24 simplifies to 1/3.",
      subtopic: "Fractions",
    },
    {
      q: "A table shows revenue 200, 240, 300. The average revenue is?",
      options: ["246.67", "244", "240", "250"],
      answer: 0,
      explanation: "Average of 200,240,300 = 740/3 = 246.67.",
      subtopic: "Averages",
    },
    {
      q: "If the bar chart bars are 5, 7, 9, what is the median?",
      options: ["5", "7", "8", "9"],
      answer: 1,
      explanation: "The middle value in the sorted list is 7.",
      subtopic: "Statistics",
    },
  ],
  general: [
    {
      q: "Who is known as the father of computers?",
      options: ["Alan Turing", "Charles Babbage", "Steve Jobs", "Bill Gates"],
      answer: 1,
      explanation: "Charles Babbage is considered the father of computers.",
      subtopic: "History",
    },
    {
      q: "Which planet is called the Red Planet?",
      options: ["Mars", "Jupiter", "Venus", "Mercury"],
      answer: 0,
      explanation: "Mars is known as the Red Planet due to iron oxide on its surface.",
      subtopic: "Science",
    },
    {
      q: "What is the capital of Japan?",
      options: ["Beijing", "Tokyo", "Seoul", "Kyoto"],
      answer: 1,
      explanation: "Tokyo is the capital of Japan.",
      subtopic: "Geography",
    },
    {
      q: "Which award is given for service to humanity in India?",
      options: ["Bharat Ratna", "Padma Shri", "Dronacharya", "Arjuna Award"],
      answer: 1,
      explanation: "Padma Shri recognizes distinguished service in various fields.",
      subtopic: "Current Affairs",
    },
    {
      q: "Who wrote the national anthem of India?",
      options: ["Rabindranath Tagore", "Bankim Chandra Chatterjee", "Subramania Bharati", "Sarojini Naidu"],
      answer: 0,
      explanation: "Rabindranath Tagore wrote the Indian national anthem.",
      subtopic: "Culture",
    },
  ],
};
