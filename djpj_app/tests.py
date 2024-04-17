import subprocess
import tempfile
import os

def run_python_code(code):
    try:
        # Create a temporary Python script file
        with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
            temp_file.write(code)

        # Run the Python script using the created file
        result = subprocess.check_output(['python', temp_file.name], stderr=subprocess.STDOUT, text=True)

        return result.strip()

    except subprocess.CalledProcessError as e:
        return f"Error: {e.output.strip()}"
    finally:
        # Cleanup: Delete the temporary file
        if 'temp_file' in locals():
            temp_file.close()
            # Unlink the temporary file
            os.unlink(temp_file.name)

# Example usage with multiple lines of code
code01 = "print('Hello, world!')"
code02 = "\nfor i in range(5):"
code03 = "\n\tprint(f'This is line {i + 1}')"
python_code = code01 +  code02 + code03
python_code = code01 + code02 + code03
print(python_code)

output = run_python_code(python_code)
print("Output:", output)