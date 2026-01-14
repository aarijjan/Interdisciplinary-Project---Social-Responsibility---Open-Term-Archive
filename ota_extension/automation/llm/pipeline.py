import os
import json
import subprocess
import shutil
import sys

# --- CONFIG ---

# Script location and folder to be read
script_dir = os.path.dirname(os.path.abspath(__file__))
declarations_dir = os.path.join(script_dir, "declarations")

# Folders for sorting
valid_dir = os.path.join(declarations_dir, "valid")
invalid_dir = os.path.join(declarations_dir, "invalid")

base_ota_cmd = ["npx", "--yes", "--package", "@opentermsarchive/engine", "ota"]



# Helper to run shell commands and catch output
def run_command(command_list):
    # Use shell if running on windows
    use_shell = True if os.name == 'nt' else False
    try:
        result = subprocess.run(
            command_list, 
            capture_output=True, 
            text=True, 
            shell= use_shell,
            cwd=script_dir, # start process in the folder the script is run from, not where it's called from
            timeout=60
        )
        return result
    except Exception as e:
        print(f"Fehler bei Aufruf: {e}")
        return None

# Tries to read json file and hands over the dictionary
def get_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except json.JSONDecodeError:
        print(f"  [!] Fehler: Kein gültiges JSON in {file_path}")
        return None
    return data

# Move a file to target folder, create folder if it doesn't exist
def move_file(file_path, filename, destination_folder):
    if not os.path.exists(destination_folder):
        os.makedirs(destination_folder)
    
    target_path = os.path.join(destination_folder, filename)
    
    try:
        shutil.move(file_path, target_path)
        print(f"   -> Verschoben nach: {os.path.basename(destination_folder)}")
    except Exception as e:
        print(f"  [!] Fehler beim verschieben der Datei: {e}")

def main():
    # Check if the target dir exists
    if not os.path.exists(declarations_dir):
        print(f"Fehler: Ordner '{declarations_dir}' nicht gefunden.")

    # Get all files ending with .json from our directory, ignore everything that's not a file
    files = [f for f in os.listdir(declarations_dir) 
             if f.endswith('.json') and os.path.isfile(os.path.join(declarations_dir, f))]
    print(f"--- Starte Validation Pipeline für {len(files)} Dateien ---\n")

    stats = {"erfolgreich": 0, "fehlerhaft": 0}

    for filename in files:
        file_path = os.path.join(declarations_dir, filename)
        
        # Check for valid json
        json_data = get_json(file_path)
        if not json_data:
            print(f"Prüfe: {filename}")
            print("  [Übersprungen] Datei ist leer oder ungültig.")
            stats["fehlerhaft"] += 1

        # Extract the service name we need to validate via ota engine
        service_name = json_data.get("name")
        if not service_name:
            print(f"Prüfe: {filename}")
            print("  [Übersprungen] JSON enthält kein Feld 'name'.")
            stats["fehlerhaft"] += 1
            continue

        # TODO: Maybe sanitize unfixable schema errors first?

        print(f"Prüfe: {service_name} ({filename})")
        
        # Lint and fix the schema targeting by extracted service name
        lint_cmd = base_ota_cmd + ["lint", "--fix", "--services", service_name]
        lint_result = run_command(lint_cmd)

        if lint_result.returncode != 0:
            print(f"  [!] Linting Fehler: {lint_result.stderr.strip()[:100]}...")
        
        # Validate the declarations, same as above
        val_cmd = base_ota_cmd + ["validate", "declarations", "--services" , service_name]
        val_result = run_command(val_cmd)
        print("Result: " + val_result)
        print("Returncode: " + val_result.returncode)

        # Sort files depending on if human interaction is needed or no
        if val_result and val_result.returncode == 0:
            print("  [OK] Validation erfolgreich.")
            stats["erfolgreich"] += 1
            move_file(file_path, filename, valid_dir) # Move file to valid dir
        else:
            print("  [X] Declaration fehlerhaft:")
            stats["fehlerhaft"] += 1
            
            if val_result: #Parse stderr for errors
                lines = (val_result.stdout + val_result.stderr).split('\n')
                for line in lines: # Print only relevant errors, ignore stacktrace
                    if "Error" in line or "fail" in line or "selector" in line:
                        if "modules" not in line and "at " not in line: 
                            print(f"    | {line.strip()}")
            move_file(file_path, filename, invalid_dir) # Move file to invalid dir

        print("-" * 30)

    print(f"\nValidation beendet.")
    print(f"Erfolgreich: {stats['erfolgreich']}")
    print(f"Fehlerhaft: {stats['fehlerhaft']}")

if __name__ == "__main__":
    main()