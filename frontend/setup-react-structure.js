// setup-react-structure.js
// 실행: node setup-react-structure.js

const fs = require("fs");
const path = require("path");

function ensureDir(p) {
    if (!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive: true });
        console.log("📁 폴더 생성:", p);
    } else {
        console.log("✅ 이미 존재:", p);
    }
}

console.log("🔧 React 폴더 구조 세팅 시작");

const src = path.join(__dirname, "src");
ensureDir(src);

const folders = ["api", "hooks", "pages", "components"];
folders.forEach((f) => ensureDir(path.join(src, f)));

console.log("🎉 폴더 생성 완료!");
