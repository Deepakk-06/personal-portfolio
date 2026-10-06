import { useEffect, useRef } from "react";
import "./styles/TechStackNew.css";

interface TechItem {
  name: string;
  icon?: string;
  logo?: string; // wide wordmark logo (shown in white), used instead of icon
  suffix?: string; // text that follows the logo, e.g. "2" in "ROS 2"
  wide?: boolean; // spans two columns
  mono?: boolean; // dark single-colour logo, drawn in white so it stays visible
  url: string;
}

// Technologies represented in the current resume.
type Accent = "lime" | "pink" | "cyan";

interface TechGroup {
  label: string;
  accent: Accent;
  items: TechItem[];
}

// Technologies represented in the current resume, grouped like equipment slots.
const groups: TechGroup[] = [
  {
    label: "CODE",
    accent: "lime",
    items: [
      // Official ROS logo (nine dots + ROS) from github.com/ros-infrastructure/artwork, followed by "2" as Open Robotics suggests.
      // Subject to the ROS trademark policy (https://www.ros.org/blog/media/) and CC BY-NC 4.0.
      { name: "ROS 2", logo: "/images/ros-logo.svg", suffix: "2", wide: true, url: "https://docs.ros.org/en/jazzy/" },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", url: "https://python.org" },
      { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", url: "https://en.cppreference.com/w/c" },
      { name: "Arduino", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg", url: "https://www.arduino.cc/reference/en/" },
    ],
  },
  {
    label: "HARDWARE",
    accent: "cyan",
    items: [
      { name: "STM32", icon: "https://cdn.simpleicons.org/stmicroelectronics", mono: true, url: "https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html" },
      { name: "ESP32", icon: "https://cdn.simpleicons.org/espressif", url: "https://www.espressif.com/en/products/socs/esp32" },
      { name: "NVIDIA Jetson", icon: "https://cdn.simpleicons.org/nvidia", url: "https://developer.nvidia.com/embedded-computing" },
      { name: "Raspberry Pi", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg", url: "https://www.raspberrypi.com/products/raspberry-pi-4-model-b/" },
    ],
  },
  {
    label: "VISION",
    accent: "pink",
    items: [
      { name: "OpenCV", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg", url: "https://opencv.org" },
      { name: "YOLOv8", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg", url: "https://docs.ultralytics.com/models/yolov8/" },
    ],
  },
  {
    label: "SIM & DESIGN",
    accent: "lime",
    items: [
      { name: "Gazebo", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gazebo/gazebo-original.svg", url: "https://gazebosim.org" },
      { name: "MATLAB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg", url: "https://mathworks.com/products/matlab.html" },
      { name: "KiCad", icon: "https://cdn.simpleicons.org/kicad", url: "https://www.kicad.org" },
    ],
  },
  {
    label: "PCB & SYSTEM",
    accent: "pink",
    items: [
      { name: "EasyEDA", icon: "https://cdn.simpleicons.org/easyeda", url: "https://easyeda.com" },
      { name: "Linux", icon: "https://cdn.simpleicons.org/linux", url: "https://www.linux.org" },
    ],
  },
];

const total = groups.reduce((n, g) => n + g.items.length, 0);
const pad = (n: number) => String(n).padStart(2, "0");

const TechStackNew = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  // Panels fade and stagger in as they scroll into view. Without JS everything stays visible.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const panels = Array.from(grid.querySelectorAll<HTMLElement>(".ts-group"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    grid.classList.add("ts-armed");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ts-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    panels.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);

  return (
    <div className="techstack-new">
      {/* Video Background */}
      <div className="techstack-video-container">
        <div className="techstack-glow" aria-hidden="true"></div>
        <div className="techstack-grid" aria-hidden="true"></div>
        <div className="techstack-scan" aria-hidden="true"></div>
        {/* Dark Overlay */}
        <div className="techstack-overlay"></div>
      </div>

      {/* Content */}
      <div className="techstack-content">
        <h2>Tech Stack</h2>
        <p className="ts-sub" aria-hidden="true">
          &gt; LOADOUT<span className="ts-cursor">_</span> · {total} ITEMS EQUIPPED
        </p>

        <div className="ts-grid" ref={gridRef}>
          {groups.map((group, gi) => (
            <section key={group.label} className={`ts-group ts-${group.accent} ts-g${gi}`} style={{ "--i": gi } as React.CSSProperties}>
              <header className="ts-head">
                <span className="ts-idx">{pad(gi + 1)}</span>
                <h3>{group.label}</h3>
                <span className="ts-count">{pad(group.items.length)} SLOTS</span>
              </header>
              <div className="ts-slots">
                {group.items.map((tech, ti) => (
                  <a
                    key={tech.name}
                    href={tech.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`ts-slot${tech.wide ? " is-wide" : ""}`}
                    title={tech.name}
                    data-cursor="disable"
                    style={{ "--d": ti } as React.CSSProperties}
                  >
                    <span className={`ts-icon${tech.mono ? " is-mono" : ""}${tech.logo ? " has-logo" : ""}`}>
                      {tech.logo ? (
                        <span className="ts-logo">
                          <img src={tech.logo} alt="" decoding="async" />
                          {tech.suffix && <b aria-hidden="true">{tech.suffix}</b>}
                        </span>
                      ) : (
                        <img src={tech.icon} alt="" loading="lazy" decoding="async" />
                      )}
                    </span>
                    <span className="ts-name">{tech.name}</span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackNew;
