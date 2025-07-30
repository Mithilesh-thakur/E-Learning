import React, { useState } from 'react';
import { Menu, X, Play, ChevronRight, Star } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ThreeScene from './ThreeScene';

const HeroSection = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <ThreeScene />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 z-10" />

      <div className="relative z-20 min-h-screen">
        {/* Hero */}
        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-6 lg:px-12">
          <div className="text-center max-w-4xl">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full text-purple-300 text-sm border border-purple-500/30">
                <Star className="w-4 h-4 mr-2" /> E-Learning Platform
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find the <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Best Courses</span>
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover, Learn, and Upskill with our wide range of courses            </p>

            {/* ✅ Search Bar Added Here */}
            <form
              onSubmit={searchHandler}
              className="flex items-center bg-white/10 backdrop-blur-md rounded-full overflow-hidden max-w-2xl mx-auto mb-6 shadow-lg"
            >
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Courses"
                className="flex-grow border-none focus-visible:ring-0 px-6 py-4 text-white placeholder-white bg-transparent"
              />
              <Button
                type="submit"
                className="bg-purple-700 text-white px-6 py-4 rounded-r-full hover:bg-purple-600 transition-all duration-300"
              >
                Search
              </Button>
            </form>

            {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Get Started
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 hover:border-white/30 transition-all duration-300">
                Learn More <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div> */}
          </div>
        </div>

        {/* Cards */}
        <div className="px-6 lg:px-12 pb-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
             {
    title: 'Masterclass Lectures',
    color: 'from-blue-500 to-cyan-500',
    shape: 'rounded',
    desc: 'High-quality recorded lectures by industry experts, structured to help you master each topic step-by-step.',
  },
  {
    title: 'Interactive Course Modules',
    color: 'from-purple-500 to-pink-500',
    shape: 'rounded-full',
    desc: 'Immersive learning modules with quizzes, hands-on exercises, and interactive lessons for deep understanding.',
  },
  {
    title: 'Video-Based Tutorials',
    color: 'from-green-500 to-emerald-500',
    shape: 'rotate-45 rounded-lg',
    desc: 'Engaging video tutorials designed to make complex concepts simple through visual storytelling.',
  },
  {
    title: 'Live Classes & Recordings',
    color: 'from-yellow-500 to-orange-500',
    shape: 'rounded-lg rotate-6',
    desc: 'Attend live sessions or watch the recordings anytime to stay updated and learn at your own pace.',
  },
  {
    title: 'Personalized Learning Paths',
    color: 'from-indigo-500 to-blue-700',
    shape: 'rounded-xl scale-105',
    desc: 'Customized course journeys based on your skills, goals, and progress tracking.',
  },
  {
    title: 'Certification Courses',
    color: 'from-red-500 to-rose-600',
    shape: 'skew-y-3 rounded-md',
    desc: 'Get certified with structured assessments and industry-recognized credentials.',
  },
            ].map((card, idx) => (
              <div
                key={idx}
                className="group p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <div className={`w-6 h-6 bg-white ${card.shape}`}></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{card.title}</h3>
                <p className="text-white/70 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
