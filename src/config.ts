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
            title: "branchless",
            category: "Skills-Based Opportunity Matching",
            technologies: "Browser-based workflow, Skill matching, Vercel",
            image: "/images/branchless.png",
            description: "A browser-based demo that matches a job description and resume by demonstrable skills, so students are evaluated by the work they can show rather than an eligibility rule.",
            link: "https://branchlesss.vercel.app"
        },
        {
            id: 2,
            title: "Hexapod-6",
            category: "Autonomous ROS 2 Legged Robot",
            technologies: "ROS 2, NVIDIA Jetson, STM32, Python, RPLIDAR",
            image: "/images/hexapod-six.jpeg",
            description: "Six-legged autonomous robot with a Jetson for high-level compute and an STM32 for real-time servo control. IMU feedback keeps the gait stable on uneven terrain, with LiDAR SLAM mapping the environment.",
            link: "https://drive.google.com/file/d/1c_568cxnXh-NULooI7N-SExnUtUsB6nH/view?usp=sharing"
        },
        {
            id: 3,
            title: "Autonomous SLAM Robot with Monocular Depth Vision",
            category: "Robotics / Computer Vision",
            technologies: "ROS 2, TurtleBot, Raspberry Pi 4, Depth Anything V2, GPU",
            image: "/images/slam-robot.png",
            description: "ROS 2 TurtleBot with SLAM Toolbox mapping and navigation. Depth Anything V2 runs on a GPU host while the Raspberry Pi handles sensing and control, reaching about 40 FPS end to end.",
            link: "https://drive.google.com/file/d/1ot3MGC7jAUIMdgKHL1H_JMf2UZwRm2Ra/view?usp=sharing"
        },
        {
            id: 4,
            title: "ROS 2 MPC Navigation System",
            category: "Control / Navigation",
            technologies: "ROS 2 Jazzy, Python, Gazebo, SciPy",
            image: "/images/mpc-navigation.png",
            description: "Nonlinear MPC path tracking for TurtleBot3 over a 15-step horizon, with cubic spline smoothing and LiDAR soft-barrier obstacle avoidance so the robot slows and reroutes instead of stopping abruptly.",
            link: "https://github.com/Deepakk-06/ROS2-Model-Predictive-Control-"
        },
        {
            id: 5,
            title: "Soil Grain Detection & Mapping System",
            category: "Computer Vision / Edge AI",
            technologies: "YOLOv8, OpenCV, Raspberry Pi, Folium",
            image: "/images/soil-grain-mapping.png",
            description: "YOLOv8 soil grain classifier with 92% detection accuracy on a custom dataset, running real-time on Raspberry Pi with GPS-tagged detections shown on an interactive Folium map.",
            link: "https://www.youtube.com/watch?v=Gqag98Drhi4"
        },
        {
            id: 6,
            title: "24V DC Motor Control PCB",
            category: "Hardware / PCB Design",
            technologies: "STM32F103C8T6, BTS7960B, ESP8266, EasyEDA",
            image: "/images/motor-control-pcb.png",
            description: "Designed a 24V DC motor control PCB featuring an STM32F103C8T6, BTS7960B H-bridge and ESP8266 Wi-Fi module. Integrated encoder feedback, PWM motor control, current, voltage and temperature sensing, limit switches, and 24V power protection. Completed the schematic and PCB layout with dedicated 5V and 3.3V power rails."
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
