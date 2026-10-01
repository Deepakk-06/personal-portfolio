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
    { name: "Arduino C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg", url: "https://www.arduino.cc/reference/en/" },
    { name: "ROS 2", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ros/ros-original.svg", url: "https://docs.ros.org/en/jazzy/" },
  ],
  [
    { name: "Navigation2", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ros/ros-original.svg", url: "https://docs.nav2.org" },
    { name: "SLAM Toolbox", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ros/ros-original.svg", url: "https://github.com/SteveMacenski/slam_toolbox" },
    { name: "AMCL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ros/ros-original.svg", url: "https://docs.ros.org/en/jazzy/p/nav2_amcl/" },
    { name: "OpenCV", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg", url: "https://opencv.org" },
    { name: "YOLOv8", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg", url: "https://docs.ultralytics.com/models/yolov8/" },
  ],
  [
    { name: "STM32", icon: "https://cdn.simpleicons.org/stmicroelectronics", url: "https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html" },
    { name: "ESP32", icon: "https://cdn.simpleicons.org/espressif", url: "https://www.espressif.com/en/products/socs/esp32" },
    { name: "NVIDIA Jetson", icon: "https://cdn.simpleicons.org/nvidia", url: "https://developer.nvidia.com/embedded-computing" },
    { name: "Raspberry Pi 4", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg", url: "https://www.raspberrypi.com/products/raspberry-pi-4-model-b/" },
  ],
  [
    { name: "Gazebo", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gazebo/gazebo-original.svg", url: "https://gazebosim.org" },
    { name: "RViz", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ros/ros-original.svg", url: "https://docs.ros.org/en/jazzy/Tutorials/Intermediate/RViz/RViz-Main.html" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", url: "https://github.com" },
    { name: "MATLAB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg", url: "https://mathworks.com/products/matlab.html" },
    { name: "KiCad", icon: "https://cdn.simpleicons.org/kicad", url: "https://www.kicad.org" },
  ],
  [
    { name: "EasyEDA", icon: "https://cdn.simpleicons.org/easyeda", url: "https://easyeda.com" },
    { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", url: "https://www.linux.org" },
    { name: "PID Control", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg", url: "https://www.mathworks.com/discovery/pid-control.html" },
    { name: "MPC", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg", url: "https://www.mathworks.com/discovery/model-predictive-control.html" },
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
