import sys
import webbrowser


def open_instagram_chat(insta_id):
    """
    Opens the default web browser to the Instagram chat for the provided ID.
    """
    # Clean up the ID
    clean_id = insta_id.strip()

    # Remove @ if the user included it
    if clean_id.startswith("@"):
        clean_id = clean_id[1:]

    # ig.me/m/{username} is the official deep link for Instagram direct messages
    url = f"https://ig.me/m/{clean_id}"

    print(f"Opening Instagram to message: {clean_id}")

    # Open the constructed URL in the default browser
    webbrowser.open(url)

    print("Instagram automation complete. Browser should be open.")


if __name__ == "__main__":
    # Check if an Instagram ID was passed as a command-line argument
    if len(sys.argv) > 1:
        target_id = sys.argv[1]
        open_instagram_chat(target_id)
    else:
        print("Error: No Instagram ID provided.")
        print("Usage: python instagram_automation.py <insta_id>")
