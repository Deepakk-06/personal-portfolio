export const config = {
    developer: {
        name: "Deepak",
        fullName: "Deepak K",
        title: "EEE Undergraduate | Robotics, Embedded Systems & Autonomous Navigation",
        description: "EEE undergraduate building autonomous robots with ROS 2, embedded systems and computer vision."
    },
    social: {
        github: "Deepakk-06",
        email: "deeeeps06@gmail.com",
        location: "Bengaluru, Karnataka, India"
    },
    about: {
        title: "About Me",
        description: "It started with a controller. Then came the code. Then the circuits. Now I've got robots finding their way through the dark on their own, and I still want more. I always want more. I'm Deepak. When the world logs off, I log on. All night with a game, or all night with a build. Never both, never boring, never sleeping. Come closer. The best things I make happen after midnight."
    },
    experiences: [
        {
            position: "B.E. in Electrical and Electronics Engineering",
            company: "New Horizon College of Engineering, Bengaluru",
            period: "2023 - Present",
            location: "Bengaluru, Karnataka",
            description: "CGPA 9.13/10 through 3rd year (graduating May 2027). Coursework: Embedded Systems, Control Systems, Microcontrollers, Electronics Circuits, VLSI Design.",
            responsibilities: [],
            technologies: ["Embedded Systems", "Control Systems", "Microcontrollers", "VLSI Design"]
        },
        {
            position: "Project Committee Member",
            company: "Embedded Systems Club, New Horizon College of Engineering",
            period: "2024 - 2025",
            location: "Bengaluru, Karnataka",
            description: "Organized embedded systems workshops for student communities and collaborated on club projects involving sensor integration, circuit design and embedded programming.",
            responsibilities: [],
            technologies: ["Embedded Systems", "Sensor Integration", "Circuit Design"]
        },
        {
            position: "Pre-University Course (PCME)",
            company: "St. Francis Composite PU College, Bengaluru",
            period: "2022",
            location: "Bengaluru, Karnataka",
            description: "Graduated with 92.17%.",
            responsibilities: [],
            technologies: []
        }
    ],
    projects: [
        {
            id: 1,
            title: "Hexapod-6",
            category: "Autonomous ROS 2 Legged Robot",
            technologies: "ROS 2, NVIDIA Jetson, STM32, Python, RPLIDAR",
            image: "/images/hexapod.webp",
            description: "Six-legged autonomous robot with a Jetson for high-level compute and an STM32 for real-time servo control. IMU feedback keeps the gait stable on uneven terrain, with LiDAR SLAM mapping the environment.",
            link: "https://drive.google.com/file/d/1c_568cxnXh-NULooI7N-SExnUtUsB6nH/view?usp=sharing"
        },
        {
            id: 2,
            title: "Autonomous SLAM Robot with Monocular Depth Vision",
            category: "Robotics / Computer Vision",
            technologies: "ROS 2, TurtleBot, Raspberry Pi 4, Depth Anything V2, GPU",
            image: "/images/slam-depth.webp",
            description: "ROS 2 TurtleBot with SLAM Toolbox mapping and navigation. Depth Anything V2 runs on a GPU host while the Raspberry Pi handles sensing and control, reaching about 40 FPS end to end.",
            link: "https://drive.google.com/file/d/1ot3MGC7jAUIMdgKHL1H_JMf2UZwRm2Ra/view?usp=sharing"
        },
        {
            id: 3,
            title: "ROS 2 MPC Navigation System",
            category: "Control / Navigation",
            technologies: "ROS 2 Jazzy, Python, Gazebo, SciPy",
            image: "/images/mpc-nav.webp",
            description: "Nonlinear MPC path tracking for TurtleBot3 over a 15-step horizon, with cubic spline smoothing and LiDAR soft-barrier obstacle avoidance so the robot slows and reroutes instead of stopping abruptly.",
            link: "https://github.com/Deepakk-06/ROS2-Model-Predictive-Control-"
        },
        {
            id: 4,
            title: "Soil Grain Detection & Mapping System",
            category: "Computer Vision / Edge AI",
            technologies: "YOLOv8, OpenCV, Raspberry Pi, Folium",
            image: "/images/soil-yolo.webp",
            description: "YOLOv8 soil grain classifier with 92% detection accuracy on a custom dataset, running real-time on Raspberry Pi with GPS-tagged detections shown on an interactive Folium map.",
            link: "https://www.youtube.com/watch?v=Gqag98Drhi4"
        },
        {
            id: 5,
            title: "PID Line-Following Robot",
            category: "Embedded Systems",
            technologies: "Arduino, C, PID Control, CAD",
            image: "/images/pid-line.webp",
            description: "Custom CAD-designed chassis with optimised sensor placement and a C-based PID controller for smoother, more accurate tracking than basic threshold control.",
            link: "https://github.com/Deepakk-06/PID-Line-Following-Robot"
        },
        {
            id: 6,
            title: "TeleOperated Mobile Manipulation Platform",
            category: "Robotics / Embedded",
            technologies: "ESP32, Kinematics, Arduino IDE, Bluetooth",
            image: "/images/teleop-arm.webp",
            description: "Teleoperated mobile robot with a 4-DOF robotic arm, using forward and inverse kinematics and Bluetooth real-time control for precise end-effector positioning.",
            link: "https://github.com/Deepakk-06"
        }
    ],
    contact: {
        email: "deeeeps06@gmail.com",
        github: "https://github.com/Deepakk-06",
        linkedin: "https://linkedin.com/in/deepk6",
        website: "https://deepxk.vercel.app",
        phone: "+91 9606137475",
        resume: "/Deepak_K_Resume.pdf"
    },
    skills: {
        develop: {
            title: "ROBOTICS & AUTONOMY",
            description: "ROS 2 navigation, SLAM and sensor fusion",
            details: "Building autonomous robots on ROS 2 Jazzy: LiDAR SLAM, Monte Carlo localization, Navigation2 and nonlinear MPC path tracking, tested in Gazebo and on TurtleBot, hexapod and Jetson hardware.",
            tools: ["ROS 2 (Jazzy)", "micro-ROS", "Navigation2", "SLAM Toolbox", "AMCL", "URDF", "Behavior Trees", "TF Transforms", "LiDAR SLAM", "Sensor Fusion", "Path Planning", "Gazebo", "RViz"]
        },
        design: {
            title: "EMBEDDED & VISION",
            description: "Real-time control, firmware and computer vision",
            details: "Programming microcontrollers and single-board computers for real-time control, and deploying YOLOv8 and OpenCV vision pipelines on edge hardware.",
            tools: ["Arduino C", "C", "Python", "ESP32", "STM32", "Raspberry Pi 4", "NVIDIA Jetson", "PID", "MPC", "Kinematics", "YOLOv8", "OpenCV", "Deep Learning", "Reinforcement Learning"]
        }
    }
};
