# Bloch Sphere Lab

A lightweight, modern Bloch Sphere visualization and education site inspired by Blochy. The site renders a responsive Three.js Bloch Sphere, lets you rotate the view, apply quantum gates, and inspect a qubit state in multiple bases.

## Features
- Interactive 3D Bloch Sphere with click-and-drag orbit controls
- Quantum gate controls for Pauli-X/Y/Z, Hadamard, S, and T
- Live display of state amplitudes in computational, Hadamard, and Y bases
- Measurement probabilities and Bloch coordinates
- Dark/light theme toggle and mobile-friendly layout
- Dedicated educational About page

## Getting Started
This is a static site. You can open `index.html` directly in a modern browser or serve the directory with a simple HTTP server.

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Project Structure
```
.
├── index.html
├── about.html
├── css/
│   ├── main.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── bloch-sphere.js
│   ├── quantum-gates.js
│   └── utils.js
├── assets/
│   ├── images/
│   └── icons/
├── LICENSE.md
└── README.md
```

## Credits
- Inspired by [Blochy](https://github.com/kherb27/Blochy) by kherb27.
- Built by Subhra Chakraborti.

## License
This project is released under the MIT License. See [LICENSE.md](LICENSE.md) for details.
