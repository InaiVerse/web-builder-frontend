import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx';
import backgroundImage from "@/Web-Builder/assets/background_img.png";
import { TbBrandSolidjs, TbBrandCpp } from "react-icons/tb";
import { VscFileCode } from "react-icons/vsc";
import { IoIosArrowBack } from "react-icons/io";
import { FaGolang, FaJava, FaLaravel, FaReact } from "react-icons/fa6";
import { FaHtml5, FaAngular, FaBrain } from 'react-icons/fa';
import { SiDotnet, SiNodedotjs, SiNextdotjs, SiSvelte, SiAstro, SiVuedotjs, SiPreact, SiPython, SiAndroidstudio, SiFlutter, SiGooglegemini, SiLangchain, SiMongodb, SiPostgresql, SiMysql, SiPrisma, SiFirebase, SiWorkplace, SiGooglemaps, SiGooglepay, SiRust, SiDart, SiRuby, SiPhp, SiGithub } from 'react-icons/si';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Web');
  const [activeMoreCategory, setActiveMoreCategory] = useState('Web');

  const moreTemplatesByCategory = {
    'Web': [
      { name: 'Vue.Js', icon: <SiVuedotjs className="text-4xl mt-2" />, description: 'Create a new Vue.js template with TS or JS and Vite' },
      { name: 'SolidJS', icon: <TbBrandSolidjs className="text-4xl mt-2" />, description: 'Simple and performant reactivity for building user interfaces' },
      { name: 'Preact', icon: <SiPreact className="text-4xl mt-2" />, description: 'Fast 3kB React alternative with the same modern API' },
      { name: 'React + Google Maps Platform', icon: <SiGooglemaps className="text-4xl mt-2" />, description: 'React template with Google Maps integration' },
      { name: 'Google Pay API For Web', icon: <SiGooglepay className="text-4xl mt-2" />, description: 'Integrate Google Pay into your web applications' }
    ],
    'Backend': [
      { name: 'Rust', icon: <SiRust className="text-4xl mt-2" />, description: 'Fast, unopinionated, minimalist web framework for Node.js' },
      { name: 'Dart', icon: <SiDart className="text-4xl mt-2" />, description: 'Modern, fast web framework for building APIs with Python' },
      { name: 'C++', icon: <TbBrandCpp className="text-4xl mt-2" />, description: 'Web framework for building APIs with Django' },
      { name: 'Rubby', icon: <SiRuby className="text-4xl mt-2" />, description: 'Java-based framework for enterprise applications' },
      { name: 'PHP', icon: <SiPhp className="text-4xl mt-2" />, description: 'Web application framework written in Ruby' },
      { name: 'Gemini API(Go Backend)', icon: <SiGooglegemini className="text-4xl mt-2" />, description: 'Java-based framework for enterprise applications' },
      { name: 'Gemini API(Python Backend)', icon: <SiGooglegemini className="text-4xl mt-2" />, description: 'Java-based framework for enterprise applications' }
    ],
    'Mobile': [],
    'AI & ML': [
      { name: 'Example Agents: Github Action', icon: <SiGithub className="text-4xl mt-2" />, description: 'Machine learning in JavaScript' },
      { name: 'Example Agents: VSCode Extention', icon: <VscFileCode className="text-4xl mt-2" />, description: 'Integrate OpenAI models in your applications' },
      { name: 'Gemini API Notebook', icon: <SiGooglegemini className="text-4xl mt-2" />, description: 'Pre-trained models for NLP and computer vision' },
      { name: 'Gemini API + Google Map Plateform', icon: <SiGooglemaps className="text-4xl mt-2" />, description: 'Friendly machine learning for the web' }
    ],
    'Database': [],
    'Misc': [
      { name: 'Firebase Data Connect', icon: <SiFirebase className="text-4xl mt-2" />, description: 'Container platform for application deployment' }
    ]
  };

  const categories = ['Web', 'Backend', 'Mobile', 'AI & ML', 'Database', 'Misc'];

  const templatesByCategory = {
    'Web': [
      { name: 'NextJS', icon: <SiNextdotjs className="text-2xl" />, description: 'The React Framework for Production' },
      { name: 'Simple HTML', icon: <FaHtml5 className="text-2xl" />, description: 'Basic HTML template with modern styling' },
      { name: 'Astro', icon: <SiAstro className="text-2xl" />, description: 'Build fast websites, powered by Astro' },
      { name: 'React', icon: <FaReact className="text-2xl" />, description: 'A JavaScript library for building UIs' },
      { name: 'Svelte', icon: <SiSvelte className="text-2xl" />, description: 'Cybernetically enhanced web apps' },
      { name: 'Angular', icon: <FaAngular className="text-2xl" />, description: 'Platform for building mobile & desktop apps' }
    ],

    'Backend': [
      { name: 'GO', icon: <FaGolang className="text-2xl" />, description: 'JavaScript runtime built on Chrome V8' },
      { name: 'Python Flask', icon: <SiPython className="text-2xl" />, description: 'Fast, unopinionated web framework' },
      { name: 'Java', icon: <FaJava className="text-2xl" />, description: 'The web framework for perfectionists' },
      { name: '.NET', icon: <SiDotnet className="text-2xl" />, description: 'Lightweight WSGI web application framework' },
      { name: 'Node Express', icon: <SiNodedotjs className="text-2xl" />, description: 'Ruby on Rails web application framework' },
      { name: 'Laravel', icon: <FaLaravel className="text-2xl" />, description: 'The PHP Framework for Web Artisans' },
      { name: 'Python Django', icon: <SiPython className="text-2xl" />, description: 'Fast, unopinionated web framework' },
      { name: 'Python ', icon: <SiPython className="text-2xl" />, description: 'Fast, unopinionated web framework' }
    ],

    'Mobile': [
      { name: 'Android Studio Cloud', icon: <SiAndroidstudio className="text-2xl" />, description: 'Build native mobile apps using React' },
      { name: 'Flutter', icon: <SiFlutter className="text-2xl" />, description: 'Google UI toolkit for beautiful apps' },
      { name: 'React Native + Expo', icon: <FaReact className="text-2xl" />, description: 'Powerful and intuitive programming language' },
      { name: 'React Native', icon: <FaReact className="text-2xl" />, description: 'Modern Android development' }
    ],

    'AI & ML': [
      { name: 'Gemini API', icon: <SiGooglegemini className="text-2xl" />, description: 'Open source machine learning framework' },
      { name: 'Genkit', icon: <FaBrain className="text-2xl" />, description: 'Tensors and dynamic neural networks' },
      { name: 'LangChain with Gemini', icon: <SiLangchain className="text-2xl" />, description: 'Machine learning in Python' }
    ],

    'Database': [

      { name: 'MongoDB', icon: <SiMongodb className="text-2xl" />, description: 'The most popular NoSQL database' },
      { name: 'PostgreSQL', icon: <SiPostgresql className="text-2xl" />, description: 'The world\'s most advanced open source database' },
      { name: 'MySQL(Experimental)', icon: <SiMysql className="text-2xl" />, description: 'The world\'s most popular open source database' },
      { name: 'Prisma', icon: <SiPrisma className="text-2xl" />, description: 'In-memory data structure store' },
      { name: 'Firebase Data Connect', icon: <SiFirebase className="text-2xl" />, description: 'Cloud-based NoSQL database' }
    ],

    'Misc': [
      { name: 'Emply Workspace', icon: <SiWorkplace className="text-2xl" />, description: 'Platform for developing and running apps' },
      { name: 'React  Google Maps Platform', icon: <SiGooglemaps className="text-2xl" />, description: 'Open-source container orchestration platform' },
      { name: 'Google Pay API for Web', icon: <SiGooglepay className="text-2xl" />, description: 'Distributed version control system' }
    ]
  };

  return (
    <div className="min-h-screen bg-white transition-colors">
      <div className="mx-8 md:mx-8 lg:mx-16 border-x border-black relative">

        <div className="border-b border-black relative">
          <Header />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-black"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-black"></div>
        </div>

        <div
          className="p-8 min-h-[88vh] "
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundColor:'#F1F5F9',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: 'auto'
          }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Dashboard content will go here */}
            <h1 
              className="text-2xl font-bold mb-6 flex items-center text-gray-900 cursor-pointer hover:text-gray-700" 
              onClick={() => navigate('/project-builder/input')}
            >
              <IoIosArrowBack /> Dashboard
            </h1>

            {/* Category buttons */}
            <div className="flex gap-[35px] mb-6 py-5 w-[100%]">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setActiveMoreCategory(category);
                  }}
                  className={`border shadow-[2px_2px_0px_0px_#333333] px-4 py-2 rounded-[4px] w-[120px] ${activeCategory === category
                    ? 'bg-[#333333] text-white border-[#FFFFFF]'
                    : 'bg-white text-black border-black hover:bg-gray-50'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Template cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templatesByCategory[activeCategory].map((template) => (
                <div
                  key={template.name}
                  className={`rounded-[10px] border shadow-[2px_2px_0px_0px_#333333] p-[16px] w-[280px] h-[150px] bg-white border-[#333333]`}
                >
                  <div className="flex items-center mb-2 ">
                    {template.icon}
                  </div>
                  <h3 className="font-semibold mb-2 text-gray-800">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>

            {/* More templates section */}
            {moreTemplatesByCategory[activeMoreCategory].length > 0 && (
              <div className="mt-8">

                <div className={`border shadow-[2px_2px_0px_0px_#333333] p-[16px] rounded-[10px] bg-white border-[#333333]`}>

                  <h2 className="text-[18px] mb-4 ml-10 text-[#333333]">More {activeMoreCategory} Templates</h2>

                  {moreTemplatesByCategory[activeMoreCategory].map((template, index) => (
                    <div key={index} className="rounded-[10px] border p-[16px] w-[90%] h-[80px] m-auto flex mb-4 border-[#333333] bg-white">
                      <div className="items-center">
                        {template.icon}
                      </div>
                      <div className='ml-2'>
                        <h3 className="font-semibold text-gray-800">{template.name}</h3>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                  ))}

                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;