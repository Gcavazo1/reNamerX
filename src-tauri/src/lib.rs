// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::path::Path;
use std::fs;
use serde::{Serialize, Deserialize};
use tauri_plugin_dialog::DialogExt;

#[derive(Debug, Serialize, Deserialize)]
pub struct FileInfo {
    id: String,
    name: String,
    path: String,
    original_name: String,
    new_name: Option<String>,
    is_directory: bool,
    size: u64,
    last_modified: u64,
    file_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RenameResult {
    success: bool,
    message: Option<String>,
    file_id: String,
    original_path: String,
    new_path: String,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn select_files(window: tauri::Window) -> Result<Vec<FileInfo>, String> {
    println!("Rust: select_files command called");
    
    // Use blocking call for simplicity
    let file_path = match window.dialog().file().add_filter("All Files", &["*"]).blocking_pick_file() {
        Some(path) => path,
        None => {
            println!("Rust: No files selected or dialog cancelled");
            return Ok(Vec::new());
        }
    };
    
    println!("Rust: File selected: {:?}", file_path);
    
    let mut files = Vec::new();
    
    // Tauri v2 FilePath might be a URI, so we get a Path from it
    let path_str = file_path.to_string();
    let path = Path::new(&path_str);
    
    println!("Rust: Processing file: {:?}", path);
    
    let metadata = match fs::metadata(path) {
        Ok(meta) => meta,
        Err(e) => {
            println!("Rust: Failed to read metadata for {:?}: {}", path, e);
            return Err(format!("Failed to read metadata for {:?}: {}", path, e));
        }
    };
    
    let file_name = match path.file_name() {
        Some(name) => name.to_string_lossy().to_string(),
        None => {
            println!("Rust: Could not determine filename for {:?}", path);
            "Unknown".to_string()
        }
    };
    
    let file_type = match path.extension() {
        Some(ext) => ext.to_string_lossy().to_string(),
        None => "".to_string(),
    };
    
    let last_modified = metadata.modified()
        .map(|time| time.duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_secs())
            .unwrap_or(0))
        .unwrap_or(0);
    
    files.push(FileInfo {
        id: uuid::Uuid::new_v4().to_string(),
        name: file_name.clone(),
        path: path.to_string_lossy().to_string(),
        original_name: file_name,
        new_name: None,
        is_directory: metadata.is_dir(),
        size: metadata.len(),
        last_modified,
        file_type,
    });
    
    println!("Rust: Returning {} files", files.len());
    Ok(files)
}

#[tauri::command]
async fn select_directory(window: tauri::Window) -> Result<Option<String>, String> {
    println!("Rust: select_directory command called");
    
    // Try a simpler approach with the blocking_pick_folder method specifically for directories
    let result = window.dialog().file()
        .blocking_pick_folder();
    
    match result {
        Some(path) => {
            let path_str = path.to_string();
            println!("Rust: Directory selected: {:?}", path_str);
            Ok(Some(path_str))
        },
        None => {
            println!("Rust: No directory selected or dialog cancelled");
            Ok(None)
        }
    }
}

#[tauri::command]
async fn list_directory_files(dir_path: String) -> Result<Vec<FileInfo>, String> {
    println!("Rust: list_directory_files command called for: {}", dir_path);
    
    let path = Path::new(&dir_path);
    
    if !path.exists() {
        let err = format!("Directory does not exist: {}", dir_path);
        println!("Rust: {}", err);
        return Err(err);
    }
    
    if !path.is_dir() {
        let err = format!("Path is not a directory: {}", dir_path);
        println!("Rust: {}", err);
        return Err(err);
    }
    
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            let err = format!("Failed to read directory: {}", e);
            println!("Rust: {}", err);
            return Err(err);
        }
    };
    
    let mut files = Vec::new();
    
    for entry in entries {
        match entry {
            Ok(entry) => {
                let path = entry.path();
                let metadata = match fs::metadata(&path) {
                    Ok(meta) => meta,
                    Err(e) => {
                        // Skip files with metadata errors
                        println!("Rust: Failed to read metadata for {:?}: {}", path, e);
                        continue;
                    }
                };
                
                let file_name = match path.file_name() {
                    Some(name) => name.to_string_lossy().to_string(),
                    None => continue, // Skip entries with no file name
                };
                
                // Skip hidden files on Unix-like systems
                if file_name.starts_with(".") && !cfg!(windows) {
                    continue;
                }
                
                let file_type = match path.extension() {
                    Some(ext) => ext.to_string_lossy().to_string(),
                    None => "".to_string(),
                };
                
                let last_modified = metadata.modified()
                    .map(|time| time.duration_since(std::time::UNIX_EPOCH)
                        .map(|d| d.as_secs())
                        .unwrap_or(0))
                    .unwrap_or(0);
                
                files.push(FileInfo {
                    id: uuid::Uuid::new_v4().to_string(),
                    name: file_name.clone(),
                    path: path.to_string_lossy().to_string(),
                    original_name: file_name,
                    new_name: None,
                    is_directory: metadata.is_dir(),
                    size: metadata.len(),
                    last_modified,
                    file_type,
                });
            },
            Err(e) => {
                println!("Rust: Failed to read directory entry: {}", e);
                // Skip entries with errors
                continue;
            }
        }
    }
    
    // Sort files by type (directories first) and then by name
    files.sort_by(|a, b| {
        match (a.is_directory, b.is_directory) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
        }
    });
    
    println!("Rust: Returning {} files/directories from directory", files.len());
    Ok(files)
}

#[tauri::command]
async fn rename_files(files: Vec<FileInfo>) -> Result<Vec<RenameResult>, String> {
    println!("Rust: rename_files command called for {} files", files.len());
    
    let mut results = Vec::new();
    
    for file in files {
        if let Some(new_name) = &file.new_name {
            println!("Rust: Renaming '{}' to '{}'", file.name, new_name);
            
            let path = Path::new(&file.path);
            let parent = match path.parent() {
                Some(p) => p,
                None => {
                    let err = format!("Unable to determine parent directory for {}", file.path);
                    println!("Rust: {}", err);
                    return Err(err);
                }
            };
            
            let new_path = parent.join(new_name);
            
            match fs::rename(path, &new_path) {
                Ok(_) => {
                    println!("Rust: Successfully renamed to {:?}", new_path);
                    results.push(RenameResult {
                        success: true,
                        message: None,
                        file_id: file.id,
                        original_path: file.path,
                        new_path: new_path.to_string_lossy().to_string(),
                    });
                },
                Err(e) => {
                    println!("Rust: Failed to rename: {}", e);
                    results.push(RenameResult {
                        success: false,
                        message: Some(format!("Failed to rename: {}", e)),
                        file_id: file.id,
                        original_path: file.path,
                        new_path: new_path.to_string_lossy().to_string(),
                    });
                }
            }
        } else {
            println!("Rust: Skipping file '{}' as it has no new name", file.name);
        }
    }
    
    println!("Rust: Completed renaming with {} results", results.len());
    Ok(results)
}

#[tauri::command]
fn select_directory_path(path: String) -> Result<String, String> {
    println!("Rust: select_directory_path command called with: {}", path);
    let path_obj = Path::new(&path);
    
    if !path_obj.exists() {
        return Err(format!("Path does not exist: {}", path));
    }
    
    if !path_obj.is_dir() {
        return Err(format!("Path is not a directory: {}", path));
    }
    
    println!("Rust: Directory selected: {:?}", path);
    Ok(path)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("Rust: Starting File Rename Tool backend");
    
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            greet, 
            select_files, 
            select_directory, 
            list_directory_files,
            rename_files,
            select_directory_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
