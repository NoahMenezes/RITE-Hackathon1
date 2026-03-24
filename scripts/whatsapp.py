import sys
import urllib.parse
import webbrowser


def open_whatsapp_chat(
    phone_number, message="Hello! This is an automated message from FocusFlow."
):
    # Ensure the number has the correct format (only digits)
    clean_number = "".join(filter(str.isdigit, phone_number))

    # Encode the message to be passed in the URL
    encoded_message = urllib.parse.quote(message)

    # Open WhatsApp Web directly to the chat
    # Using the universal api.whatsapp.com which correctly redirects to web/desktop
    url = f"https://api.whatsapp.com/send?phone={clean_number}&text={encoded_message}"
    print(f"Opening WhatsApp for number: {clean_number}")
    webbrowser.open(url)

    print("Automation complete. Browser should be open.")


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
