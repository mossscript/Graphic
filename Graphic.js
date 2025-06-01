/*** Graphic.js v0.01 ***/
class Graphic {
   constructor() {
      this.version = "0.01";
      this.w = 1000;
      this.h = 1000;
      this.cx = this.w / 2;
      this.cy = this.h / 2;
      this.r = Math.min(this.w, this.h) / 2;
   }
   
   #svg(inner) {
      return `<svg viewBox="0 0 ${this.w} ${this.h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
   }
   #path(d) {
      return `<path d="${d}"/>`;
   }
   #circle(cx, cy, r) {
      return `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
   }
   #ellipse(cx, cy, rx, ry, deg) {
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${deg}, ${cx}, ${cy})" fill="none" stroke="black"/>`;
   }
   
   #clampLoop(value, min, max) {
      const range = max - min + 1;
      return ((value - min) % range + range) % range + min;
   }
   #round(num) {
      return Math.round(num * 100) / 100;
   }
   
   #Q(p0, p1, p2, radius) {
      let v1 = { x: p0.x - p1.x, y: p0.y - p1.y };
      let v2 = { x: p2.x - p1.x, y: p2.y - p1.y };
      
      let len1 = Math.hypot(v1.x, v1.y);
      let len2 = Math.hypot(v2.x, v2.y);
      
      let p1a = {
         x: this.#round(p1.x + (v1.x / len1) * radius),
         y: this.#round(p1.y + (v1.y / len1) * radius)
      };
      
      let p1b = {
         x: this.#round(p1.x + (v2.x / len2) * radius),
         y: this.#round(p1.y + (v2.y / len2) * radius)
      };
      
      let cx = this.#round(p1.x);
      let cy = this.#round(p1.y);
      
      return `${p1a.x},${p1a.y} Q ${cx},${cy} ${p1b.x},${p1b.y}`;
   }
   #A(p0, p1, p2, radius, largeArcFlag = 1, sweepFlag = 1) {
      let v1 = { x: p0.x - p1.x, y: p0.y - p1.y };
      let v2 = { x: p2.x - p1.x, y: p2.y - p1.y };
      
      let len1 = Math.hypot(v1.x, v1.y);
      let len2 = Math.hypot(v2.x, v2.y);
      
      let p1a = {
         x: this.#round(p1.x + (v1.x / len1) * radius),
         y: this.#round(p1.y + (v1.y / len1) * radius)
      };
      let p1b = {
         x: this.#round(p1.x + (v2.x / len2) * radius),
         y: this.#round(p1.y + (v2.y / len2) * radius)
      };
      
      let rx = this.#round(radius);
      let ry = this.#round(radius);
      
      return `${p1a.x},${p1a.y} A ${rx},${ry} 0 ${largeArcFlag} ${sweepFlag} ${p1b.x},${p1b.y}`;
   }
   
   circle() {
      let { cx, cy, r } = this;
      return this.#svg(this.#circle(cx, cy, r))
   }
   ellipse(rx = 40, deg = 90) {
      let { cx, cy, r } = this;
      
      rx = r * (100 - this.#clampLoop(rx, 0, 100)) / 100;
      deg = this.#clampLoop(deg, 0, 360)
      
      return this.#svg(this.#ellipse(cx, cy, rx, r));
   }
   polygon(count = 3, roundPercent = 0) {
      if (count < 3) count = 3;
      
      let { cx, cy, r } = this;
      let angleStep = (2 * Math.PI) / count;
      let points = [];
      let d = ''
      
      let sideLength = 2 * r * Math.sin(Math.PI / count);
      let corner = sideLength * (this.#clampLoop(roundPercent, 0, 100) / 200);
      
      for (let i = 0; i < count; i++) {
         let angle = i * angleStep - Math.PI / 2;
         let x = this.#round(cx + r * Math.cos(angle));
         let y = this.#round(cy + r * Math.sin(angle));
         points.push({ x, y });
      }
      
      for (let i = 0; i < count; i++) {
         let p0 = points[(i - 1 + count) % count];
         let p1 = points[i];
         let p2 = points[(i + 1) % count];
         
         if (i === 0) {
            d += `M ${this.#Q(p0, p1, p2, corner)} `;
         } else {
            d += `L ${this.#Q(p0, p1, p2, corner)} `;
         }
      }
      d += 'z';
      
      return this.#svg(this.#path(d));
   }
   loop(count = 3) {
      if (count < 2) count = 2;
      let { cx, cy, r } = this;
      
      let angleStep = (2 * Math.PI) / count;
      let angle = Math.PI / count;
      
      let smallR = r * Math.sin(angle) / (1 + Math.sin(angle));
      let distance = r - smallR;
      
      let d = '';
      
      for (let i = 0; i < count; i++) {
         let a = i * angleStep - Math.PI / 2;
         let x = this.#round(cx + distance * Math.cos(a));
         let y = this.#round(cy + distance * Math.sin(a));
         d += this.#circle(x, y, this.#round(smallR));
      }
      
      return this.#svg(d);
   }
   flower(count = 3) {
      if (count < 3) count = 3;
      let { cx, cy, r } = this;
      
      let angleStep = (2 * Math.PI) / count;
      let angle = Math.PI / count;
      let smallR = r * Math.sin(angle) / (1 + Math.sin(angle));
      let distance = r - smallR;
      let points = [];
      let d = '';
      
      for (let i = 0; i < count; i++) {
         let a = i * angleStep - Math.PI / 2;
         let x = this.#round(cx + distance * Math.cos(a));
         let y = this.#round(cy + distance * Math.sin(a));
         points.push({ x, y });
      }
      
      for (let i = 0; i < count; i++) {
         let p0 = points[(i - 1 + count) % count];
         let p1 = points[i];
         let p2 = points[(i + 1) % count];
         
         if (i === 0) {
            d += `M ${this.#A(p0, p1, p2, smallR,1,1)} `;
         } else {
            d += `L ${this.#A(p0, p1, p2, smallR,1,1)} `;
         }
      }
      d += 'z';
      
      return this.#svg(this.#path(d));
   }
   thorn(count = 3) {
      if (count < 3) count = 3;
      
      let { cx, cy, r } = this;
      let angleStep = (2 * Math.PI) / count;
      let roundPercent = 100;
      let points = [];
      let d = ''
      
      let sideLength = 2 * r * Math.sin(Math.PI / count);
      let corner = sideLength * (this.#clampLoop(roundPercent, 0, 100) / 200);
      
      for (let i = 0; i < count; i++) {
         let angle = i * angleStep - Math.PI / 4;
         let x = this.#round(cx + r * Math.cos(angle));
         let y = this.#round(cy + r * Math.sin(angle));
         points.push({ x, y });
      }
      
      for (let i = 0; i < count; i++) {
         let p0 = points[(i - 1 + count) % count];
         let p1 = points[i];
         let p2 = points[(i + 1) % count];
         
         if (i === 0) {
            d += `M ${this.#A(p0, p1, p2, corner, 0, 0)} `;
         } else {
            d += `L ${this.#A(p0, p1, p2, corner, 0, 0)} `;
         }
      }
      d += 'z';
      
      return this.#svg(this.#path(d));
   }
   virus(count = 2) {
      if (count < 2) count = 2;
      count = count * 2
      let { cx, cy, r } = this;
      
      let angleStep = (2 * Math.PI) / count;
      let angle = Math.PI / count;
      let smallR = r * Math.sin(angle) / (1 + Math.sin(angle));
      let distance = r - smallR;
      let points = [];
      let d = '';
      
      for (let i = 0; i < count; i++) {
         let a = i * angleStep - Math.PI / 2;
         let x = this.#round(cx + distance * Math.cos(a));
         let y = this.#round(cy + distance * Math.sin(a));
         points.push({ x, y });
      }
      
      for (let i = 0; i < count; i++) {
         let p0 = points[(i - 1 + count) % count];
         let p1 = points[i];
         let p2 = points[(i + 1) % count];
         
         if (i === 0) {
            d += `M ${this.#A(p0, p1, p2, smallR, 1, 1)} `;
         } else if (i % 2 !== 0) {
            d += `L ${this.#A(p0, p1, p2, smallR, 0, 0)} `;
         } else {
            d += `L ${this.#A(p0, p1, p2, smallR, 1, 1)} `;
         }
      }
      d += 'z';
      
      return this.#svg(this.#path(d));
   }
   star(count = 3, wavePercent = 60, roundPercent = 0) {
      if (count < 2) count = 2;
      
      let steps = count * 2;
      let { cx, cy, r } = this;
      
      let wave = r * (this.#clampLoop(wavePercent, 0, 100) / 100);
      let d = '';
      let points = [];
      
      let angleStep = (2 * Math.PI) / steps;
      let sideLength = 2 * r * Math.sin(Math.PI / steps);
      let corner = sideLength * (this.#clampLoop(roundPercent, 0, 100) / 200);
      
      for (let i = 0; i < steps; i++) {
         let angle = i * angleStep - Math.PI / 2;
         let radius = i % 2 === 0 ? r : r - wave;
         let x = this.#round(cx + radius * Math.cos(angle));
         let y = this.#round(cy + radius * Math.sin(angle));
         points.push({ x, y });
      }
      
      for (let i = 0; i < steps; i++) {
         let p0 = points[(i - 1 + steps) % steps];
         let p1 = points[i];
         let p2 = points[(i + 1) % steps];
         
         if (i === 0) {
            d += `M ${this.#Q(p0, p1, p2, corner)} `;
         } else {
            d += `L ${this.#Q(p0, p1, p2, corner)} `;
         }
      }
      
      d += 'z';
      
      return this.#svg(this.#path(d));
   }
   biscuit(count = 3) {
      let radius = this.w / (count * 2);
      let spacing = radius * 2;
      let points = [];
      
      for (let x = 0; x < count; x++) {
         points.push({
            x: radius + x * spacing,
            y: radius
         });
      }
      for (let y = 1; y < count; y++) {
         points.push({
            x: radius + (count - 1) * spacing,
            y: radius + y * spacing
         });
      }
      for (let x = count - 2; x >= 0; x--) {
         points.push({
            x: radius + x * spacing,
            y: radius + (count - 1) * spacing
         });
      }
      for (let y = count - 2; y > 0; y--) {
         points.push({
            x: radius,
            y: radius + y * spacing
         });
      }
      
      let d = '';
      for (let i = 0; i < points.length; i++) {
         let p0 = points[(i - 1 + points.length) % points.length];
         let p1 = points[i];
         let p2 = points[(i + 1) % points.length];
         
         if (i === 0) {
            d += `M ${this.#A(p0, p1, p2, radius, 1, 1)} `;
         } else {
            d += `L ${this.#A(p0, p1, p2, radius, 1, 1)} `;
         }
      }
      d += 'z';
      
      return this.#svg(this.#path(d));
   }
}
