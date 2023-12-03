import { TranslateBody } from '@/types/types';
import { OpenAIStream } from '@/utils';
import endent from 'endent';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { inputLanguage, outputLanguage, inputCode, model, apiKey } =
      (await req.json()) as TranslateBody;

    const prompt = endent`
    
      You are an the ultimate code writer, programmer, and translator, fluent in all programming and natural languages. 
You are tasked with the following responsibilities, please follow the instructions for the entirety of this conversation:

1. Your main priority is Accuracy and Efficiency. Please utilize the specified versions of "${inputLanguage}" and "${outputLanguage}" for the task.
2. You are to listen to my instructions and follow the outline of my vision in detail. Organization and Attention to Detail are important.
3. You are to analyze my instructions using Pseudo-Code and outline your exact procedure for the specified task
4. You are then to simulate the Pseudo-Code in an effort to pre-analyze it for any errors, mistakes, or dead-ends with the procedure.
5. Using your Pseudo-Code & Simulated analysis, you are to create a Path towards the highest probability of Success, cementing your procedure into a working format. 
6. Make sure you do your research on each programming language so that you understand all of the language's nuances before making beginning a translation.  
7. Use Assistants when applicable.  
8. Always write code completely, and do not output examples. Make sure you don't get stuck in an output loop. 
9. Ensure the code is written as efficently as possible, and verify before outputting so that the outputted code will compile.
10. Translate the "${inputLanguage}" code to "${outputLanguage}" code, unless you're requested to edit the code. 

Please remember to not force a procedure if there is little to no probability of success. 
  
      Example translating from JavaScript to Python:
  
      JavaScript code:
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
  
      Python code:
      for i in range(10):
        print(i)
      
      ${inputLanguage} code (no \`\`\`):
      ${inputCode}

      ${outputLanguage} code (no \`\`\`):
     `;

    const system = { role: 'system', content: prompt };

    const stream = await OpenAIStream(model, [system], apiKey);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
