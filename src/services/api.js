import {
  studentProfile,
  questionTopics,
  leaderboardTop10,
  recentActivity,
  readinessScore,
  readinessLabel,
  readinessSubtext,
  strongTopics,
  weakTopics,
  weeklyProgress,
  rankMovement,
  scheduledTests,
  topicCatalog,
  questionBank,
} from "../data/mockStudentData.js";

export async function loadStudentProfile() {
  return { profile: studentProfile, source: "mock", error: null };
}

export async function loadDashboardData() {
  return {
    readinessScore,
    readinessLabel,
    readinessSubtext,
    strongTopics,
    weakTopics,
    weeklyProgress,
    rankMovement,
    leaderboard: leaderboardTop10,
    activities: recentActivity,
    source: "mock",
    error: null,
  };
}

export async function loadQuestionTopics() {
  return { topics: questionTopics, source: "mock", error: null };
}

export async function loadLibraryTopics() {
  try {
    const response = await fetch("https://temp-backend-gbya.onrender.com/api/library/topics");
    const payload = await response.json();

    if (!payload || payload.success !== true || !Array.isArray(payload.data)) {
      throw new Error("Invalid response format");
    }

    const topics = payload.data.flatMap((item) => {
      if (Array.isArray(item.topics)) {
        return item.topics.map((topic) => ({
          ...topic,
          subject: item.label || item.subject || null,
        }));
      }

      if (item.id && item.label) {
        return [{
          ...item,
          subject: item.subject || null,
        }];
      }

      return [];
    });

    return { topics, source: "api", error: null };
  } catch (error) {
    return { topics: [], source: "api", error: error.message || "Failed to load topics" };
  }
}

export async function loadTopicDetails(topicId) {
  try {
    const topicsResult = await loadLibraryTopics();
    if (topicsResult.error) {
      return { topic: null, questions: [], source: "api", error: topicsResult.error };
    }

    const topic = topicsResult.topics.find((item) => item.id === topicId) || null;
    return { topic, questions: [], source: "api", error: topic ? null : "Topic not found" };
  } catch (error) {
    return { topic: null, questions: [], source: "api", error: error.message || "Failed to load topic details" };
  }
}

function normalizeQuestion(item) {
  const options = Array.isArray(item.options)
    ? item.options.map((option) => option.text ?? option)
    : [];

  const answerIndex = Array.isArray(item.options)
    ? item.options.findIndex((option) => {
        if (typeof option === "object") {
          return String(option.id).toUpperCase() === String(item.correctAnswer).toUpperCase();
        }
        return false;
      })
    : -1;

  return {
    id: item._id || item.questionId || null,
    type: item.type || "mcq",
    q: item.question || item.q || "",
    options,
    answer: answerIndex >= 0 ? answerIndex : Number.isInteger(item.answer) ? item.answer : 0,
    subtopic: item.subtopic || item.topic || "",
    language: item.language || null,
    code_lines: Array.isArray(item.code_lines) ? item.code_lines : [],
  };
}

export async function loadTopicQuestions(topicId, count) {
  try {
    const response = await fetch(
      `https://temp-backend-gbya.onrender.com/api/library/questions/random?topic=${encodeURIComponent(topicId)}&count=${encodeURIComponent(count)}`
    );
    const payload = await response.json();

    if (!payload || payload.success !== true || !Array.isArray(payload.data)) {
      throw new Error("Invalid response format");
    }

    const questions = payload.data.map(normalizeQuestion);
    return { questions, source: "api", error: null };
  } catch (error) {
    return { questions: [], source: "api", error: error.message || "Failed to load questions" };
  }
}

export async function loadScheduledTests() {
  return { scheduledTests, source: "mock", error: null };
}
