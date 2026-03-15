/**
 * AI Study Schedule Generator
 * Uses the Anthropic Claude API to generate personalized study plans.
 */

const ANTHROPIC_API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Generates a structured study schedule using Claude AI.
 *
 * @param {Object} params
 * @param {string} params.subjectName - Name of the subject
 * @param {string} params.examDate - ISO date string for exam
 * @param {number} params.dailyHours - Available study hours per day
 * @param {number} params.totalHoursRequired - Total hours needed to cover subject
 * @param {string} params.priority - 'low' | 'medium' | 'high'
 * @param {string[]} params.topics - List of topics to cover
 * @returns {Promise<{ tasks: Array, summary: string }>}
 */
export async function generateStudySchedule({
  subjectName,
  examDate,
  dailyHours,
  totalHoursRequired,
  priority,
  topics = [],
}) {
  const today = new Date().toISOString().split('T')[0];
  const daysUntilExam = Math.ceil(
    (new Date(examDate) - new Date(today)) / (1000 * 60 * 60 * 24)
  );

  const prompt = `You are an expert study planner. Generate a detailed daily study schedule for the following:

Subject: ${subjectName}
Today's Date: ${today}
Exam Date: ${examDate}
Days Until Exam: ${daysUntilExam}
Daily Study Hours Available: ${dailyHours} hours
Total Hours Required: ${totalHoursRequired} hours
Priority: ${priority}
Topics to Cover: ${topics.length > 0 ? topics.join(', ') : 'General subject content'}

Generate a JSON study schedule with this EXACT structure (return ONLY valid JSON, no markdown):
{
  "summary": "A 2-3 sentence overview of the study plan strategy",
  "tasks": [
    {
      "title": "Task title (specific and actionable)",
      "description": "What to study and how",
      "scheduled_date": "YYYY-MM-DD",
      "estimated_minutes": 60,
      "order_index": 0
    }
  ]
}

Rules:
- Start from ${today}, end 1 day before ${examDate}
- Create tasks only for weekdays unless the exam is very close (<7 days)
- Each task should be ${Math.round(dailyHours * 60)} minutes total, split into logical chunks
- Distribute topics evenly, with revision sessions in the last 20% of days
- Be specific: "Read Chapter 3: Linked Lists + Solve 5 practice problems" not just "Study"
- Maximum 3 tasks per day
- Include a final revision task 1-2 days before the exam
- Return at most 60 tasks total`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'AI API request failed');
    }

    const data = await response.json();
    const rawText = data.content[0]?.text || '{}';

    // Strip any accidental markdown fences
    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      tasks: parsed.tasks || [],
      summary: parsed.summary || 'Study plan generated successfully.',
    };
  } catch (error) {
    console.error('AI schedule generation failed:', error);

    // Graceful fallback: generate a basic schedule without AI
    return generateFallbackSchedule({
      subjectName,
      examDate,
      dailyHours,
      topics,
    });
  }
}

/**
 * Fallback schedule generator (no AI) used when API is unavailable.
 */
function generateFallbackSchedule({ subjectName, examDate, dailyHours, topics }) {
  const tasks = [];
  const today = new Date();
  const exam = new Date(examDate);
  const topicList = topics.length > 0 ? topics : [`Study ${subjectName}`];
  let topicIndex = 0;
  let orderIndex = 0;

  const current = new Date(today);
  while (current < exam && tasks.length < 40) {
    // Skip weekends unless exam is near
    const daysLeft = Math.ceil((exam - current) / (1000 * 60 * 60 * 24));
    if (daysLeft > 7 && (current.getDay() === 0 || current.getDay() === 6)) {
      current.setDate(current.getDate() + 1);
      continue;
    }

    const isLastTwo = daysLeft <= 2;
    const taskTitle = isLastTwo
      ? `Final Revision: ${subjectName}`
      : `Study: ${topicList[topicIndex % topicList.length]}`;

    tasks.push({
      title: taskTitle,
      description: isLastTwo
        ? 'Review all notes, practice past papers, focus on weak areas.'
        : `Cover topic in detail, take notes, and do practice questions.`,
      scheduled_date: current.toISOString().split('T')[0],
      estimated_minutes: Math.round(dailyHours * 60),
      order_index: orderIndex++,
    });

    if (!isLastTwo) topicIndex++;
    current.setDate(current.getDate() + 1);
  }

  return {
    tasks,
    summary: `A ${tasks.length}-session study plan for ${subjectName} has been created (AI unavailable — using fallback plan).`,
  };
}
