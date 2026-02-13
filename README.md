# Roll Calculator

A professional web app to calculate remaining roll footage and determine if the butt roll is suitable for storage.

## Features

- **Easy Input**: Enter your total run length and individual roll footages
- **Real-time Display**: See remaining footage updated instantly
- **Smart Alerts**: Color-coded indicators (green/red) based on 8000 ft threshold
- **Final Assessment**: Get clear guidance on whether the butt roll is ready to return to storage
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Files

- `index.html` — Main app structure
- `styles.css` — Professional styling
- `app.js` — Calculator logic
- `README.md` — This file



## How to Use

1. **Enter Total Run Length:** Input the total footage of your run
2. **Subtract Roll Footages:** For each roll used, enter its footage and click "Next"
3. **Monitor Progress:** Watch the remaining footage display
4. **View Results:** When complete, you'll see your final butt roll footage and assessment

## Color Indicators

- **Green Text** — Butt roll is 8000 ft or more (good to return to storage)
- **Red Text** — Butt roll is under 8000 ft (too small, consider getting another roll to split)

## Local Testing

To test locally:

```bash
# Using Python 3
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (no dependencies)

Designed for easy deployment and maintenance!
