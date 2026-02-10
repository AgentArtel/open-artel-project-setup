# Multi-modal Pattern: UI Screenshot Review

## When to Use

Use this pattern when:

- Lovable agent submits UI work with screenshots
- A visual bug is reported with a screenshot
- Design compliance needs verification
- Accessibility review of rendered UI

## Pattern Overview

The reviewer receives a UI screenshot alongside the task brief. Using the Moonshot vision API, it analyzes the screenshot against the design requirements and produces a visual review report.

## Prerequisites

- A vision-capable model (`moonshot-v1-8k-vision-preview` or `kimi-k2.5`)
- Screenshot saved as PNG or JPEG (base64-encoded for API calls)
- Task brief with visual requirements

## Usage Example

### Via Kimi Overseer (Subagent)

```python
# Step 1: Create a visual reviewer subagent
CreateSubagent(
    name="visual-reviewer-TASK-201",
    system_prompt="""You are a Visual UI Reviewer subagent.

Your Mission: Review UI screenshots against design requirements.

Review Process:
1. Read the task brief to understand visual requirements
2. Analyze the screenshot for: layout, colors, typography, spacing
3. Check accessibility: contrast ratios, text readability, interactive elements
4. Compare against any design mockups or specifications
5. Identify visual bugs or deviations

Output Format:
- Visual Compliance: PASS / PARTIAL / FAIL
- Layout: Correct / Issues found
- Colors: Match spec / Deviations noted
- Typography: Correct / Issues found
- Accessibility: PASS / Issues found
- Visual Bugs: List any rendering issues
- Recommendations: Specific fixes needed"""
)

# Step 2: Dispatch the review with screenshot reference
Task(
    subagent_name="visual-reviewer-TASK-201",
    prompt="""Review the UI implementation for TASK-201.

Task brief: .ai/tasks/TASK-201.md
Screenshot: .ai/reviews/TASK-201-screenshot.png

Requirements from task brief:
- Login form with email and password fields
- Blue primary button (#0066CC)
- Error state with red border
- Responsive layout (mobile-first)

Write your review to: .ai/reviews/TASK-201-visual-review.md"""
)
```

### Via Moonshot REST API (Direct)

```python
import base64
import json
import urllib.request

# Load the screenshot
with open(".ai/reviews/TASK-201-screenshot.png", "rb") as f:
    b64_image = base64.b64encode(f.read()).decode()

# Load API key
api_key = os.environ.get("KIMI_API_KEY", "")

# Call the vision API
payload = json.dumps({
    "model": "moonshot-v1-8k-vision-preview",
    "messages": [{
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "Review this login page UI. Check: layout, colors (#0066CC primary), typography, error states, responsive design. List any issues found."
            },
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{b64_image}"}
            }
        ]
    }],
    "max_tokens": 500
}).encode()

req = urllib.request.Request(
    "https://api.moonshot.ai/v1/chat/completions",
    data=payload,
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
)

with urllib.request.urlopen(req) as resp:
    result = json.loads(resp.read())
    review = result["choices"][0]["message"]["content"]
    
    # Save review
    with open(".ai/reviews/TASK-201-visual-review.md", "w") as f:
        f.write(f"# Visual Review: TASK-201\n\n{review}\n")
```

## Expected Output

```markdown
# Visual Review: TASK-201

## Visual Compliance: PARTIAL

### Layout
- Login form centered correctly
- Fields stacked vertically (correct)
- Issue: Submit button too close to password field (needs 16px spacing)

### Colors
- Primary button: #0066CC (correct)
- Background: #FFFFFF (correct)
- Issue: Error border is orange (#FF6600), spec says red (#CC0000)

### Typography
- Headings: Correct font and size
- Input labels: Correct

### Accessibility
- Contrast ratio on primary button: 4.8:1 (PASS, minimum 4.5:1)
- Issue: Placeholder text contrast is 2.1:1 (FAIL, needs 4.5:1)

### Visual Bugs
1. Button spacing too tight (8px, should be 16px)
2. Error border color wrong (#FF6600 vs #CC0000)
3. Placeholder text low contrast

### Recommendations
1. Add `margin-top: 16px` to submit button
2. Change error border to `border-color: #CC0000`
3. Darken placeholder text to at least #767676
```

## Best Practices

- Resize screenshots to 800x600 before sending (saves tokens)
- Always include the design spec in the text prompt
- Use `moonshot-v1-8k-vision-preview` for quick checks (cheapest)
- Use `kimi-k2.5` when the reviewer also needs tool access
- Save screenshots in `.ai/reviews/` alongside the review file

