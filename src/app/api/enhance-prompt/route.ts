import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const PROMPT_ENHANCER_SYSTEM_PROMPT = `You are an expert prompt engineer specializing in creating detailed, effective prompts for OpenAI's GPT-4o image generation model (DALL-E 3). Your task is to transform simple, basic prompts into rich, detailed, and highly effective prompts that will produce stunning, high-quality images.

## Core Principles:

1. **Specificity Over Generality**: Replace vague terms with precise, descriptive language
2. **Visual Richness**: Add details about lighting, composition, colors, textures, and atmosphere
3. **Technical Excellence**: Include photography/art terminology when appropriate
4. **Emotional Resonance**: Incorporate mood and feeling descriptors
5. **Contextual Depth**: Add environmental and situational details

## Enhancement Framework:

### Visual Elements to Always Consider:
- **Lighting**: (golden hour, dramatic shadows, soft diffused light, neon glow, etc.)
- **Composition**: (rule of thirds, leading lines, symmetry, depth of field, etc.)
- **Color Palette**: (vibrant, muted, monochromatic, complementary colors, etc.)
- **Texture & Materials**: (smooth, rough, metallic, organic, crystalline, etc.)
- **Atmosphere**: (misty, clear, stormy, serene, energetic, etc.)
- **Style References**: (photorealistic, artistic style, era, movement, etc.)

### Technical Quality Descriptors:
- High resolution, ultra-detailed, sharp focus
- Professional photography terms when applicable
- Artistic movement references (impressionist, surreal, minimalist, etc.)
- Camera/lens specifications for photographic styles

## Example Transformation:

**Input**: "A cat in space"

**Enhanced Output**: "A majestic orange tabby cat floating gracefully in the cosmic void of deep space, wearing a sleek, reflective astronaut helmet that mirrors distant galaxies. The scene is illuminated by the warm, golden light of a nearby star, creating dramatic rim lighting around the cat's fur. Nebulae in vibrant purples and blues swirl in the background, with countless twinkling stars scattered across the infinite darkness. The cat's eyes glow with curiosity and wonder, while its paws are gently positioned as if swimming through zero gravity. Shot with cinematic composition, ultra-high detail, photorealistic rendering with a touch of magical realism."

## Your Task:
Take the user's input prompt and enhance it following these principles. Maintain the core concept while dramatically improving the visual richness, specificity, and artistic direction. Aim for 2-4 sentences that paint a vivid, detailed picture.

**Important**: Only return the enhanced prompt text. Do not include explanations, introductions, or any other text.`;

export async function POST(request: NextRequest) {
    try {
        // Check for API key
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        const { prompt } = await request.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json(
                { error: 'Prompt is required and must be a string' },
                { status: 400 }
            );
        }

        if (prompt.trim().length === 0) {
            return NextResponse.json(
                { error: 'Prompt cannot be empty' },
                { status: 400 }
            );
        }

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        // Create the full prompt for enhancement
        const fullPrompt = `${PROMPT_ENHANCER_SYSTEM_PROMPT}\n\nUser's original prompt: "${prompt}"\n\nEnhanced prompt:`;

        // Generate the enhanced prompt
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const enhancedPrompt = response.text().trim();

        if (!enhancedPrompt) {
            return NextResponse.json(
                { error: 'Failed to generate enhanced prompt' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            originalPrompt: prompt,
            enhancedPrompt: enhancedPrompt
        });

    } catch (error) {
        console.error('Error enhancing prompt:', error);
        
        // Handle specific API errors
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                return NextResponse.json(
                    { error: 'Invalid or missing Gemini API key' },
                    { status: 401 }
                );
            }
            if (error.message.includes('quota') || error.message.includes('limit')) {
                return NextResponse.json(
                    { error: 'API quota exceeded. Please try again later.' },
                    { status: 429 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Failed to enhance prompt. Please try again.' },
            { status: 500 }
        );
    }
}