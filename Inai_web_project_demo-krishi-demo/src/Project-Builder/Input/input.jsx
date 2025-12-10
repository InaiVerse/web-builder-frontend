// import { useNavigate } from 'react-router-dom';
// import backgroundImage from "@/Web-Builder/assets/background_img.png";
// import { VscSparkle } from "react-icons/vsc";
// import { BiTargetLock } from "react-icons/bi";
// import { IoMdTrendingUp, IoMdAttach } from "react-icons/io";
// import { IoSendSharp } from "react-icons/io5";
// import Header from '@/project-Builder/Dashboard/Header';
// import useTypewriter from '../hooks/useTypewriter';
// import Cookies from "js-cookie";
// import { useState } from "react";

// export default function Input() {
//   const navigate = useNavigate();
//   const placeholderText = useTypewriter('Example: "Explain quantum computing in simple terms"');

//   const [prompt, setPrompt] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null); // File state

//   const triggerFileInput = () => {
//     document.getElementById("hiddenFileInput").click();
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) setSelectedFile(file);
//     console.log("Selected File:", file);
//   };

//   const handleEnhancePrompt = async () => {
//     if (!prompt.trim()) return;

//     const token = Cookies.get("access_token");
//     if (!token) {
//       console.log("No Token Found !");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/enhance-prompt`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       const data = await response.json();
//       console.log("Enhanced Prompt Response:", data);

//       const enhanced =
//         data.improved_prompt ||
//         data.enhanced_prompt ||
//         data.result?.improved_prompt ||
//         data.result?.enhanced_prompt ||
//         data.data?.improved_prompt ||
//         data.data?.enhanced_prompt;

//       if (enhanced) {
//         setPrompt(enhanced);
//       }
//     } catch (error) {
//       console.error("Error enhancing prompt:", error);
//     }

//     setLoading(false);
//   };


//   const handleSend = async () => {
//     if (!prompt.trim()) return;

//     const token = Cookies.get("access_token");
//     if (!token) {
//       console.log("No Token Found !");
//       return;
//     }

//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/generate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           prompt: prompt,
//           content: prompt, // you can modify later
//           tone: "professional",
//           detail_level: "comprehensive",
//         }),
//       });

//       const data = await response.json();
//       console.log("Chat Response:", data);

//       // Pass response result to next screen if needed
//       navigate("/project-builder/chat-editor", {
//         state: {
//           aiResponse: data,
//           inputPrompt: prompt,
//         },
//       });

//     } catch (error) {
//       console.error("Error sending prompt:", error);
//     }
//   };


//   return (
//     <div className="min-h-screen bg-white transition-colors">
//       <div className="mx-8 md:mx-8 lg:mx-16 border-x border-black relative">
//         <div
//           style={{
//             backgroundImage: `url(${backgroundImage})`,
//             backgroundSize: "cover",
//             backgroundColor: "#F1F5F9",
//             backgroundPosition: "center",
//             backgroundRepeat: "no-repeat",
//           }}
//         >
//           <div className="border-b border-black sticky top-0 z-10 bg-white">
//             <Header />
//           </div>

//           <div className="flex flex-col items-center justify-start min-h-[88vh] pt-20">

//             <h1 className="text-center text-gray-900 font-bold font-['Raleway'] text-[2.5em] leading-tight">
//               Meet your{" "}
//               <span className="px-3 py-1 bg-blue-50 border-2 border-blue-600 text-blue-600 rounded-md">
//                 AI teammate
//               </span>
//               <br /> for smarter work
//             </h1>

//             <div className="mt-12 w-[60%] bg-white rounded-2xl border border-black p-4 shadow-[3px_4px_0px_#000]">
//               <div className="flex items-center gap-3">
//                 <textarea
//                   value={prompt}
//                   onChange={(e) => {
//                     setPrompt(e.target.value);
//                     e.target.style.height = "auto";
//                     e.target.style.height = `${e.target.scrollHeight}px`;
//                   }}
//                   placeholder={placeholderText}
//                   className="flex-1 px-4 text-gray-700 placeholder-gray-400 text-[15px] min-h-[45px] max-h-[200px] resize-none overflow-auto focus:outline-none leading-relaxed"
//                   rows={1}
//                 />

//                 <button
//                   onClick={handleSend}
//                   className="cursor-pointer rounded-md border border-black w-10 h-10 flex items-center justify-center shadow-[2px_2px_0px_#000] hover:bg-gray-100 transition"
//                 >
//                   <IoSendSharp className="w-5 h-5 text-black" />
//                 </button>
//               </div>

//               {/* Show selected file */}
//               {selectedFile && (
//                 <p className="text-xs mt-2 text-gray-700">
//                   📄 {selectedFile.name}
//                 </p>
//               )}

//               <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">

//                 {/* Hidden File Input */}
//                 <input
//                   id="hiddenFileInput"
//                   type="file"
//                   onChange={handleFileSelect}
//                   className="hidden"
//                   accept=".pdf,.doc,.docx,.txt,.png,.jpg"
//                 />

//                 {/* Left Buttons */}
//                 <div className="flex gap-2">
//                   <button className="rounded-full cursor-pointer text-black border border-black w-9 h-9 flex items-center justify-center shadow-[2px_2px_0px_#000] text-lg font-medium hover:bg-gray-100">
//                     +
//                   </button>

//                   {/* Attach Button */}
//                   <button
//                     onClick={triggerFileInput}
//                     className="rounded-full cursor-pointer text-black border border-black px-3 py-2 flex items-center gap-2 min-w-[90px] text-sm shadow-[2px_2px_0px_#000] hover:bg-gray-100"
//                   >
//                     <IoMdAttach className="w-4 h-4 text-black" />
//                     Attach
//                   </button>

//                   {/* Enhance Button */}
//                   <div className="relative group">
//                     <button
//                       onClick={handleEnhancePrompt}
//                       className="rounded-full text-black cursor-pointer border border-black w-9 h-9 flex items-center justify-center shadow-[2px_2px_0px_#000] text-lg font-medium hover:bg-gray-100"
//                     >
//                       {loading ? (
//                         <div className="w-3 h-3 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
//                       ) : (
//                         <VscSparkle className="w-4 h-4 text-black" />
//                       )}
//                     </button>

//                     <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
//                       Improve prompt
//                     </span>
//                   </div>
//                 </div>

//                 {/* Right Button */}
//                 <button
//                   onClick={() => navigate('/project-builder/dashboard')}
//                   className="border cursor-pointer border-black bg-black text-white px-3 py-2 flex items-center gap-2 h-9 shadow-[2px_2px_0px_#000] hover:bg-[#1a1a1a] transition"
//                 >
//                   <IoMdAttach className="w-4 h-4" />
//                   Coding apps
//                 </button>
//               </div>
//             </div>

//             {/* Feature Section */}
//             <div className="grid grid-cols-3 gap-8 text-center mt-10">
//               <div>
//                 <VscSparkle className="w-7 h-7 text-black mx-auto mb-2" />
//                 <h3 className="font-semibold text-gray-900 text-sm">Clear and precise</h3>
//                 <p className="text-xs text-gray-600">Periatur sint laborum cillum aute consectetur iure.</p>
//               </div>

//               <div>
//                 <BiTargetLock className="w-7 h-7 text-black mx-auto mb-2" />
//                 <h3 className="font-semibold text-gray-900 text-sm">Personalized answers</h3>
//                 <p className="text-xs text-gray-600">Pariatur sint laborum cillum aute consectetur irure.</p>
//               </div>

//               <div>
//                 <IoMdTrendingUp className="w-7 h-7 text-black mx-auto mb-2" />
//                 <h3 className="font-semibold text-gray-900 text-sm">Increased efficiency</h3>
//                 <p className="text-xs text-gray-600">Pariatur sint laborum cillum aute consectetur irure.</p>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





























// import { useNavigate } from 'react-router-dom';
// import backgroundImage from "@/Web-Builder/assets/background_img.png";
// import { VscSparkle } from "react-icons/vsc";
// import { BiTargetLock } from "react-icons/bi";
// import { IoMdTrendingUp, IoMdAttach } from "react-icons/io";
// import { IoSendSharp } from "react-icons/io5";
// import Header from '@/project-Builder/Dashboard/Header';
// import useTypewriter from '../hooks/useTypewriter';
// import Cookies from "js-cookie";
// import { useState } from "react";

// export default function Input() {
//   const navigate = useNavigate();
//   const placeholderText = useTypewriter('Example: "Explain quantum computing in simple terms"');

//   const [prompt, setPrompt] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [sending, setSending] = useState(false); // 👈 NEW

//   const handleAttachClick = () => {
//     document.getElementById("hiddenFileInput").click();
//   };

//   const handleFileSelect = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     setSelectedFile(file);

//     const token = Cookies.get("access_token");
//     if (!token) {
//       console.log("No Token Found!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/ai/upload-document`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         }
//       );

//       const result = await response.json();
//       console.log("Upload Response:", result);

//       const extracted =
//         result?.extracted_text ||
//         result?.content ||
//         result?.text ||
//         result?.data?.extracted_text;

//       if (extracted) {
//         setPrompt(extracted);
//       }

//     } catch (err) {
//       console.error("Upload Error:", err);
//     }

//     setUploading(false);
//   };

//   const handleEnhancePrompt = async () => {
//     if (!prompt.trim()) return;

//     const token = Cookies.get("access_token");
//     if (!token) {
//       console.log("No Token Found !");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/enhance-prompt`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       const data = await response.json();
//       console.log("Enhanced Prompt Response:", data);

//       const enhanced =
//         data.improved_prompt ||
//         data.enhanced_prompt ||
//         data.result?.improved_prompt ||
//         data.result?.enhanced_prompt ||
//         data.data?.improved_prompt ||
//         data.data?.enhanced_prompt;

//       if (enhanced) {
//         setPrompt(enhanced);
//       }
//     } catch (error) {
//       console.error("Error enhancing prompt:", error);
//     }

//     setLoading(false);
//   };

//   const handleSend = async () => {
//     if (!prompt.trim() || sending) return;

//     const token = Cookies.get("access_token");
//     if (!token) {
//       console.log("No Token Found !");
//       return;
//     }

//     setSending(true); // 👈 Start loader

//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/generate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           prompt,
//           content: prompt,
//           tone: "professional",
//           detail_level: "comprehensive",
//         }),
//       });

//       const data = await response.json();
//       console.log("Chat Response:", data);

//       navigate("/project-builder/chat-editor", {
//         state: {
//           aiResponse: data,
//           inputPrompt: prompt,
//         },
//       });
//     } catch (error) {
//       console.error("Error sending prompt:", error);
//     }

//     setSending(false); // 👈 Stop loader
//   };

//   return (
//     <div className="min-h-screen bg-white transition-colors">
//       <div className="mx-8 md:mx-8 lg:mx-16 border-x border-black relative">
//         <div
//           style={{
//             backgroundImage: `url(${backgroundImage})`,
//             backgroundSize: "cover",
//             backgroundColor: "#F1F5F9",
//             backgroundPosition: "center",
//             backgroundRepeat: "no-repeat",
//           }}
//         >
//           <div className="border-b border-black sticky top-0 z-10 bg-white">
//             <Header />
//           </div>

//           <div className="flex flex-col items-center justify-start min-h-[88vh] pt-20">
//             <h1 className="text-center text-gray-900 font-bold font-['Raleway'] text-[2.5em] leading-tight">
//               Meet your{" "}
//               <span className="px-3 py-1 bg-blue-50 border-2 border-blue-600 text-blue-600 rounded-md">
//                 AI teammate
//               </span>
//               <br /> for smarter work
//             </h1>

//             <div className="mt-12 w-[60%] bg-white rounded-2xl border border-black p-4 shadow-[3px_4px_0px_#000]">
//               <div className="flex items-center gap-3">
//                 <textarea
//                   value={prompt}
//                   onChange={(e) => {
//                     setPrompt(e.target.value);
//                     e.target.style.height = "auto";
//                     e.target.style.height = `${e.target.scrollHeight}px`;
//                   }}
//                   placeholder={placeholderText}
//                   className="flex-1 px-4 text-gray-700 placeholder-gray-400 text-[15px] min-h-[45px] max-h-[200px] resize-none overflow-auto focus:outline-none leading-relaxed"
//                   rows={1}
//                 />

//                 {/* 👇 Updated Send Button with Loader */}
//                 <button
//                   onClick={handleSend}
//                   disabled={sending}
//                   className={`cursor-pointer rounded-md border border-black w-10 h-10 flex items-center justify-center
//                     shadow-[2px_2px_0px_#000] transition
//                     ${sending ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}`}
//                 >
//                   {sending ? (
//                     <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
//                   ) : (
//                     <IoSendSharp className="w-5 h-5 text-black" />
//                   )}
//                 </button>
//               </div>

//               {selectedFile && (
//                 <p className="text-xs mt-2 text-gray-700">
//                   📄 {selectedFile.name} {uploading ? "(Uploading...)" : "(Uploaded ✔)"}
//                 </p>
//               )}

//               <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
//                 <input
//                   id="hiddenFileInput"
//                   type="file"
//                   onChange={handleFileSelect}
//                   className="hidden"
//                   accept=".pdf,.doc,.docx,.txt,.png,.jpg"
//                 />

//                 <div className="flex gap-2">
//                   <button className="rounded-full cursor-pointer text-black border border-black w-9 h-9 flex items-center justify-center shadow-[2px_2px_0px_#000] text-lg font-medium hover:bg-gray-100">
//                     +
//                   </button>

//                   <button
//                     onClick={handleAttachClick}
//                     className="rounded-full cursor-pointer text-black border border-black px-3 py-2 flex items-center gap-2 min-w-[90px] text-sm shadow-[2px_2px_0px_#000] hover:bg-gray-100"
//                   >
//                     <IoMdAttach className="w-4 h-4 text-black" />
//                     {uploading ? "Uploading..." : "Attach"}
//                   </button>

//                   <div className="relative group">
//                     <button
//                       onClick={handleEnhancePrompt}
//                       className="rounded-full text-black cursor-pointer border border-black w-9 h-9 flex items-center justify-center shadow-[2px_2px_0px_#000] text-lg font-medium hover:bg-gray-100"
//                     >
//                       {loading ? (
//                         <div className="w-3 h-3 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
//                       ) : (
//                         <VscSparkle className="w-4 h-4 text-black" />
//                       )}
//                     </button>
//                     <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
//                       Improve prompt
//                     </span>
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => navigate('/project-builder/dashboard')}
//                   className="border cursor-pointer border-black bg-black text-white px-3 py-2 flex items-center gap-2 h-9 shadow-[2px_2px_0px_#000] hover:bg-[#1a1a1a] transition"
//                 >
//                   <IoMdAttach className="w-4 h-4" />
//                   Coding apps
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-8 text-center mt-10">
//               <div>
//                 <VscSparkle className="w-7 h-7 text-black mx-auto mb-2" />
//                 <h3 className="font-semibold text-gray-900 text-sm">Clear and precise</h3>
//                 <p className="text-xs text-gray-600">Periatur sint laborum cillum aute consectetur iure.</p>
//               </div>

//               <div>
//                 <BiTargetLock className="w-7 h-7 text-black mx-auto mb-2" />
//                 <h3 className="font-semibold text-gray-900 text-sm">Personalized answers</h3>
//                 <p className="text-xs text-gray-600">Pariatur sint laborum cillum aute consectetur irure.</p>
//               </div>

//               <div>
//                 <IoMdTrendingUp className="w-7 h-7 text-black mx-auto mb-2" />
//                 <h3 className="font-semibold text-gray-900 text-sm">Increased efficiency</h3>
//                 <p className="text-xs text-gray-600">Pariatur sint laborum cillum aute consectetur irure.</p>
//               </div>

//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










import { useNavigate } from 'react-router-dom';
import backgroundImage from "@/Web-Builder/assets/background_img.png";
import { VscSparkle } from "react-icons/vsc";
import { BiTargetLock } from "react-icons/bi";
import { IoMdTrendingUp, IoMdAttach } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import Header from '../../Project-Builder/Dashboard/Header';
import useTypewriter from "../Hooks/useTypewriter";
import Cookies from "js-cookie";
import { useState } from "react";

export default function Input() {
  const navigate = useNavigate();
  const placeholderText = useTypewriter('Example: "Explain quantum computing in simple terms"');

  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState(""); // 👈 Extracted content from document
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sending, setSending] = useState(false);

  const handleAttachClick = () => {
    document.getElementById("hiddenFileInput").click();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setSelectedFile(file);

    const token = Cookies.get("access_token");
    if (!token) {
      console.log("No Token Found!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/upload-document`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      console.log("Upload Response:", result);

      const extracted =
        result?.extracted_text ||
        result?.content ||
        result?.text ||
        result?.data?.extracted_text;

      if (extracted) {
        setContent(extracted); // 👈 Store exact extracted text
      }

    } catch (err) {
      console.error("Upload Error:", err);
    }

    setUploading(false);
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;

    const token = Cookies.get("access_token");
    if (!token) {
      console.log("No Token Found!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/enhance-prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log("Enhanced Prompt Response:", data);

      const enhanced =
        data.improved_prompt ||
        data.enhanced_prompt ||
        data.result?.improved_prompt ||
        data.result?.enhanced_prompt ||
        data.data?.improved_prompt ||
        data.data?.enhanced_prompt;

      if (enhanced) {
        setPrompt(enhanced);
      }
    } catch (error) {
      console.error("Error enhancing prompt:", error);
    }

    setLoading(false);
  };

  const handleSend = async () => {
  if ((!prompt.trim() && !content.trim()) || sending) return; // 👈 FIXED

  const token = Cookies.get("access_token");
  if (!token) {
    console.log("No Token Found!");
    return;
  }

  setSending(true);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt: prompt || "Generate blueprint from document", // 👈 fallback
        content: content,
        tone: "professional",
        detail_level: "comprehensive",
      }),
    });

    const data = await response.json();
    console.log("Chat Response:", data);

    navigate("/project-builder/chat-editor", {
      state: {
        aiResponse: data,
        inputPrompt: prompt || "Generated from uploaded document",
        uploadedContent: content,
      },
    });
  } catch (error) {
    console.error("Error sending prompt:", error);
  }

  setSending(false);
};


  return (
    <div className="min-h-screen bg-white transition-colors">
      <div className="mx-8 md:mx-8 lg:mx-16 border-x border-black relative">
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundColor: "#F1F5F9",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="border-b border-black sticky top-0 z-10 bg-white">
            <Header />
          </div>

          <div className="flex flex-col items-center justify-start min-h-[88vh] pt-20">
            <h1 className="text-center text-gray-900 font-bold font-['Raleway'] text-[2.5em] leading-tight">
              Meet your{" "}
              <span className="px-3 py-1 bg-blue-50 border-2 border-blue-600 text-blue-600 rounded-md">
                AI teammate
              </span>
              <br /> for smarter work
            </h1>

            <div className="mt-12 w-[60%] bg-white rounded-2xl border border-black p-4 shadow-[3px_4px_0px_#000]">
              <div className="flex items-center gap-3">
                <textarea
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  placeholder={placeholderText}
                  className="flex-1 px-4 text-gray-700 placeholder-gray-400 text-[15px] min-h-[45px] max-h-[200px] resize-none overflow-auto focus:outline-none leading-relaxed"
                  rows={1}
                />

                <button
                  onClick={handleSend}
                  disabled={sending}
                  className={`cursor-pointer rounded-md border border-black w-10 h-10 flex items-center justify-center
                    shadow-[2px_2px_0px_#000] transition
                    ${sending ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"}`}
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    <IoSendSharp className="w-5 h-5 text-black" />
                  )}
                </button>
              </div>

              {selectedFile && (
                <p className="text-xs mt-2 text-gray-700">
                  📄 {selectedFile.name} {uploading ? "(Uploading...)" : "(Uploaded ✔)"}
                </p>
              )}

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                <input
                  id="hiddenFileInput"
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg"
                />

                <div className="flex gap-2">
                  <button className="rounded-full cursor-pointer text-black border border-black w-9 h-9 flex items-center justify-center shadow-[2px_2px_0px_#000] text-lg font-medium hover:bg-gray-100">
                    +
                  </button>

                  <button
                    onClick={handleAttachClick}
                    className="rounded-full cursor-pointer text-black border border-black px-3 py-2 flex items-center gap-2 min-w-[90px] text-sm shadow-[2px_2px_0px_#000] hover:bg-gray-100"
                  >
                    <IoMdAttach className="w-4 h-4 text-black" />
                    {uploading ? "Uploading..." : "Attach"}
                  </button>

                  <div className="relative group">
                    <button
                      onClick={handleEnhancePrompt}
                      className="rounded-full text-black cursor-pointer border border-black w-9 h-9 flex items-center justify-center shadow-[2px_2px_0px_#000] text-lg font-medium hover:bg-gray-100"
                    >
                      {loading ? (
                        <div className="w-3 h-3 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
                      ) : (
                        <VscSparkle className="w-4 h-4 text-black" />
                      )}
                    </button>
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
                      Improve prompt
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/project-builder/dashboard')}
                  className="border cursor-pointer border-black bg-black text-white px-3 py-2 flex items-center gap-2 h-9 shadow-[2px_2px_0px_#000] hover:bg-[#1a1a1a] transition"
                >
                  <IoMdAttach className="w-4 h-4" />
                  Coding apps
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 text-center mt-10">
              <div>
                <VscSparkle className="w-7 h-7 text-black mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Clear and precise</h3>
                <p className="text-xs text-gray-600">Periatur sint laborum cillum aute consectetur iure.</p>
              </div>

              <div>
                <BiTargetLock className="w-7 h-7 text-black mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Personalized answers</h3>
                <p className="text-xs text-gray-600">Pariatur sint laborum cillum aute consectetur irure.</p>
              </div>

              <div>
                <IoMdTrendingUp className="w-7 h-7 text-black mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 text-sm">Increased efficiency</h3>
                <p className="text-xs text-gray-600">Pariatur sint laborum cillum aute consectetur irure.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
