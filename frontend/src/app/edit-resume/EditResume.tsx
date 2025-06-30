import { useState } from "react";
import {
  ArrowLeft,
  Download,
  Save,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types for resume data
interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  description: string;
}

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

interface ResumeData {
  personal_info: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  custom_sections?: CustomSection[];
}

const API_BASE_URL = "http://localhost:8000";

// API response types
interface AIEnhanceResponse {
  enhanced_content: string;
}

interface SaveResumeResponse {
  message: string;
  resume_id: string;
}

export default function EditResume() {
  // Initialize with dummy resume data
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal_info: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
    },
    summary:
      "Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about creating scalable applications and leading development teams to deliver high-quality solutions.",
    experience: [
      {
        id: "exp-1",
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        duration: "Jan 2022 - Present",
        description:
          "Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and collaborated with cross-functional teams.",
      },
      {
        id: "exp-2",
        title: "Software Developer",
        company: "Digital Innovations Corp",
        duration: "Jun 2019 - Dec 2021",
        description:
          "Developed responsive web applications using React and Node.js. Optimized database queries improving performance by 40%. Participated in agile development cycles and code reviews.",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Technology",
        duration: "2015 - 2019",
        description:
          "Graduated Magna Cum Laude with a focus on software engineering and algorithms. Relevant coursework: Data Structures, Database Systems, Web Development.",
      },
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "SQL",
      "AWS",
      "Docker",
      "Git",
    ],
    custom_sections: [
      {
        id: "custom-1",
        title: "Projects",
        content:
          "E-commerce Platform: Built a full-stack e-commerce solution using React, Node.js, and MongoDB. Integrated payment processing and inventory management systems.",
      },
    ],
  });

  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null);

  // Helper function to show messages
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  // AI Enhancement function
  const enhanceWithAI = async (
    section: string,
    content: string,
  ): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-enhance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: section,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status.toString()}`);
      }

      const data = (await response.json()) as AIEnhanceResponse;
      return data.enhanced_content;
    } catch (error) {
      console.error("AI Enhancement error:", error);
      throw new Error("Failed to enhance content with AI");
    }
  };

  // Save resume function
  const saveResume = async () => {
    setLoading("saving");
    try {
      const response = await fetch(`${API_BASE_URL}/save-resume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status.toString()}`);
      }

      const data = (await response.json()) as SaveResumeResponse;
      setSavedResumeId(data.resume_id);
      showMessage(
        "success",
        `Resume saved successfully! ID: ${data.resume_id}`,
      );
    } catch (error) {
      console.error("Save error:", error);
      showMessage("error", "Failed to save resume. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Handle AI enhancement for different sections
  const handleAIEnhance = async (section: keyof ResumeData, index?: number) => {
    const loadingKey = `${section}${index !== undefined ? `-${index.toString()}` : ""}`;
    setLoading(loadingKey);

    try {
      let content = "";
      const sectionType = section;

      if (section === "personal_info") {
        content = `${resumeData.personal_info.name} - ${resumeData.personal_info.email} - ${resumeData.personal_info.phone}`;
      } else if (section === "summary") {
        content = resumeData.summary;
      } else if (section === "experience" && index !== undefined) {
        const exp = resumeData.experience[index];
        content = `${exp.title} at ${exp.company} (${exp.duration}): ${exp.description}`;
      } else if (section === "education" && index !== undefined) {
        const edu = resumeData.education[index];
        content = `${edu.degree} from ${edu.institution} (${edu.duration}): ${edu.description}`;
      } else if (section === "skills") {
        content = resumeData.skills.join(", ");
      }

      const enhanced = await enhanceWithAI(sectionType, content);

      // Update the specific section with enhanced content
      setResumeData((prev) => {
        const newData = { ...prev };

        if (section === "summary") {
          newData.summary = enhanced;
        } else if (section === "experience" && index !== undefined) {
          newData.experience[index].description = enhanced;
        } else if (section === "education" && index !== undefined) {
          newData.education[index].description = enhanced;
        } else if (section === "skills") {
          newData.skills = enhanced.split(", ").map((skill) => skill.trim());
        }

        return newData;
      });

      showMessage("success", "Content enhanced successfully!");
    } catch {
      showMessage("error", "Failed to enhance content. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Download as JSON
  const downloadAsJSON = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume_${savedResumeId ?? "draft"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Add/Remove functions for dynamic sections
  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now().toString()}`,
          title: "",
          company: "",
          duration: "",
          description: "",
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now().toString()}`,
          degree: "",
          institution: "",
          duration: "",
          description: "",
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const removeSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addCustomSection = () => {
    setResumeData((prev) => ({
      ...prev,
      custom_sections: [
        ...(prev.custom_sections ?? []),
        {
          id: `custom-${Date.now().toString()}`,
          title: "",
          content: "",
        },
      ],
    }));
  };

  const removeCustomSection = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      custom_sections:
        prev.custom_sections?.filter((_, i) => i !== index) ?? [],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.history.back();
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Edit Resume</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                void saveResume();
              }}
              disabled={loading === "saving"}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading === "saving" ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outline"
              onClick={downloadAsJSON}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download JSON
            </Button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <Alert
            className={`mb-6 ${message.type === "error" ? "border-red-500" : "border-green-500"}`}
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Personal Information
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void handleAIEnhance("personal_info");
                }}
                disabled={loading === "personal_info"}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {loading === "personal_info"
                  ? "Enhancing..."
                  : "Enhance with AI"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Full Name"
              value={resumeData.personal_info.name}
              onChange={(e) => {
                setResumeData((prev) => ({
                  ...prev,
                  personal_info: {
                    ...prev.personal_info,
                    name: e.target.value,
                  },
                }));
              }}
            />
            <Input
              placeholder="Email Address"
              type="email"
              value={resumeData.personal_info.email}
              onChange={(e) => {
                setResumeData((prev) => ({
                  ...prev,
                  personal_info: {
                    ...prev.personal_info,
                    email: e.target.value,
                  },
                }));
              }}
            />
            <Input
              placeholder="Phone Number"
              value={resumeData.personal_info.phone}
              onChange={(e) => {
                setResumeData((prev) => ({
                  ...prev,
                  personal_info: {
                    ...prev.personal_info,
                    phone: e.target.value,
                  },
                }));
              }}
            />
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Professional Summary
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void handleAIEnhance("summary");
                }}
                disabled={loading === "summary"}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {loading === "summary" ? "Enhancing..." : "Enhance with AI"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full resize-none rounded-md border p-3"
              rows={4}
              placeholder="Write a brief professional summary..."
              value={resumeData.summary}
              onChange={(e) => {
                setResumeData((prev) => ({ ...prev, summary: e.target.value }));
              }}
            />
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Work Experience
              <Button
                variant="outline"
                size="sm"
                onClick={addExperience}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Experience {index + 1}</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        void handleAIEnhance("experience", index);
                      }}
                      disabled={loading === `experience-${index.toString()}`}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      {loading === `experience-${index.toString()}`
                        ? "Enhancing..."
                        : "Enhance"}
                    </Button>
                    {resumeData.experience.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          removeExperience(index);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) => {
                      setResumeData((prev) => ({
                        ...prev,
                        experience: prev.experience.map((item, i) =>
                          i === index
                            ? { ...item, title: e.target.value }
                            : item,
                        ),
                      }));
                    }}
                  />
                  <Input
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => {
                      setResumeData((prev) => ({
                        ...prev,
                        experience: prev.experience.map((item, i) =>
                          i === index
                            ? { ...item, company: e.target.value }
                            : item,
                        ),
                      }));
                    }}
                  />
                </div>
                <Input
                  placeholder="Duration (e.g., Jan 2020 - Present)"
                  value={exp.duration}
                  onChange={(e) => {
                    setResumeData((prev) => ({
                      ...prev,
                      experience: prev.experience.map((item, i) =>
                        i === index
                          ? { ...item, duration: e.target.value }
                          : item,
                      ),
                    }));
                  }}
                />
                <textarea
                  className="w-full resize-none rounded-md border p-3"
                  rows={3}
                  placeholder="Job description and achievements..."
                  value={exp.description}
                  onChange={(e) => {
                    setResumeData((prev) => ({
                      ...prev,
                      experience: prev.experience.map((item, i) =>
                        i === index
                          ? { ...item, description: e.target.value }
                          : item,
                      ),
                    }));
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Education
              <Button
                variant="outline"
                size="sm"
                onClick={addEducation}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {resumeData.education.map((edu, index) => (
              <div key={edu.id} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Education {index + 1}</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        void handleAIEnhance("education", index);
                      }}
                      disabled={loading === `education-${index.toString()}`}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      {loading === `education-${index.toString()}`
                        ? "Enhancing..."
                        : "Enhance"}
                    </Button>
                    {resumeData.education.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          removeEducation(index);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Degree/Certification"
                    value={edu.degree}
                    onChange={(e) => {
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item, i) =>
                          i === index
                            ? { ...item, degree: e.target.value }
                            : item,
                        ),
                      }));
                    }}
                  />
                  <Input
                    placeholder="Institution Name"
                    value={edu.institution}
                    onChange={(e) => {
                      setResumeData((prev) => ({
                        ...prev,
                        education: prev.education.map((item, i) =>
                          i === index
                            ? { ...item, institution: e.target.value }
                            : item,
                        ),
                      }));
                    }}
                  />
                </div>
                <Input
                  placeholder="Duration (e.g., 2016 - 2020)"
                  value={edu.duration}
                  onChange={(e) => {
                    setResumeData((prev) => ({
                      ...prev,
                      education: prev.education.map((item, i) =>
                        i === index
                          ? { ...item, duration: e.target.value }
                          : item,
                      ),
                    }));
                  }}
                />
                <textarea
                  className="w-full resize-none rounded-md border p-3"
                  rows={2}
                  placeholder="Additional details, achievements, GPA, etc."
                  value={edu.description}
                  onChange={(e) => {
                    setResumeData((prev) => ({
                      ...prev,
                      education: prev.education.map((item, i) =>
                        i === index
                          ? { ...item, description: e.target.value }
                          : item,
                      ),
                    }));
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Skills
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void handleAIEnhance("skills");
                  }}
                  disabled={loading === "skills"}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  {loading === "skills" ? "Enhancing..." : "Enhance with AI"}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Skills Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill (e.g., JavaScript, Project Management)"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    const newSkill = e.currentTarget.value.trim();
                    if (!resumeData.skills.includes(newSkill)) {
                      setResumeData((prev) => ({
                        ...prev,
                        skills: [...prev.skills, newSkill],
                      }));
                    }
                    e.currentTarget.value = "";
                  }
                }}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector(
                    "input",
                  ) as HTMLInputElement | null;
                  if (input?.value.trim()) {
                    const newSkill = input.value.trim();
                    if (!resumeData.skills.includes(newSkill)) {
                      setResumeData((prev) => ({
                        ...prev,
                        skills: [...prev.skills, newSkill],
                      }));
                    }
                    input.value = "";
                  }
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {/* Skills Badges */}
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map(
                (skill, index) =>
                  skill.trim() && (
                    <div
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => {
                          removeSkill(index);
                        }}
                        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200"
                        aria-label={`Remove ${skill}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ),
              )}
            </div>

            {resumeData.skills.filter((skill) => skill.trim()).length === 0 && (
              <p className="py-4 text-center text-gray-500">
                No skills added yet. Use the input above to add skills.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Custom Sections */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Custom Sections
              <Button
                variant="outline"
                size="sm"
                onClick={addCustomSection}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Custom Section
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {resumeData.custom_sections?.map((section, index) => (
              <div key={section.id} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Custom Section {index + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      removeCustomSection(index);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Section Title (e.g., Projects, Certifications)"
                  value={section.title}
                  onChange={(e) => {
                    setResumeData((prev) => ({
                      ...prev,
                      custom_sections:
                        prev.custom_sections?.map((item, i) =>
                          i === index
                            ? { ...item, title: e.target.value }
                            : item,
                        ) ?? [],
                    }));
                  }}
                />
                <textarea
                  className="w-full resize-none rounded-md border p-3"
                  rows={3}
                  placeholder="Section content..."
                  value={section.content}
                  onChange={(e) => {
                    setResumeData((prev) => ({
                      ...prev,
                      custom_sections:
                        prev.custom_sections?.map((item, i) =>
                          i === index
                            ? { ...item, content: e.target.value }
                            : item,
                        ) ?? [],
                    }));
                  }}
                />
              </div>
            )) ?? (
              <p className="py-4 text-center text-gray-500">
                No custom sections added yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4 pb-8">
          <Button
            onClick={() => {
              void saveResume();
            }}
            disabled={loading === "saving"}
            size="lg"
            className="flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            {loading === "saving" ? "Saving..." : "Save Resume"}
          </Button>
          <Button
            variant="outline"
            onClick={downloadAsJSON}
            size="lg"
            className="flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Download JSON
          </Button>
        </div>
      </div>
    </div>
  );
}
