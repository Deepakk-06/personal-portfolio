import "./styles/TechStackNew.css";

interface TechItem {
  name: string;
  icon: string;
  url: string;
}

// Technologies represented in the current resume.
const techStack: TechItem[][] = [
  [
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", url: "https://python.org" },
    { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg", url: "https://en.cppreference.com/w/c" },
    { name: "Arduino", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg", url: "https://www.arduino.cc/reference/en/" },
    { name: "ROS 2", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ros/ros-original.svg", url: "https://docs.ros.org/en/jazzy/" },
  ],
  [
    { name: "OpenCV", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg", url: "https://opencv.org" },
    { name: "YOLOv8", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg", url: "https://docs.ultralytics.com/models/yolov8/" },
  ],
  [
    { name: "STM32", icon: "https://cdn.simpleicons.org/stmicroelectronics", url: "https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html" },
    { name: "ESP32", icon: "https://cdn.simpleicons.org/espressif", url: "https://www.espressif.com/en/products/socs/esp32" },
    { name: "NVIDIA Jetson", icon: "https://cdn.simpleicons.org/nvidia", url: "https://developer.nvidia.com/embedded-computing" },
    { name: "Raspberry Pi", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg", url: "https://www.raspberrypi.com/products/raspberry-pi-4-model-b/" },
  ],
  [
    { name: "Gazebo", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gazebo/gazebo-original.svg", url: "https://gazebosim.org" },
    { name: "MATLAB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg", url: "https://mathworks.com/products/matlab.html" },
    { name: "KiCad", icon: "https://cdn.simpleicons.org/kicad", url: "https://www.kicad.org" },
  ],
  [
    { name: "EasyEDA", icon: "https://cdn.simpleicons.org/easyeda", url: "https://easyeda.com" },
    { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", url: "https://www.linux.org" },
  ],
];

const TechStackNew = () => {
  return (
    <div className="techstack-new">
      {/* Video Background */}
      <div className="techstack-video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="techstack-video"
        >
          <source src="/video/video.webm" type="video/webm" />
        </video>
        {/* Dark Overlay */}
        <div className="techstack-overlay"></div>
      </div>

      {/* Content */}
      <div className="techstack-content">
        <h2>Tech Stack</h2>
        
        <div className="techstack-pyramid">
          {techStack.map((row, rowIndex) => (
            <div key={rowIndex} className="techstack-row">
              {row.map((tech, techIndex) => (
                <a
                  key={techIndex}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="techstack-item"
                  title={tech.name}
                  data-cursor="disable"
                >
                  <img src={tech.icon} alt={tech.name} loading="lazy" decoding="async" />
                  <span>{tech.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStackNew;
