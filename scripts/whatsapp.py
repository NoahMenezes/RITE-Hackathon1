import sys
import time
import webbrowser

import pyautogui


def open_whatsapp_chat(phone_number):
    # Ensure the number has the correct format (only digits, possibly with country code)
    clean_number = "".join(filter(str.isdigit, phone_number))

    # Open WhatsApp Web directly to the chat
    url = f"https://web.whatsapp.com/send?phone={clean_number}"
    print(f"Opening WhatsApp for number: {clean_number}")
    webbrowser.open(url)

    # Wait for the browser and WhatsApp Web to load
    print("Waiting for WhatsApp Web to load...")
    time.sleep(15)  # Increase if internet is slow or not logged in

    # Optional: Automatically type a starting message or just leave it ready for the user
    # pyautogui.typewrite("Hello! This is an automated message from FocusFlow.")
    # pyautogui.press('enter')

    print("Automation complete. Chat should be open.")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        target_number = sys.argv[1]
        open_whatsapp_chat(target_number)
    else:
        print("Error: No phone number provided.")
        print("Usage: python whatsapp.py <phone_number>")
