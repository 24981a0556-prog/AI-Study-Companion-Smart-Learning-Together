import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  type: 'notes' | 'doubt' | 'mocktest';
  topic?: string;
  style?: string;
  question?: string;
  difficulty?: string;
  numQuestions?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, topic, style, question, difficulty, numQuestions } = await req.json() as RequestBody;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'notes':
        systemPrompt = `You are an expert educational content creator. Generate comprehensive, well-structured study notes based on the requested topic and style. Format your response in markdown with clear headings, bullet points, and key takeaways.`;
        userPrompt = `Generate ${style || 'detailed'} study notes on the topic: "${topic}". 
        
        ${style === 'revision' ? 'Focus on key points, formulas, and quick-reference content for last-minute revision.' : ''}
        ${style === 'detailed' ? 'Provide in-depth explanations, examples, and thorough coverage of the topic.' : ''}
        ${style === 'visual' ? 'Include descriptions for diagrams, use tables where appropriate, and organize content visually with clear hierarchies.' : ''}
        
        Include:
        - Key concepts and definitions
        - Important formulas or rules (if applicable)
        - Examples
        - Common mistakes to avoid
        - Quick tips for remembering`;
        break;

      case 'doubt':
        systemPrompt = `You are a patient and knowledgeable tutor. Explain concepts clearly with simple language and relatable examples. Break down complex ideas into digestible parts. Always encourage the student.`;
        userPrompt = `Student's question: "${question}"
        
        Please provide:
        1. A clear, simple explanation
        2. A practical example
        3. An analogy if helpful
        4. A quick summary`;
        break;

      case 'mocktest':
        systemPrompt = `You are an expert test creator. Generate educational multiple-choice questions that test understanding, not just memorization. Each question should have 4 options with exactly one correct answer.`;
        userPrompt = `Create ${numQuestions || 5} ${difficulty || 'medium'} difficulty multiple-choice questions on the topic: "${topic}".
        
        Return the response as a valid JSON array with this exact structure:
        [
          {
            "question": "Question text here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Brief explanation of why this is correct"
          }
        ]
        
        The correctAnswer should be the index (0-3) of the correct option.
        Only return the JSON array, no other text.`;
        break;

      default:
        throw new Error('Invalid request type');
    }

    console.log(`Processing ${type} request for topic: ${topic || question}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log(`Successfully generated ${type} response`);

    // For mock tests, parse and validate JSON
    if (type === 'mocktest') {
      try {
        const questions = JSON.parse(content);
        return new Response(
          JSON.stringify({ questions }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (parseError) {
        console.error('Failed to parse mock test JSON:', parseError);
        // Try to extract JSON from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const questions = JSON.parse(jsonMatch[0]);
          return new Response(
            JSON.stringify({ questions }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw new Error('Failed to generate valid test questions');
      }
    }

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Study function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});