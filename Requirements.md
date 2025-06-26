# Resume Editor - Project Requirements

## **Goal**

Build a **web-based Resume Editor** that lets users:

- **Upload and edit** their resumes
- **Enhance sections** using a mock AI backend
- **Save and retrieve** resume data via a FastAPI backend
- **Download** the final resume

## **Functional Requirements**

### **Frontend** (React.js or similar)

#### **Upload Resume**

- Accept **`.pdf` or `.docx`** files
- **Mock the parsing process** (use dummy content for demonstration)

#### **Edit Resume**

- **Editable fields** like:
  - Name
  - Experience
  - Education
  - Skills
- **Ability to add or remove sections** dynamically

#### **Enhance with AI**

- Add an **"Enhance with AI"** button next to each section
- When clicked, send the section content to the backend endpoint `/ai-enhance`
- **Display the improved version** returned by the backend

#### **Save Resume**

- Save the **complete resume JSON** to the backend using `/save-resume`

#### **Download**

- Allow **downloading the final resume** as a `.json` file

### **Backend** (Python FastAPI)

#### **API Endpoints**

##### **POST /ai-enhance**

**Purpose:** Enhance resume section content using mock AI

**Input:**

```json
{
  "section": "summary",
  "content": "Experienced developer with 5 years in web development..."
}
```

**Output:**

```json
{
  "enhanced_content": "Highly skilled and results-driven developer with 5+ years of expertise in full-stack web development, specializing in modern frameworks and scalable solutions..."
}
```

##### **POST /save-resume**

**Purpose:** Store complete resume data

**Input:**

```json
{
  "personal_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-234-567-8900"
  },
  "summary": "Enhanced summary content...",
  "experience": [
    {
      "title": "Senior Developer",
      "company": "Tech Corp",
      "duration": "2020-2023",
      "description": "Enhanced job description..."
    }
  ],
  "education": [...],
  "skills": [...]
}
```

**Output:**

```json
{
  "message": "Resume saved successfully",
  "resume_id": "uuid-string"
}
```

**Storage:** Store in **memory** or save to **disk** (no database required)

## **Deliverables**

A **GitHub repository** containing:

```
/frontend/      # React app
/backend/       # FastAPI app
README.md       # Setup instructions
```

### **README Requirements**

The README should include:

- **Setup instructions** for frontend and backend
- **API documentation**
- **Usage examples**
- **Dependencies** and installation steps
