// Add dialog capability permission
#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]
#![allow(clippy::needless_return)]
// Required permissions for dialog functionality
#[cfg(mobile)]
mod mobile;

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

// Single rename info struct with consistent naming
#[derive(Deserialize)]
struct FileRenameInfo {
    #[serde(rename = "oldPath")]
    old_path: String,
    #[serde(rename = "newPath")]
    new_path: String,
}

// Helper function for consistent error formatting and logging
fn log_error(message: &str) -> String {
    println!("Rust: Error - {}", message);
    message.to_string()
}

// Helper function to process file metadata into FileInfo
fn create_file_info(path: &Path) -> Result<FileInfo, String> {
    // Get file metadata
    let metadata = std::fs::metadata(path).map_err(|e| {
        log_error(&format!("Failed to read metadata for {:?}: {}", path, e))
    })?;
    
    // Get file name
    let file_name = path.file_name()
        .ok_or_else(|| log_error(&format!("Could not determine filename for {:?}", path)))?
        .to_string_lossy()
        .to_string();
    
    // Get file extension
    let file_type = path.extension()
        .map(|ext| ext.to_string_lossy().to_string())
        .unwrap_or_else(|| "".to_string());
    
    // Get last modified time
    let last_modified = metadata.modified()
        .map(|time| time.duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_secs())
            .unwrap_or(0))
        .unwrap_or(0);
    
    Ok(FileInfo {
        id: uuid::Uuid::new_v4().to_string(),
        name: file_name.clone(),
        path: path.to_string_lossy().to_string(),
        original_name: file_name,
        new_name: None,
        is_directory: metadata.is_dir(),
        size: metadata.len(),
        last_modified,
        file_type,
    })
}

#[tauri::command]
fn select_files(window: tauri::Window) -> Result<Vec<FileInfo>, String> {
    println!("Rust: select_files command called");
    
    // Create channels to communicate between the callback and the command handler
    let (tx, rx) = std::sync::mpsc::channel();
    
    // Add extra logging for debugging
    println!("Rust: Attempting to open file dialog");
    
    // Use the callback-based approach
    window.dialog()
        .file()
        .add_filter("All Files", &["*"])
        .pick_files(move |file_paths| {
            // Send the result through the channel
            tx.send(file_paths).unwrap_or_else(|_| {
                println!("Rust: Failed to send file paths through channel");
            });
        });
    
    // Wait for the result with a timeout
    let file_paths = match rx.recv_timeout(std::time::Duration::from_secs(60)) {
        Ok(paths) => match paths {
            Some(paths) => {
                println!("Rust: Successfully selected {} files", paths.len());
                paths
            },
            None => {
                println!("Rust: No files selected or dialog cancelled");
                return Ok(Vec::new());
            }
        },
        Err(e) => {
            println!("Rust: Error receiving file paths: {}", e);
            return Ok(Vec::new());
        }
    };
    
    let mut files = Vec::new();
    
    // Process each selected file
    for file_path in file_paths {
        println!("Rust: Processing file: {:?}", file_path);
        
        // Get a Path from the URI
        let path_str = file_path.to_string();
        let path = std::path::Path::new(&path_str);
        
        match create_file_info(path) {
            Ok(file_info) => files.push(file_info),
            Err(e) => {
                println!("{}", e);
                continue; // Skip this file but continue processing others
            }
        }
    }
    
    println!("Rust: Returning {} files", files.len());
    Ok(files)
}

#[tauri::command]
fn select_directory(window: tauri::Window) -> Result<Option<String>, String> {
    println!("Rust: select_directory command called");
    println!("Rust: Attempting to open directory dialog");
    
    // Create channels to communicate between the callback and the command handler
    let (tx, rx) = std::sync::mpsc::channel();
    
    // Use the callback-based approach
    window.dialog()
        .file()
        .pick_folder(move |path| {
            // Send the result through the channel
            tx.send(path).unwrap_or_else(|_| {
                println!("Rust: Failed to send directory path through channel");
            });
        });
    
    // Wait for the result with a timeout
    match rx.recv_timeout(std::time::Duration::from_secs(60)) {
        Ok(path) => match path {
            Some(path) => {
                let path_str = path.to_string();
                println!("Rust: Directory selected: {:?}", path_str);
                Ok(Some(path_str))
            },
            None => {
                println!("Rust: No directory selected or dialog cancelled");
                Ok(None)
            }
        },
        Err(e) => {
            println!("Rust: Error receiving directory path: {}", e);
            Ok(None)
        }
    }
}

#[tauri::command]
fn list_directory_files(dir_path: String, files_only: Option<bool>) -> Result<Vec<FileInfo>, String> {
    println!("Rust: list_directory_files command called for: {}", dir_path);
    println!("Rust: files_only parameter: {:?}", files_only);
    
    let path = Path::new(&dir_path);
    
    if !path.exists() {
        return Err(log_error(&format!("Directory does not exist: {}", dir_path)));
    }
    
    if !path.is_dir() {
        return Err(log_error(&format!("Path is not a directory: {}", dir_path)));
    }
    
    let entries = match fs::read_dir(path) {
        Ok(entries) => entries,
        Err(e) => {
            return Err(log_error(&format!("Failed to read directory: {}", e)));
        }
    };
    
    let mut files = Vec::new();
    let should_filter_dirs = files_only.unwrap_or(false);
    
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
                
                let is_directory = metadata.is_dir();
                
                // Skip directories if files_only is true
                if should_filter_dirs && is_directory {
                    continue;
                }
                
                let file_name = match path.file_name() {
                    Some(name) => name.to_string_lossy().to_string(),
                    None => continue, // Skip entries with no file name
                };
                
                // Skip hidden files on Unix-like systems
                if file_name.starts_with(".") && !cfg!(windows) {
                    continue;
                }
                
                // Skip desktop.ini on Windows
                if cfg!(windows) && file_name.to_lowercase() == "desktop.ini" {
                    continue;
                }
                
                match create_file_info(&path) {
                    Ok(file_info) => files.push(file_info),
                    Err(e) => {
                        println!("{}", e);
                        continue;
                    }
                }
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
fn rename_files(files: Vec<FileRenameInfo>) -> Result<Vec<String>, String> {
    println!("Rust: rename_files command called for {} files", files.len());
    
    if files.is_empty() {
        return Ok(Vec::new());
    }
    
    let mut success_paths = Vec::new();
    let mut failed_paths = Vec::new();
    
    // Process in batches of 50 for better performance
    const BATCH_SIZE: usize = 50;
    
    for chunk in files.chunks(BATCH_SIZE) {
        for file in chunk {
            println!("Rust: Renaming '{}' to '{}'", file.old_path, file.new_path);
            
            let old_path = Path::new(&file.old_path);
            let new_path = Path::new(&file.new_path);
            
            if !old_path.exists() {
                println!("Rust: Source file does not exist: {}", file.old_path);
                failed_paths.push(file.old_path.clone());
                continue;
            }
            
            if let Some(parent) = new_path.parent() {
                if !parent.exists() {
                    println!("Rust: Destination directory does not exist: {:?}", parent);
                    failed_paths.push(file.old_path.clone());
                    continue;
                }
            }
            
            // Avoid renaming if source and destination are the same
            if old_path == new_path {
                println!("Rust: Source and destination paths are identical: {}", file.old_path);
                success_paths.push(file.old_path.clone());
                continue;
            }
            
            // Check if the destination already exists and is different from source
            if new_path.exists() && old_path != new_path {
                println!("Rust: Destination already exists: {}", file.new_path);
                failed_paths.push(file.old_path.clone());
                continue;
            }
            
            match fs::rename(old_path, new_path) {
                Ok(_) => {
                    println!("Rust: Successfully renamed to {:?}", new_path);
                    success_paths.push(file.old_path.clone());
                },
                Err(e) => {
                    println!("Rust: Failed to rename: {}", e);
                    failed_paths.push(file.old_path.clone());
                }
            }
        }
    }
    
    println!("Rust: Completed renaming. Success: {}, Failed: {}", 
             success_paths.len(), failed_paths.len());
    
    // Return success paths even if some failed
    if !failed_paths.is_empty() {
        println!("Rust: Warning: {} files failed to rename", failed_paths.len());
    }
    
    Ok(success_paths)
}

#[tauri::command]
fn select_directory_path(dir_path: String) -> Result<String, String> {
    println!("Rust: select_directory_path command called with: {}", dir_path);
    let path_obj = Path::new(&dir_path);
    
    if !path_obj.exists() {
        return Err(log_error(&format!("Path does not exist: {}", dir_path)));
    }
    
    if !path_obj.is_dir() {
        return Err(log_error(&format!("Path is not a directory: {}", dir_path)));
    }
    
    println!("Rust: Directory selected: {:?}", dir_path);
    Ok(dir_path)
}

// Get the full file path
#[tauri::command]
fn get_file_info(file_path: String) -> Result<FileInfo, String> {
    println!("Rust: get_file_info command called for: {}", file_path);
    
    let path_obj = Path::new(&file_path);
    
    if !path_obj.exists() {
        return Err(log_error(&format!("File does not exist: {}", file_path)));
    }
    
    create_file_info(path_obj)
}

#[tauri::command]
fn rename_file(old_path: String, new_path: String) -> Result<(), String> {
    println!("Rust: rename_file command called");
    println!("Rust: Renaming '{}' to '{}'", old_path, new_path);
    
    let path = Path::new(&old_path);
    if !path.exists() {
        return Err(log_error(&format!("Source file does not exist: {}", old_path)));
    }
    
    let new_path_obj = Path::new(&new_path);
    if let Some(parent) = new_path_obj.parent() {
        if !parent.exists() {
            return Err(log_error(&format!("Destination directory does not exist: {:?}", parent)));
        }
    }
    
    // Avoid renaming if source and destination are the same
    if path == new_path_obj {
        println!("Rust: Source and destination paths are identical, skipping rename");
        return Ok(());
    }
    
    // Check if the destination already exists and is different from source
    if new_path_obj.exists() && path != new_path_obj {
        return Err(log_error(&format!("Destination already exists: {}", new_path)));
    }
    
    match fs::rename(path, new_path_obj) {
        Ok(_) => {
            println!("Rust: Successfully renamed file");
            Ok(())
        },
        Err(e) => {
            Err(log_error(&format!("Failed to rename file: {}", e)))
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use tauri::WindowEvent;
    println!("Rust: Starting File Rename Tool backend");
    
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        // Add setup to register permissions
        .setup(|app| {
            // Enable file system access with proper permission handling
            app.handle().plugin(tauri_plugin_fs::init()).unwrap();
            // Enable dialog access with proper permission handling
            app.handle().plugin(tauri_plugin_dialog::init()).unwrap();
            
            // Log successful setup
            println!("Rust: App setup complete with permissions initialized");
            Ok(())
        })
        // Add specific handling for file dialog operations to ensure they always work
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                println!("Rust: Window close requested");
                api.prevent_close();
                
                // Simply close the window without confirmation for now
                // This avoids API compatibility issues
                window.close().unwrap();
            }
        })
        .invoke_handler(tauri::generate_handler![
            select_files,
            select_directory,
            list_directory_files,
            rename_files,
            rename_file,
            select_directory_path,
            get_file_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
