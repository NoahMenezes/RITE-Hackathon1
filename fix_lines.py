import re

with open('app/dashboard/chat/page.tsx', 'r') as f:
    lines = f.readlines()

def remove_blocks(start_idx, end_idx):
    for i in range(start_idx, end_idx):
        lines[i] = ''

# 1. Pomodoro Yes: 351 to 358 (setMessages), 371 to 372 (setIsTyping, return)
# Wait, let's find the exact indices
for i, line in enumerate(lines):
    if 'text: `🍅 **Pomodoro Session Scheduled!**' in line:
        # setMessages starts at i - 5
        for j in range(i-5, i+3):
            lines[j] = ''
    if 'toast.success("Pomodoro session scheduled!");' in line:
        # The next few lines are setTimeout, setPending, setIsTyping, return
        # We want to replace setIsTyping and return with modifying userText
        pass

with open('app/dashboard/chat/page.tsx', 'w') as f:
    f.writelines(lines)
