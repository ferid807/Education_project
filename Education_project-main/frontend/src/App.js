import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { GraduationCap, MessageCircle, Search, BarChart3, Users, Target, BookOpen, Globe, Award, TrendingUp } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Landing Page Component
const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                StudyPath
              </h1>
            </div>
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-700 to-emerald-700 bg-clip-text text-transparent leading-tight">
            Your AI Career Mentor
          </h2>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Find the Best Path for Your Future with personalized AI-powered guidance for university applications, scholarships, and career planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-slate-800 mb-4">Powerful Features for Your Success</h3>
          <p className="text-lg text-slate-600">Everything you need to plan your academic and career future</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <MessageCircle className="h-8 w-8" />,
              title: "AI Career Advisor",
              description: "Get personalized advice and guidance from our intelligent chatbot assistant."
            },
            {
              icon: <Search className="h-8 w-8" />,
              title: "University Finder",
              description: "Discover the best universities and programs matched to your profile and goals."
            },
            {
              icon: <Award className="h-8 w-8" />,
              title: "Scholarship Opportunities",
              description: "Find scholarships and funding opportunities tailored to your background."
            },
            {
              icon: <BarChart3 className="h-8 w-8" />,
              title: "Success Analytics",
              description: "View your acceptance probabilities and track your application progress."
            },
            {
              icon: <Globe className="h-8 w-8" />,
              title: "Global Opportunities",
              description: "Explore study abroad options across multiple countries and regions."
            },
            {
              icon: <Target className="h-8 w-8" />,
              title: "Goal Planning",
              description: "Set and track your academic and career milestones with AI guidance."
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="bg-gradient-to-r from-blue-100 to-emerald-100 p-3 rounded-xl w-fit mb-4">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-slate-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Future?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have successfully planned their academic journey with StudyPath.
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
          >
            Get Free Advice Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-xl">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold">StudyPath</h4>
            </div>
            <p className="text-slate-400">Your AI Career Mentor - Empowering students worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Student Dashboard Component
const StudentDashboard = ({ studentProfile, onUpdateProfile }) => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (studentProfile) {
      loadChatHistory();
      loadRecommendations();
      loadUniversities();
      loadScholarships();
    }
  }, [studentProfile]);

  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${API}/chat/${studentProfile.id}`);
      setChatHistory(response.data.slice(0, 10)); // Show last 10 messages
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await axios.post(`${API}/recommendations/${studentProfile.id}`);
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    }
  };

  const loadUniversities = async () => {
    try {
      const response = await axios.get(`${API}/universities`);
      setUniversities(response.data.slice(0, 6));
    } catch (error) {
      console.error("Error loading universities:", error);
    }
  };

  const loadScholarships = async () => {
    try {
      const response = await axios.get(`${API}/scholarships`);
      setScholarships(response.data.slice(0, 4));
    } catch (error) {
      console.error("Error loading scholarships:", error);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API}/chat`, {
        student_id: studentProfile.id,
        message: chatMessage
      });
      
      setChatHistory(prev => [response.data, ...prev]);
      setChatMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setLoading(false);
  };

  const profileCompleteness = () => {
    const fields = [
      studentProfile.name,
      studentProfile.university,
      studentProfile.faculty,
      studentProfile.gpa,
      studentProfile.achievements?.length > 0,
      studentProfile.extracurriculars?.length > 0,
      studentProfile.preferred_countries?.length > 0,
      studentProfile.career_goals
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  StudyPath
                </h1>
                <p className="text-sm text-slate-600">Welcome back, {studentProfile.name}</p>
              </div>
            </div>
            <Button 
              onClick={onUpdateProfile}
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Profile Overview */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-1 bg-white/70 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Profile Strength</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Completeness</span>
                    <span className="font-semibold text-slate-800">{profileCompleteness()}%</span>
                  </div>
                  <Progress value={profileCompleteness()} className="h-3" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">GPA</span>
                    <Badge variant={studentProfile.gpa >= 3.5 ? "default" : "secondary"}>
                      {studentProfile.gpa}/4.0
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Progress</span>
                    <span className="text-sm font-semibold">
                      {studentProfile.completed_credits}/{studentProfile.total_credits} credits
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="lg:col-span-3 grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Universities</p>
                    <p className="text-2xl font-bold">{universities.length}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100">Scholarships</p>
                    <p className="text-2xl font-bold">{scholarships.length}</p>
                  </div>
                  <Award className="h-8 w-8 text-emerald-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Success Rate</p>
                    <p className="text-2xl font-bold">
                      {recommendations?.acceptance_probabilities ? 
                        Math.round(Object.values(recommendations.acceptance_probabilities).reduce((a, b) => a + b, 0) / Object.values(recommendations.acceptance_probabilities).length) : '...'
                      }%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/70 backdrop-blur-sm border border-slate-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              AI Advisor
            </TabsTrigger>
            <TabsTrigger value="universities" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Universities
            </TabsTrigger>
            <TabsTrigger value="scholarships" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Scholarships
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {recommendations && (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <BarChart3 className="h-5 w-5" />
                    Your Acceptance Probabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(recommendations.acceptance_probabilities).map(([university, probability]) => (
                      <div key={university} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-700 font-medium">{university}</span>
                          <span className="text-slate-600">{probability}%</span>
                        </div>
                        <Progress value={probability} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {recommendations && (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Target className="h-5 w-5" />
                    Recommended Improvements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.suggested_improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-600 rounded-full p-1 mt-0.5">
                          <div className="w-2 h-2 bg-current rounded-full"></div>
                        </div>
                        <span className="text-slate-700">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <MessageCircle className="h-5 w-5" />
                  AI Career Advisor
                </CardTitle>
                <CardDescription>
                  Ask me anything about your career plans, applications, or study abroad opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat Messages */}
                  <div className="h-96 overflow-y-auto space-y-4 p-4 bg-slate-50 rounded-lg border">
                    {chatHistory.length === 0 ? (
                      <div className="text-center text-slate-500 py-8">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <p>Start a conversation with your AI advisor!</p>
                      </div>
                    ) : (
                      chatHistory.map((message, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex justify-end">
                            <div className="bg-blue-600 text-white p-3 rounded-lg max-w-md">
                              {message.message}
                            </div>
                          </div>
                          <div className="flex justify-start">
                            <div className="bg-white p-3 rounded-lg max-w-md border shadow-sm">
                              {message.response}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask about universities, scholarships, or career advice..."
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendChatMessage} 
                      disabled={loading || !chatMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? "..." : "Send"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Universities Tab */}
          <TabsContent value="universities" className="space-y-6">
            {universities.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">Loading universities...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {universities.map((university) => (
                  <Card key={university.id} className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-slate-800">{university.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {university.country}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Ranking</span>
                          <Badge variant="outline">#{university.ranking}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Acceptance Rate</span>
                          <span className="text-sm font-semibold">{Math.round(university.acceptance_rate * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Tuition</span>
                          <span className="text-sm font-semibold">
                            {university.tuition_fee === 0 ? "Free" : `$${university.tuition_fee.toLocaleString()}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-slate-600 block mb-1">Programs</span>
                          <div className="flex flex-wrap gap-1">
                            {university.programs.slice(0, 3).map((program, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {program}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Scholarships Tab */}
          <TabsContent value="scholarships" className="space-y-6">
            {scholarships.length === 0 ? (
              <div className="text-center py-8">
                <Award className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">Loading scholarships...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {scholarships.map((scholarship) => (
                  <Card key={scholarship.id} className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-slate-800">{scholarship.name}</CardTitle>
                      <CardDescription>{scholarship.provider}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Amount</span>
                          <span className="text-lg font-bold text-emerald-600">
                            ${scholarship.amount.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-slate-600 block mb-1">Countries</span>
                          <div className="flex flex-wrap gap-1">
                            {scholarship.countries.map((country, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {country}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-slate-600 block mb-1">Deadline</span>
                          <span className="text-sm font-semibold text-red-600">{scholarship.deadline}</span>
                        </div>
                        <p className="text-sm text-slate-700">{scholarship.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Profile Setup Component
const ProfileSetup = ({ onProfileCreated, initialProfile = null }) => {
  const [formData, setFormData] = useState({
    name: initialProfile?.name || "",
    email: initialProfile?.email || "",
    university: initialProfile?.university || "",
    faculty: initialProfile?.faculty || "",
    gpa: initialProfile?.gpa || "",
    total_credits: initialProfile?.total_credits || "",
    completed_credits: initialProfile?.completed_credits || "",
    achievements: initialProfile?.achievements?.join(", ") || "",
    extracurriculars: initialProfile?.extracurriculars?.join(", ") || "",
    preferred_countries: initialProfile?.preferred_countries?.join(", ") || "",
    financial_situation: initialProfile?.financial_situation || "",
    career_goals: initialProfile?.career_goals || ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const profileData = {
        ...formData,
        gpa: parseFloat(formData.gpa),
        total_credits: parseInt(formData.total_credits),
        completed_credits: parseInt(formData.completed_credits),
        achievements: formData.achievements.split(",").map(s => s.trim()).filter(Boolean),
        extracurriculars: formData.extracurriculars.split(",").map(s => s.trim()).filter(Boolean),
        preferred_countries: formData.preferred_countries.split(",").map(s => s.trim()).filter(Boolean)
      };

      let response;
      if (initialProfile) {
        response = await axios.put(`${API}/students/${initialProfile.id}`, profileData);
      } else {
        response = await axios.post(`${API}/students`, profileData);
      }

      onProfileCreated(response.data);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {initialProfile ? "Update Your Profile" : "Create Your Profile"}
              </CardTitle>
              <CardDescription className="text-lg">
                Help us understand your academic background and career goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      value={formData.university}
                      onChange={(e) => setFormData({...formData, university: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="faculty">Faculty/Major</Label>
                    <Input
                      id="faculty"
                      value={formData.faculty}
                      onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gpa">GPA (out of 4.0)</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.gpa}
                      onChange={(e) => setFormData({...formData, gpa: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="total_credits">Total Credits</Label>
                    <Input
                      id="total_credits"
                      type="number"
                      value={formData.total_credits}
                      onChange={(e) => setFormData({...formData, total_credits: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="completed_credits">Completed Credits</Label>
                    <Input
                      id="completed_credits"
                      type="number"
                      value={formData.completed_credits}
                      onChange={(e) => setFormData({...formData, completed_credits: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="financial_situation">Financial Situation</Label>
                  <Select 
                    value={formData.financial_situation} 
                    onValueChange={(value) => setFormData({...formData, financial_situation: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your financial situation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent - Can afford full tuition</SelectItem>
                      <SelectItem value="good">Good - Can afford some costs</SelectItem>
                      <SelectItem value="needs_scholarship">Needs Scholarship - Require financial aid</SelectItem>
                      <SelectItem value="limited">Limited - Need full funding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="achievements">Achievements (comma-separated)</Label>
                  <Textarea
                    id="achievements"
                    value={formData.achievements}
                    onChange={(e) => setFormData({...formData, achievements: e.target.value})}
                    placeholder="Dean's list, research publications, awards, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="extracurriculars">Extracurricular Activities (comma-separated)</Label>
                  <Textarea
                    id="extracurriculars"
                    value={formData.extracurriculars}
                    onChange={(e) => setFormData({...formData, extracurriculars: e.target.value})}
                    placeholder="Student government, sports, volunteer work, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="preferred_countries">Preferred Countries (comma-separated)</Label>
                  <Input
                    id="preferred_countries"
                    value={formData.preferred_countries}
                    onChange={(e) => setFormData({...formData, preferred_countries: e.target.value})}
                    placeholder="USA, Canada, Germany, UK, etc."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="career_goals">Career Goals</Label>
                  <Textarea
                    id="career_goals"
                    value={formData.career_goals}
                    onChange={(e) => setFormData({...formData, career_goals: e.target.value})}
                    placeholder="Describe your long-term career aspirations..."
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Saving..." : (initialProfile ? "Update Profile" : "Create Profile")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState("landing"); // landing, setup, dashboard
  const [studentProfile, setStudentProfile] = useState(null);

  const handleGetStarted = () => {
    setCurrentView("setup");
  };

  const handleProfileCreated = (profile) => {
    setStudentProfile(profile);
    setCurrentView("dashboard");
  };

  const handleUpdateProfile = () => {
    setCurrentView("setup");
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
              {currentView === "landing" && (
                <LandingPage onGetStarted={handleGetStarted} />
              )}
              {currentView === "setup" && (
                <ProfileSetup 
                  onProfileCreated={handleProfileCreated}
                  initialProfile={studentProfile}
                />
              )}
              {currentView === "dashboard" && studentProfile && (
                <StudentDashboard 
                  studentProfile={studentProfile}
                  onUpdateProfile={handleUpdateProfile}
                />
              )}
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;