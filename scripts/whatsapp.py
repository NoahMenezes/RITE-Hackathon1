import sys
import time
import webbrowser

try:
    import pyautogui

    PYAUTOGUI_AVAILABLE = True
except Exception as e:
    print(f"Warning: pyautogui could not be imported or initialized ({e})")
    PYAUTOGUI_AVAILABLE = False


def open_whatsapp_chat(
    phone_number, message="Hello! This is an automated message from FocusFlow."
):
    # Ensure the number has the correct format (only digits)
    clean_number = "".join(filter(str.isdigit, phone_number))

    # Open WhatsApp Web directly to the chat
    url = f"https://web.whatsapp.com/send?phone={clean_number}"
    print(f"Opening WhatsApp for number: {clean_number}")
    webbrowser.open(url)

    # Wait for the browser and WhatsApp Web to load
    print("Waiting for WhatsApp Web to load...")
    time.sleep(15)  # Increase if internet is slow or not logged in

    if PYAUTOGUI_AVAILABLE:
        print("Typing message gracefully...")
        # Type the message with a slight delay between keystrokes for a natural feel
        pyautogui.typewrite(message, interval=0.02)
        time.sleep(0.5)
        # Press enter to send
        pyautogui.press("enter")
        print("Message sent.")
    else:
        print(
            "PyAutoGUI is unavailable. Chat opened, but automated typing was skipped."
        )

    print("Automation complete.")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_number = sys.argv[1]
        if len(sys.argv) > 2:
            open_whatsapp_chat(target_number, sys.argv[2])
        else:
            open_whatsapp_chat(target_number)
    else:
        print("Error: No phone number provided.")
        print("Usage: python whatsapp.py <phone_number> [message]")
