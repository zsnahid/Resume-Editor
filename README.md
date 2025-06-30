# Resume Editor

A full-stack web application for creating, editing, and enhancing resumes with AI assistance. Built with React (TypeScript) frontend and FastAPI backend.

## Features

- 📝 **Interactive Resume Editor**: Create and edit resumes with a user-friendly interface
- 🤖 **AI Enhancement**: Improve resume content with AI-powered suggestions
- 💾 **Save & Load**: Save resumes to disk and load them later
- 📊 **Dynamic Sections**: Add/remove experience, education, and custom sections
- 🏷️ **Skills Management**: Add skills as interactive badges
- 📁 **File Upload**: Upload existing resume files
- 📥 **Export**: Download resumes as JSON files
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Lucide React** for icons

### Backend

- **FastAPI** for REST API
- **Python 3.8+** runtime
- **Pydantic** for data validation
- **Uvicorn** ASGI server
- **CORS** middleware for cross-origin requests

## Prerequisites

- **Node.js** 18+ and npm/pnpm
- **Python** 3.8+
- **Git** for version control

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Resume-Editor
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
# Using npm
npm install

# Or using pnpm (recommended)
pnpm install
```

## Running the Application

### Start the Backend Server

In the `backend` directory with virtual environment activated:

```bash
# Option 1: Direct command
python main.py

# Option 2: Using uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Option 3: Using provided scripts
# On Windows:
start.bat
# On macOS/Linux:
chmod +x start.sh && ./start.sh
```

The backend API will be available at `http://localhost:8000`

### Start the Frontend Development Server

In the `frontend` directory:

```bash
# Using npm
npm run dev

# Using pnpm
pnpm run dev
```

The frontend will be available at `http://localhost:5173`

### Using VS Code Tasks

If using VS Code, you can use the predefined task:

1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "Tasks: Run Task"
3. Select "Start Backend Server"

## API Documentation

The backend provides a RESTful API with the following endpoints:

### Base URL

```
http://localhost:8000
```

### Endpoints

#### Health Check

```http
GET /health
```

Returns server status.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2025-06-30T12:00:00Z"
}
```

#### Root Endpoint

```http
GET /
```

Returns API information.

#### AI Enhancement

```http
POST /ai-enhance
```

Enhance resume content using AI.

**Request Body:**

```json
{
  "section": "experience",
  "content": "Software engineer with 5 years experience"
}
```

**Response:**

```json
{
  "enhanced_content": "Experienced software engineer with 5+ years of expertise in full-stack development..."
}
```

#### Save Resume

```http
POST /save-resume
```

Save a resume to disk.

**Request Body:**

```json
{
  "personal_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123"
  },
  "summary": "Professional summary...",
  "experience": [
    {
      "id": "exp-1",
      "title": "Software Engineer",
      "company": "Tech Corp",
      "duration": "2020-2023",
      "description": "Developed web applications..."
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "degree": "Bachelor of Computer Science",
      "institution": "University",
      "duration": "2016-2020",
      "description": "Relevant coursework..."
    }
  ],
  "skills": ["JavaScript", "Python", "React"],
  "custom_sections": [
    {
      "id": "custom-1",
      "title": "Projects",
      "content": "Project descriptions..."
    }
  ]
}
```

**Response:**

```json
{
  "message": "Resume saved successfully",
  "resume_id": "resume_abc123..."
}
```

#### Get Resume

```http
GET /resume/{resume_id}
```

Retrieve a specific resume by ID.

**Response:** Returns the full resume data structure.

#### List Resumes

```http
GET /resumes
```

Get list of all saved resumes.

**Response:**

```json
{
  "resumes": [
    {
      "id": "resume_abc123...",
      "filename": "resume_abc123.json",
      "created_at": "2025-06-30T12:00:00Z",
      "personal_info": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "count": 1
}
```

#### Delete Resume

```http
DELETE /resume/{resume_id}
```

Delete a specific resume.

**Response:**

```json
{
  "message": "Resume deleted successfully"
}
```

## Usage Examples

### 1. Creating a New Resume

1. Navigate to the home page
2. Click "Create New Resume" or upload an existing file
3. Fill in personal information, summary, and other sections
4. Use the "+" buttons to add multiple experiences, education entries, or custom sections
5. Click "Save" to persist your resume

### 2. AI Enhancement

1. In any section, click the "Enhance with AI" button (✨ icon)
2. The AI will analyze and improve the content
3. Review the enhanced content and make manual adjustments if needed

### 3. Managing Skills

1. In the Skills section, type a skill name and press Enter or click "Add"
2. Skills appear as badges with remove buttons (×)
3. Use AI enhancement to get skill suggestions

### 4. Exporting Resume

1. Click "Download JSON" to export your resume data
2. The file can be imported later or used with other tools

## Development

### Frontend Development

The frontend uses modern React with TypeScript:

- **Components**: Located in `src/components/`
- **Pages**: Located in `src/app/`
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks (useState)

#### Available Scripts

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Run linter
pnpm run lint

# Preview production build
pnpm run preview
```

### Backend Development

The FastAPI backend provides:

- **Mock AI Enhancement**: Simulates AI processing
- **File-based Storage**: Resumes saved as JSON files in `data/` directory
- **CORS Support**: Configured for frontend development
- **Automatic API Docs**: Available at `http://localhost:8000/docs`

#### Testing the API

Test the API endpoints:

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test AI enhancement
curl -X POST "http://localhost:8000/ai-enhance" \
  -H "Content-Type: application/json" \
  -d '{"section": "summary", "content": "Software developer"}'
```

## File Structure

```
Resume-Editor/
├── README.md
├── Requirements.md
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── start.sh            # Unix startup script
│   ├── start.bat           # Windows startup script
│   ├── test_api.py         # API tests
│   └── data/               # Saved resumes (created automatically)
└── frontend/
    ├── package.json        # Node.js dependencies
    ├── vite.config.ts      # Vite configuration
    ├── tailwind.config.js  # Tailwind CSS config
    ├── src/
    │   ├── main.tsx        # React entry point
    │   ├── app/            # Page components
    │   │   ├── home/       # Home page
    │   │   └── edit-resume/ # Resume editor
    │   ├── components/     # Reusable components
    │   │   ├── ui/         # shadcn/ui components
    │   │   └── home/       # Home-specific components
    │   ├── lib/            # Utilities
    │   └── router/         # Routing configuration
    └── public/             # Static assets
```

## Dependencies

### Backend Dependencies

```plaintext
fastapi==0.104.1          # Web framework
uvicorn[standard]==0.24.0 # ASGI server
pydantic==2.5.0           # Data validation
python-multipart==0.0.6   # File upload support
```

### Frontend Dependencies

Key dependencies:

- `react` & `react-dom`: React framework
- `@tailwindcss/vite` & `tailwindcss`: Styling
- `@radix-ui/react-slot`: Base component primitives
- `lucide-react`: Icon library
- `react-router`: Client-side routing
- `vite`: Build tool
- `typescript`: Type checking

## Troubleshooting

### Common Issues

1. **Backend not starting:**

   - Ensure Python 3.8+ is installed
   - Check if virtual environment is activated
   - Verify all dependencies are installed: `pip install -r requirements.txt`

2. **Frontend not starting:**

   - Ensure Node.js 18+ is installed
   - Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
   - Check for port conflicts (default: 5173)

3. **CORS errors:**

   - Verify backend is running on port 8000
   - Check that frontend URL is in CORS origins list in `main.py`

4. **File save errors:**
   - Ensure backend has write permissions in the directory
   - Check if `data/` directory exists (created automatically)

### Port Configuration

- **Backend:** Default port 8000 (configurable in `main.py`)
- **Frontend:** Default port 5173 (configurable in `vite.config.ts`)
