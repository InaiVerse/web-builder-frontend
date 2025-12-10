export const initialPages = [
  {
    id: "home",
    filename: "index.html",
    label: "Home",
    body: `
<div class="w-screen h-screen bg-[#1C1C1C] flex flex-col items-center justify-center font-sans gap-6">

  <!-- Loading Spinner -->
  <div>
    <div class="w-10 h-10 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
  </div>

  <!-- Centered Info Card -->
  <div class="bg-[#242424] text-white px-6 py-4 rounded-xl shadow-lg border border-white/10 flex items-center gap-4">
    <div>
      <h3 class="font-semibold text-lg">Code Editor With Live Preview — Figma Design Reference</h3>
      <p class="text-sm text-gray-400">Interactive artifact</p>
    </div>
    <div class="text-gray-300 text-2xl">💻</div>
  </div>

</div>
`,
  },
];



export const initialHtml = initialPages[0]?.body ?? '';

export const initialCss = `/* Custom styles can go here */`;

export const initialJs = `console.log("Welcome to your Next Inai project!");`;

export const initialMessages = [
  {
    role: 'assistant',
    content: "Hi, I'm Next Inai. Describe the experience you want—playful micro-interactions or premium motion?",
  },
];
