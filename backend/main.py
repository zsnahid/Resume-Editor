from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uuid
import json
import os
from datetime import datetime

app = FastAPI(
    title="Resume Editor API",
    description="A FastAPI backend for the Resume Editor application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class PersonalInfo(BaseModel):
    name: str
    email: str
    phone: str

class Experience(BaseModel):
    title: str
    company: str
    duration: str
    description: str

class Education(BaseModel):
    degree: str
    institution: str
    duration: str
    description: str

class CustomSection(BaseModel):
    title: str
    content: str

class ResumeData(BaseModel):
    personal_info: PersonalInfo
    summary: str
    experience: List[Experience]
    education: List[Education]
    skills: List[str]
    custom_sections: Optional[List[CustomSection]] = []

class AIEnhanceRequest(BaseModel):
    section: str = Field(..., description="The section type (e.g., summary, experience, education, skills)")
    content: str = Field(..., description="The content to enhance")

class AIEnhanceResponse(BaseModel):
    enhanced_content: str

class SaveResumeResponse(BaseModel):
    message: str
    resume_id: str

# In-memory storage (for demonstration purposes)
resumes_storage: Dict[str, Dict[str, Any]] = {}

# Create data directory if it doesn't exist
DATA_DIR = "data"
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def save_resume_to_disk(resume_id: str, resume_data: dict):
    """Save resume data to disk for persistence"""
    file_path = os.path.join(DATA_DIR, f"resume_{resume_id}.json")
    with open(file_path, 'w') as f:
        json.dump({
            "id": resume_id,
            "data": resume_data,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }, f, indent=2)

def load_resume_from_disk(resume_id: str) -> Optional[dict]:
    """Load resume data from disk"""
    file_path = os.path.join(DATA_DIR, f"resume_{resume_id}.json")
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            return json.load(f)
    return None

def enhance_content_with_mock_ai(section: str, content: str) -> str:
    """Mock AI enhancement for different resume sections"""
    
    enhancement_templates = {
        "summary": {
            "prefixes": [
                "Highly skilled and results-driven",
                "Dynamic and innovative",
                "Accomplished and detail-oriented",
                "Experienced and motivated",
                "Dedicated and performance-focused"
            ],
            "additions": [
                "with a proven track record of delivering exceptional results",
                "specializing in cutting-edge technologies and best practices",
                "with expertise in leading cross-functional teams",
                "committed to continuous learning and professional development",
                "with strong analytical and problem-solving capabilities"
            ]
        },
        "experience": {
            "action_words": [
                "Spearheaded", "Orchestrated", "Pioneered", "Architected", "Optimized",
                "Streamlined", "Revolutionized", "Implemented", "Collaborated", "Delivered"
            ],
            "impact_phrases": [
                "resulting in improved efficiency and cost savings",
                "leading to enhanced user experience and satisfaction",
                "contributing to significant performance improvements",
                "driving innovation and competitive advantage",
                "achieving measurable business impact"
            ]
        },
        "education": {
            "academic_excellence": [
                "Distinguished academic performance with",
                "Comprehensive education featuring",
                "Rigorous academic foundation in",
                "Advanced studies encompassing"
            ],
            "skills_gained": [
                "developing strong analytical and critical thinking skills",
                "gaining expertise in modern methodologies and frameworks",
                "building a solid foundation in industry best practices",
                "cultivating leadership and collaborative skills"
            ]
        },
        "skills": {
            "technical_depth": [
                "Advanced proficiency in",
                "Expert-level knowledge of",
                "Comprehensive expertise in",
                "Specialized skills in"
            ],
            "frameworks": [
                "modern development frameworks",
                "industry-standard tools and technologies",
                "cutting-edge platforms and libraries",
                "enterprise-grade solutions"
            ]
        }
    }
    
    if section == "summary":
        templates = enhancement_templates["summary"]
        enhanced = f"{templates['prefixes'][0]} {content.lower()}, {templates['additions'][0]}."
        
    elif section == "experience":
        templates = enhancement_templates["experience"]
        # Add action words at the beginning and impact phrases at the end
        lines = content.split('. ')
        enhanced_lines = []
        for i, line in enumerate(lines):
            if line.strip():
                action_word = templates["action_words"][i % len(templates["action_words"])]
                impact = templates["impact_phrases"][i % len(templates["impact_phrases"])]
                enhanced_line = f"{action_word} {line.lower()}, {impact}"
                enhanced_lines.append(enhanced_line)
        enhanced = '. '.join(enhanced_lines)
        
    elif section == "education":
        templates = enhancement_templates["education"]
        enhanced = f"{templates['academic_excellence'][0]} {content}, {templates['skills_gained'][0]}."
        
    elif section == "skills":
        templates = enhancement_templates["skills"]
        skills_list = content.split(', ')
        enhanced = f"{templates['technical_depth'][0]} {', '.join(skills_list)} and {templates['frameworks'][0]}."
        
    elif section == "personal_info":
        # For personal info, we just return a professional summary
        enhanced = f"Professional contact information verified and optimized for industry standards."
        
    elif section == "custom":
        # Generic enhancement for custom sections
        enhanced = f"Enhanced and professionally optimized: {content} - demonstrating expertise and commitment to excellence."
        
    else:
        # Fallback for unknown sections
        enhanced = f"Professionally enhanced: {content}"
    
    return enhanced

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Resume Editor API",
        "version": "1.0.0",
        "endpoints": {
            "ai_enhance": "POST /ai-enhance",
            "save_resume": "POST /save-resume",
            "get_resume": "GET /resume/{resume_id}",
            "health": "GET /health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/ai-enhance", response_model=AIEnhanceResponse)
async def enhance_with_ai(request: AIEnhanceRequest):
    """
    Enhance resume section content using mock AI
    
    - **section**: The type of section (summary, experience, education, skills, etc.)
    - **content**: The content to enhance
    """
    try:
        enhanced_content = enhance_content_with_mock_ai(request.section, request.content)
        return AIEnhanceResponse(enhanced_content=enhanced_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error enhancing content: {str(e)}")

@app.post("/save-resume", response_model=SaveResumeResponse)
async def save_resume(resume_data: ResumeData):
    """
    Save complete resume data
    
    - **resume_data**: Complete resume information including personal info, experience, education, etc.
    """
    try:
        # Generate unique resume ID
        resume_id = str(uuid.uuid4())
        
        # Convert to dict for storage
        resume_dict = resume_data.model_dump()
        
        # Store in memory
        resumes_storage[resume_id] = {
            "id": resume_id,
            "data": resume_dict,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        # Save to disk for persistence
        save_resume_to_disk(resume_id, resume_dict)
        
        return SaveResumeResponse(
            message="Resume saved successfully",
            resume_id=resume_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving resume: {str(e)}")

@app.get("/resume/{resume_id}")
async def get_resume(resume_id: str):
    """
    Retrieve a saved resume by ID
    
    - **resume_id**: The unique identifier of the resume
    """
    # Try to get from memory first
    if resume_id in resumes_storage:
        return resumes_storage[resume_id]
    
    # Try to load from disk
    resume_data = load_resume_from_disk(resume_id)
    if resume_data:
        # Add back to memory cache
        resumes_storage[resume_id] = resume_data
        return resume_data
    
    raise HTTPException(status_code=404, detail="Resume not found")

@app.get("/resumes")
async def list_resumes():
    """
    List all saved resumes (for development/debugging purposes)
    """
    # Load all resumes from disk
    all_resumes = {}
    
    if os.path.exists(DATA_DIR):
        for filename in os.listdir(DATA_DIR):
            if filename.startswith("resume_") and filename.endswith(".json"):
                resume_id = filename.replace("resume_", "").replace(".json", "")
                resume_data = load_resume_from_disk(resume_id)
                if resume_data:
                    all_resumes[resume_id] = {
                        "id": resume_id,
                        "created_at": resume_data.get("created_at"),
                        "updated_at": resume_data.get("updated_at"),
                        "personal_info": resume_data.get("data", {}).get("personal_info", {})
                    }
    
    return {"resumes": all_resumes, "count": len(all_resumes)}

@app.delete("/resume/{resume_id}")
async def delete_resume(resume_id: str):
    """
    Delete a resume by ID
    
    - **resume_id**: The unique identifier of the resume to delete
    """
    # Remove from memory
    if resume_id in resumes_storage:
        del resumes_storage[resume_id]
    
    # Remove from disk
    file_path = os.path.join(DATA_DIR, f"resume_{resume_id}.json")
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"message": "Resume deleted successfully", "resume_id": resume_id}
    
    raise HTTPException(status_code=404, detail="Resume not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
