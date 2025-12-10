# Backend Implementation Guide for Separated Project Storage

This guide outlines the changes required in your backend (Python/FastAPI) to support separating **Web Builder** and **Project Builder** projects.

## 1. Goal
- **Web Builder Projects**: Store in `static/projects/{project_name}` (Legacy behavior)
- **Project Builder Projects**: Store in `ai_project/user_projects/{project_id}` (New behavior)

## 2. API Updates

### A. Upload Folder Endpoint (`/auth/project/upload-folder`)

Modify your `upload_folder` function to check for `project_type`.

**Pseudo-code / Python Logic:**
```python
@app.post("/auth/project/upload-folder")
async def upload_project_folder(
    project_name: str = Form(...),
    project_id: str = Form(...),
    project_type: str = Form("web"),  # New field, default to "web"
    files: List[UploadFile] = File(...)
):
    # Determine correct path based on project_type
    if project_type == "project":
        # Store in AI Project folder using ID
        base_path = Path(f"ai_project/user_projects/{project_id}")
    else:
        # Store in Static folder using Name (Legacy)
        base_path = Path(f"static/projects/{project_name}")

    # Ensure directory exists
    base_path.mkdir(parents=True, exist_ok=True)

    # ... Rest of your file saving logic ...
    # Save files inside base_path
```

### B. Fetch Folder Endpoint (`/auth/project/fetch-folder`)

Modify your `fetch_folder` function to check for `project_type`.

**Pseudo-code / Python Logic:**
```python
class FetchFolderRequest(BaseModel):
    project_name: str
    project_id: str
    project_type: Optional[str] = "web"  # New field

@app.post("/auth/project/fetch-folder")
async def fetch_folder(request: FetchFolderRequest):
    # Determine correct path based on project_type
    if request.project_type == "project":
        target_path = Path(f"ai_project/user_projects/{request.project_id}")
    else:
        target_path = Path(f"static/projects/{request.project_name}")

    if not target_path.exists():
        return {"status": False, "message": "Project not found"}

    # ... Logic to read files ...
    
    # IMPORTANT: Return files list or tree
    files_list = []
    for file_path in target_path.rglob("*"):
        if file_path.is_file():
            # Create relative path for frontend
            relative_path = file_path.relative_to(target_path)
            content = file_path.read_text(encoding="utf-8", errors="ignore")
            files_list.append({
                "name": str(relative_path).replace("\\", "/"), # Ensure forward slashes
                "content": content
            })

    return {
        "status": True,
        "files": files_list, 
        "folder_name": request.project_name
    }
```

### C. Delete Project Endpoint (`/auth/project/delete`)

Implement the delete logic to remove both the database entry and the corresponding folder.

**Pseudo-code / Python Logic:**
```python
class DeleteProjectRequest(BaseModel):
    project_id: str

@app.post("/auth/project/delete")
async def delete_project(request: DeleteProjectRequest, db: Session = Depends(get_db)):
    # 1. Fetch project from DB to identify type and name
    project = db.query(Project).filter(Project.project_id == request.project_id).first()
    
    if not project:
         return {"status": False, "message": "Project not found"}

    # 2. Determine folder path based on stored type
    if project.project_type == "project":
        folder_path = Path(f"ai_project/user_projects/{request.project_id}")
    else:
        # Fallback for "web" or null types
        folder_path = Path(f"static/projects/{project.project_name}")

    # 3. Delete from Database
    db.delete(project)
    db.commit()

    # 4. Delete Folder from Filesystem
    try:
        if folder_path.exists() and folder_path.is_dir():
            shutil.rmtree(folder_path) # Requires: import shutil
    except Exception as e:
        print(f"Error deleting folder: {e}")
        # Decide if you want to return false or just log warning
    
    return {"status": True, "message": "Project deleted successfully"}
```

## 3. Creating Projects (`/auth/project/create`)
Ensure when you create a project in the database, you save the `project_type`.

- **Web Builder**: `project_type = 'web'`
- **Project Builder**: `project_type = 'project'`

This ensures the Dashboard list API returns the correct type, which the frontend then uses to call the APIs above correctly.
