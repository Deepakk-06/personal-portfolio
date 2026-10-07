export const config = {
    developer: {
        name: "Deepak",
        fullName: "Deepak",
        title: "EEE Undergraduate | Building Autonomous Robots",
        description: "EEE undergraduate building autonomous robots with ROS 2, embedded systems and computer vision."
    },
    social: {
        github: "Deepakk-06",
        email: "deepakk.hq@gmail.com",
        location: "Bengaluru, Karnataka, India"
    },
    about: {
        title: "About Me",
        description: "It started with a controller. Then came the code. Then the circuits. Now I've got robots finding their way through the dark on their own, and I still want more. I always want more. I'm Deepak. When the world logs off, I log on. All night with a game, or all night with a build. Never both, never boring, never sleeping. Come closer. The best things I make happen after midnight.",
        shortDescription: "It started with a controller. Then came the code. Then the circuits. Now I've got robots finding their way through the dark on their own, and I still want more. I'm Deepak. When the world logs off, I log on. The best things I make happen after midnight."
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
            link: "https://branchlesss.vercel.app",
            github: "https://github.com/Deepakk-06/skill-match",
        },
        {
            id: 2,
            title: "Hexapod-6",
            category: "Autonomous ROS 2 Legged Robot",
            technologies: "ROS 2, NVIDIA Jetson, STM32, Python, RPLIDAR",
            image: "/images/hexapod-six.jpeg",
            description: "Six-legged ROS 2 robot on a Jetson Orin Nano with 18 STS3215 servos: custom servo driver, inverse kinematics derived from scratch (IK/FK verified to under 0.001 mm), tripod and wave gaits, and SLAM with Nav2.",
            link: "https://drive.google.com/file/d/1c_568cxnXh-NULooI7N-SExnUtUsB6nH/view?usp=sharing",
            github: "https://github.com/Deepakk-06/hexapod-6",
        },
        {
            id: 3,
            title: "Autonomous SLAM Robot with Monocular Depth Vision",
            category: "Robotics / Computer Vision",
            technologies: "ROS 2, slam_toolbox, Nav2, Raspberry Pi 4, Depth Anything V2",
            image: "/images/slam-robot.png",
            description: "ROS 2 rover with LiDAR SLAM and Nav2 on a Raspberry Pi 4, plus real-time monocular depth (Depth Anything V2) streamed to a GPU host at about 35 to 40 FPS, and ArUco relocalization.",
            link: "https://drive.google.com/file/d/1ot3MGC7jAUIMdgKHL1H_JMf2UZwRm2Ra/view?usp=sharing",
            github: "https://github.com/Deepakk-06/SENTINEL-SLAM",
        },
        {
            id: 4,
            title: "ROS 2 MPC Navigation System",
            category: "Control / Navigation",
            technologies: "ROS 2 Jazzy, Python, Gazebo, SciPy",
            image: "/images/mpc-navigation.png",
            description: "Nonlinear MPC path tracking for TurtleBot3 in Gazebo Sim: cubic-spline waypoint smoothing, a 25-step horizon, and LiDAR soft-barrier obstacle avoidance with an emergency stop.",
            link: "https://github.com/Deepakk-06/ROS2-Model-Predictive-Control-",
            github: "https://github.com/Deepakk-06/ROS2-Model-Predictive-Control-",
        },
        {
            id: 5,
            title: "Soil Grain Detection & Mapping System",
            category: "Computer Vision / Edge AI",
            technologies: "YOLOv8, OpenCV, Raspberry Pi, Folium",
            image: "/images/soil-grain-mapping.png",
            description: "YOLOv8 soil classifier (red, black, perlite, mixed) with 92% accuracy on a self-collected, self-annotated dataset. Each class maps to a GPS location on a Folium map, with ONNX and TFLite export for Raspberry Pi.",
            link: "https://www.youtube.com/watch?v=Gqag98Drhi4",
            github: "https://github.com/Deepakk-06/Soil-Grain-Detection-Mapping",
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
        email: "deepakk.hq@gmail.com",
        github: "https://github.com/Deepakk-06",
        linkedin: "https://linkedin.com/in/deepk6",
        website: "https://deepxk.vercel.app",
        phone: "+91 9606137475",
        resume: "/ds.pdf"
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
