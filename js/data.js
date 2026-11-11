/* =========================================================
   LearnSphere Academy — Central demo content
   Edit this file to update courses, instructors, reviews, etc.
   All people, metrics and testimonials are DEMONSTRATION DATA.
   ========================================================= */
(function () {
  "use strict";

  function lesson(title, duration, preview) {
    return { title: title, duration: duration, preview: !!preview };
  }

  function mod(title, lessons) {
    return { title: title, lessons: lessons };
  }

  function build(course) {
    var total = 0;
    course.modules.forEach(function (module) {
      total += module.lessons.length;
    });
    course.lessons = total;
    return course;
  }

  var instructors = [
    {
      id: "ananya-rao",
      name: "Ananya Rao",
      role: "Senior Full-Stack Engineer & Educator",
      qualification: "M.Tech, Computer Science (sample profile)",
      experience: "9 years",
      expertise: ["Web Development", "JavaScript", "System Design"],
      bio: "Ananya builds product interfaces and teaches web development with a focus on clean architecture, accessibility and real project workflows.",
      courses: ["web-development"],
      image: "instructor-1.webp",
      socials: { linkedin: "https://www.linkedin.com/", twitter: "https://x.com/", github: "https://github.com/" },
      demo: true
    },
    {
      id: "rohan-mehta",
      name: "Rohan Mehta",
      role: "Python & Automation Mentor",
      qualification: "B.E., Information Technology (sample profile)",
      experience: "7 years",
      expertise: ["Python", "Automation", "Backend APIs"],
      bio: "Rohan simplifies programming fundamentals through small, practical builds. His sessions focus on writing readable code and solving real problems.",
      courses: ["python-programming"],
      image: "instructor-2.webp",
      socials: { linkedin: "https://www.linkedin.com/", twitter: "https://x.com/", github: "https://github.com/" },
      demo: true
    },
    {
      id: "meera-iyer",
      name: "Meera Iyer",
      role: "Algorithms & Problem-Solving Mentor",
      qualification: "M.Sc., Computer Science (sample profile)",
      experience: "8 years",
      expertise: ["Data Structures", "Algorithms", "Interview Prep"],
      bio: "Meera helps learners break complex problems into patterns. She teaches data structures with visual explanations and guided practice.",
      courses: ["dsa"],
      image: "instructor-3.webp",
      socials: { linkedin: "https://www.linkedin.com/", twitter: "https://x.com/", github: "https://github.com/" },
      demo: true
    },
    {
      id: "arjun-nair",
      name: "Arjun Nair",
      role: "Systems Programming Instructor",
      qualification: "B.Tech, Electronics & Communication (sample profile)",
      experience: "10 years",
      expertise: ["C", "C++", "Operating Systems"],
      bio: "Arjun believes strong fundamentals make every language easier. He teaches memory, pointers and object-oriented thinking from first principles.",
      courses: ["c-programming", "cpp-programming"],
      image: "instructor-4.webp",
      socials: { linkedin: "https://www.linkedin.com/", twitter: "https://x.com/", github: "https://github.com/" },
      demo: true
    },
    {
      id: "sana-kapoor",
      name: "Sana Kapoor",
      role: "Data & Database Educator",
      qualification: "MCA, Data Systems (sample profile)",
      experience: "6 years",
      expertise: ["Databases", "SQL", "Data Analytics"],
      bio: "Sana makes data approachable, from writing your first SQL query to turning messy datasets into decisions with clear visual stories.",
      courses: ["dbms", "data-analytics"],
      image: "instructor-5.webp",
      socials: { linkedin: "https://www.linkedin.com/", twitter: "https://x.com/", github: "https://github.com/" },
      demo: true
    },
    {
      id: "vikram-shah",
      name: "Vikram Shah",
      role: "AI & Machine Learning Researcher",
      qualification: "Ph.D., Machine Learning (sample profile)",
      experience: "11 years",
      expertise: ["Artificial Intelligence", "Machine Learning", "Python"],
      bio: "Vikram teaches AI through intuition first and code second, helping learners understand models before training them on meaningful projects.",
      courses: ["artificial-intelligence", "machine-learning"],
      image: "instructor-6.webp",
      socials: { linkedin: "https://www.linkedin.com/", twitter: "https://x.com/", github: "https://github.com/" },
      demo: true
    },
    {
      id: "nisha-verma",
      name: "Nisha Verma",
      role: "Design & Motion Educator",
      qualification: "B.Des., Visual Communication (sample profile)",
      experience: "7 years",
      expertise: ["Graphic Design", "Video Editing", "Branding"],
      bio: "Nisha helps students build taste and technique together, with critique-led lessons in typography, layout, colour and motion storytelling.",
      courses: ["graphic-design", "video-editing"],
      image: "instructor-7.webp",
      socials: { linkedin: "https://www.linkedin.com/", twitter: "https://x.com/", github: "https://github.com/" },
      demo: true
    },
    {
      id: "kabir-bose",
      name: "Kabir Bose",
      role: "IT Foundations & Digital Skills Mentor",
      qualification: "B.Sc., Information Systems (sample profile)",
      experience: "8 years",
      expertise: ["Computer Fundamentals", "Productivity Tools", "Digital Literacy"],
      bio: "Kabir specialises in friendly first steps: files, operating systems, the web, spreadsheets and the confidence to keep learning.",
      courses: ["computer-fundamentals"],
      image: "instructor-8.webp",
      socials: { linkedin: "https://www.linkedin.com/", twitter: "https://x.com/", github: "https://github.com/" },
      demo: true
    }
  ];

  var courses = [
    build({
      slug: "web-development",
      image: "course-web-development.webp",
      title: "Full-Stack Web Development",
      code: "LS-WD-01",
      category: "Web Development",
      level: "Intermediate",
      tone: "lavender",
      icon: "code",
      price: 1899,
      originalPrice: 2999,
      rating: 4.9,
      reviewCount: 312,
      students: 2480,
      duration: "36 hours",
      language: "English",
      featured: true,
      updated: "August 2026",
      short: "Build responsive, accessible and production-ready websites from front to back.",
      description:
        "A project-led path through modern web development. You will build interfaces with semantic HTML and CSS, add behaviour with JavaScript, connect a backend API and ship a complete portfolio project.",
      overview:
        "This course is designed for learners who know the basics of HTML and want to build complete, reliable web products. Each module pairs a short concept lesson with a hands-on build, so you always know why a technique matters and where to use it. You will finish with a deployed full-stack application and a codebase you can discuss confidently in interviews.",
      outcomes: [
        "Structure accessible pages with semantic HTML",
        "Create responsive layouts with Grid and Flexbox",
        "Write modern, modular JavaScript",
        "Connect interfaces to a backend API",
        "Handle authentication and form data safely",
        "Deploy and document a portfolio project"
      ],
      requirements: [
        "Comfortable using a computer and a code editor",
        "Basic familiarity with HTML tags",
        "No prior backend experience required"
      ],
      modules: [
        mod("Foundations of the web", [
          lesson("How the web works", "18 min", true),
          lesson("Semantic HTML and document structure", "26 min"),
          lesson("CSS fundamentals and the box model", "31 min"),
          lesson("Responsive design with Grid and Flexbox", "38 min")
        ]),
        mod("JavaScript & interaction", [
          lesson("Variables, functions and scope", "29 min"),
          lesson("The DOM and event handling", "34 min"),
          lesson("Fetch, promises and async patterns", "36 min"),
          lesson("Building an interactive course catalogue", "48 min")
        ]),
        mod("Full-stack project", [
          lesson("Designing the API contract", "24 min"),
          lesson("Authentication and protected routes", "39 min"),
          lesson("Testing and debugging your app", "27 min"),
          lesson("Deploying and presenting your project", "33 min")
        ])
      ]
    }),
    build({
      slug: "python-programming",
      image: "course-python-programming.webp",
      title: "Python Programming",
      code: "LS-PY-02",
      category: "Programming",
      level: "Beginner",
      tone: "mist",
      icon: "terminal",
      price: 999,
      originalPrice: 1799,
      rating: 4.8,
      reviewCount: 486,
      students: 3120,
      duration: "28 hours",
      language: "English",
      featured: true,
      updated: "September 2026",
      short: "Learn Python from zero with small projects, clean code habits and guided practice.",
      description:
        "A calm, practical introduction to Python. Start with your first script, then progress to data structures, files, APIs and a capstone project that solves a real everyday problem.",
      overview:
        "Python is one of the most approachable ways to learn programming. This course avoids jargon-heavy theory and focuses on writing, running and improving code from day one. You will build a budget tracker, a file organiser and a small API-powered tool while developing habits that transfer to any language.",
      outcomes: [
        "Run Python scripts and use the standard library",
        "Work confidently with lists, dictionaries and loops",
        "Write reusable functions and small modules",
        "Read and write files and handle errors",
        "Consume a public API with requests",
        "Complete a practical Python project"
      ],
      requirements: [
        "A laptop or desktop computer",
        "No programming experience needed",
        "Curiosity and 30 minutes of practice per lesson"
      ],
      modules: [
        mod("Your first Python steps", [
          lesson("Installing Python and your editor", "14 min", true),
          lesson("Variables, input and output prints", "22 min"),
          lesson("Making decisions with conditions", "25 min"),
          lesson("Repeating work with loops", "28 min")
        ]),
        mod("Working with data", [
          lesson("Lists, tuples and dictionaries", "32 min"),
          lesson("Functions and reusable logic", "30 min"),
          lesson("Files, paths and exceptions", "35 min"),
          lesson("Project: personal budget tracker", "44 min")
        ]),
        mod("Practical Python", [
          lesson("Modules, packages and virtual envs", "24 min"),
          lesson("Calling APIs with requests", "31 min"),
          lesson("Project: weather-aware daily planner", "41 min"),
          lesson("Next steps and code review checklist", "18 min")
        ])
      ]
    }),
    build({
      slug: "c-programming",
      image: "course-c-programming.webp",
      title: "C Programming",
      code: "LS-C-03",
      category: "Programming",
      level: "Beginner",
      tone: "slate",
      icon: "cpu",
      price: 699,
      originalPrice: 1299,
      rating: 4.7,
      reviewCount: 214,
      students: 1860,
      duration: "22 hours",
      language: "English",
      featured: false,
      updated: "July 2026",
      short: "Master the language behind operating systems, compilers and embedded devices.",
      description:
        "Understand how programs really work. This course builds a solid mental model of memory, pointers, functions and data structures using the C language.",
      overview:
        "C is small, fast and honest about what the computer is doing. Learning it makes every other language clearer. You will compile real programs, explore memory with pointers, structure code with functions and finish with a small command-line application.",
      outcomes: [
        "Compile and debug C programs",
        "Use variables, operators and control flow",
        "Understand arrays, strings and pointers",
        "Allocate and manage memory responsibly",
        "Organise code with functions and headers",
        "Build a command-line mini project"
      ],
      requirements: [
        "A computer with a C compiler installed",
        "Basic comfort with files and folders",
        "No prior C experience required"
      ],
      modules: [
        mod("C fundamentals", [
          lesson("Setting up GCC and running your first program", "16 min", true),
          lesson("Data types, variables and constants", "23 min"),
          lesson("Operators and expressions", "21 min"),
          lesson("Conditions and switches", "25 min")
        ]),
        mod("Memory & structure", [
          lesson("Functions, scope and recursion", "30 min"),
          lesson("Arrays and strings in depth", "34 min"),
          lesson("Pointers without fear", "38 min"),
          lesson("Structures and typedefs", "28 min")
        ]),
        mod("Building a real program", [
          lesson("Dynamic memory with malloc and free", "32 min"),
          lesson("File input and output", "27 min"),
          lesson("Debugging with GDB", "26 min"),
          lesson("Project: contact book CLI", "45 min")
        ])
      ]
    }),
    build({
      slug: "cpp-programming",
      image: "course-cpp-programming.webp",
      title: "C++ Programming",
      code: "LS-CPP-04",
      category: "Programming",
      level: "Intermediate",
      tone: "sage",
      icon: "layers",
      price: 899,
      originalPrice: 1599,
      rating: 4.8,
      reviewCount: 198,
      students: 1420,
      duration: "26 hours",
      language: "English",
      featured: false,
      updated: "August 2026",
      short: "Move from procedural C to expressive, object-oriented C++ with modern patterns.",
      description:
        "A structured transition into C++ for learners who know the basics. Explore classes, the STL, references and modern C++ features through buildable examples.",
      overview:
        "C++ combines low-level control with high-level expression. This course helps you use that power deliberately: classes with clear responsibilities, containers that fit the problem and RAII patterns that keep resources safe. Every module ends with a small, testable program.",
      outcomes: [
        "Write clean classes and constructors",
        "Use references, const and smart pointers",
        "Work with the standard template library",
        "Apply inheritance and composition appropriately",
        "Handle errors with exceptions",
        "Build a small object-oriented application"
      ],
      requirements: [
        "Familiarity with variables, loops and functions",
        "Basic C knowledge is helpful but not required",
        "A C++ compiler and code editor"
      ],
      modules: [
        mod("From C to C++", [
          lesson("Compiling C++ and using namespaces", "17 min", true),
          lesson("References, const and function overloading", "28 min"),
          lesson("Classes, objects and constructors", "33 min"),
          lesson("Encapsulation and clean interfaces", "27 min")
        ]),
        mod("Modern C++ toolkit", [
          lesson("Vectors, maps and algorithms", "36 min"),
          lesson("Smart pointers and RAII", "34 min"),
          lesson("Inheritance and polymorphism", "32 min"),
          lesson("Templates and generic thinking", "29 min")
        ]),
        mod("Build with confidence", [
          lesson("Exceptions and resource safety", "25 min"),
          lesson("CMake and project structure", "23 min"),
          lesson("Debugging and performance basics", "30 min"),
          lesson("Project: inventory manager", "46 min")
        ])
      ]
    }),
    build({
      slug: "dsa",
      image: "course-dsa.webp",
      title: "Data Structures & Algorithms",
      code: "LS-DSA-05",
      category: "Programming",
      level: "Advanced",
      tone: "lavender",
      icon: "shapes",
      price: 1499,
      originalPrice: 2499,
      rating: 4.9,
      reviewCount: 358,
      students: 2740,
      duration: "40 hours",
      language: "English",
      featured: true,
      updated: "September 2026",
      short: "Think in patterns, choose the right structure and solve problems with confidence.",
      description:
        "A visual, practice-first course in data structures and algorithms. Learn how to analyse problems, select the right approach and explain your solution clearly.",
      overview:
        "This course is about pattern recognition, not memorising solutions. You will explore arrays, linked lists, trees, graphs and dynamic programming through diagrams, guided walkthroughs and weekly problem sets. The final module brings everything together in timed, interview-style practice.",
      outcomes: [
        "Analyse time and space complexity",
        "Choose appropriate data structures",
        "Implement lists, stacks, queues and trees",
        "Traverse and search graphs",
        "Apply recursion and dynamic programming",
        "Explain solutions clearly under time pressure"
      ],
      requirements: [
        "Comfort with one programming language",
        "Basic loops, functions and arrays",
        "Willingness to practise between lessons"
      ],
      modules: [
        mod("Complexity & linear structures", [
          lesson("Big-O in plain language", "24 min", true),
          lesson("Arrays, strings and two pointers", "36 min"),
          lesson("Linked lists and memory patterns", "34 min"),
          lesson("Stacks, queues and monotonic ideas", "38 min")
        ]),
        mod("Trees, heaps & hashing", [
          lesson("Binary trees and traversals", "35 min"),
          lesson("Binary search trees", "30 min"),
          lesson("Heaps and priority queues", "33 min"),
          lesson("Hash maps and collision handling", "31 min")
        ]),
        mod("Graphs & optimisation", [
          lesson("Graph representations", "27 min"),
          lesson("BFS, DFS and connected components", "39 min"),
          lesson("Shortest paths and spanning trees", "42 min"),
          lesson("Greedy strategies and when they fail", "34 min")
        ]),
        mod("Patterns & practice", [
          lesson("Recursion and backtracking", "38 min"),
          lesson("Dynamic programming from first principles", "45 min"),
          lesson("Sliding window and binary search patterns", "32 min"),
          lesson("Interview simulation and review", "40 min")
        ])
      ]
    }),
    build({
      slug: "dbms",
      image: "course-dbms.webp",
      title: "Database Management Systems",
      code: "LS-DB-06",
      category: "Database",
      level: "Intermediate",
      tone: "sand",
      icon: "database",
      price: 999,
      originalPrice: 1699,
      rating: 4.6,
      reviewCount: 176,
      students: 1180,
      duration: "24 hours",
      language: "English",
      featured: false,
      updated: "June 2026",
      short: "Design, query and understand the databases behind reliable applications.",
      description:
        "Learn relational modelling, practical SQL and the core ideas that keep data correct, fast and secure.",
      overview:
        "Good applications rest on good data design. This course covers entity relationships, normalisation and SQL from basic queries to joins and transactions. You will model a real booking system, write queries against it and improve performance with indexes.",
      outcomes: [
        "Design normalised relational schemas",
        "Write SQL queries with joins and grouping",
        "Use constraints to protect data quality",
        "Understand transactions and isolation",
        "Read query plans and add useful indexes",
        "Model and build a small booking database"
      ],
      requirements: [
        "Basic computer literacy",
        "No SQL experience required",
        "A local or browser-based SQL environment"
      ],
      modules: [
        mod("Relational foundations", [
          lesson("Why relational databases still matter", "15 min", true),
          lesson("Entities, relationships and keys", "28 min"),
          lesson("Normalisation up to 3NF", "32 min"),
          lesson("Constraints and data integrity", "24 min")
        ]),
        mod("SQL in practice", [
          lesson("SELECT, filtering and sorting", "26 min"),
          lesson("Joins and set operations", "35 min"),
          lesson("Aggregation and window functions", "38 min"),
          lesson("Views and stored procedures", "30 min")
        ]),
        mod("Performance & transactions", [
          lesson("ACID and transaction isolation", "29 min"),
          lesson("Indexes and query plans", "34 min"),
          lesson("Backups, permissions and safety", "22 min"),
          lesson("Project: studio booking database", "48 min")
        ])
      ]
    }),
    build({
      slug: "artificial-intelligence",
      image: "course-artificial-intelligence.webp",
      title: "Artificial Intelligence",
      code: "LS-AI-07",
      category: "Artificial Intelligence",
      level: "Advanced",
      tone: "mist",
      icon: "brain",
      price: 2199,
      originalPrice: 3499,
      rating: 4.9,
      reviewCount: 241,
      students: 1650,
      duration: "34 hours",
      language: "English",
      featured: true,
      updated: "October 2026",
      short: "Understand the ideas shaping AI and build intelligent systems responsibly.",
      description:
        "A rigorous but accessible tour of modern artificial intelligence, from search and reasoning to neural networks and responsible deployment.",
      overview:
        "AI is more than a single technique. This course follows the field's core ideas: representing knowledge, searching for solutions, learning from data and evaluating systems honestly. You will implement small intelligent agents and finish with a guided project that documents limitations as carefully as results.",
      outcomes: [
        "Explain core AI approaches and trade-offs",
        "Implement search and planning algorithms",
        "Understand neural network fundamentals",
        "Evaluate models with appropriate metrics",
        "Identify bias, privacy and safety concerns",
        "Build and document an AI mini project"
      ],
      requirements: [
        "Confident Python programming",
        "High-school level algebra",
        "Curiosity about how intelligent systems work"
      ],
      modules: [
        mod("Foundations of intelligence", [
          lesson("What AI can and cannot do", "22 min", true),
          lesson("Agents, environments and goals", "27 min"),
          lesson("Search strategies and heuristics", "36 min"),
          lesson("Knowledge representation", "31 min")
        ]),
        mod("Learning from data", [
          lesson("Supervised learning intuition", "29 min"),
          lesson("Neural networks from the ground up", "42 min"),
          lesson("Training, validation and overfitting", "35 min"),
          lesson("Embeddings and similarity search", "33 min")
        ]),
        mod("Modern AI systems", [
          lesson("Language models and transformers", "44 min"),
          lesson("Retrieval-augmented generation", "38 min"),
          lesson("Evaluation and hallucination checks", "30 min"),
          lesson("Responsible and explainable AI", "32 min")
        ]),
        mod("Applied project", [
          lesson("Framing a useful AI problem", "24 min"),
          lesson("Building the prototype", "48 min"),
          lesson("Testing with real scenarios", "36 min"),
          lesson("Presenting results and limitations", "28 min")
        ])
      ]
    }),
    build({
      slug: "machine-learning",
      image: "course-machine-learning.webp",
      title: "Machine Learning",
      code: "LS-ML-08",
      category: "Data Science",
      level: "Advanced",
      tone: "sage",
      icon: "sparkles",
      price: 1999,
      originalPrice: 3199,
      rating: 4.8,
      reviewCount: 229,
      students: 1940,
      duration: "32 hours",
      language: "English",
      featured: false,
      updated: "September 2026",
      short: "Go from data to dependable models with a practical, evaluation-first workflow.",
      description:
        "Learn supervised and unsupervised machine learning by building models you can trust, with careful feature work, validation and communication.",
      overview:
        "This course treats machine learning as a workflow rather than a collection of algorithms. You will clean data, engineer features, train baselines, compare models honestly and explain results to non-technical readers. The capstone uses a realistic tabular dataset.",
      outcomes: [
        "Prepare data for machine learning",
        "Train regression and classification models",
        "Evaluate with the right metrics",
        "Tune models without overfitting",
        "Use clustering for exploration",
        "Communicate model results responsibly"
      ],
      requirements: [
        "Intermediate Python",
        "Familiarity with basic statistics",
        "No machine learning experience needed"
      ],
      modules: [
        mod("Data & workflow", [
          lesson("The machine learning lifecycle", "20 min", true),
          lesson("Cleaning and exploring a dataset", "32 min"),
          lesson("Feature engineering that generalises", "34 min"),
          lesson("Train, validation and test splits", "28 min")
        ]),
        mod("Supervised learning", [
          lesson("Linear and logistic regression", "35 min"),
          lesson("Decision trees and random forests", "38 min"),
          lesson("Gradient boosting in practice", "36 min"),
          lesson("Support vector machines", "30 min")
        ]),
        mod("Unsupervised & evaluation", [
          lesson("Clustering and dimensionality reduction", "34 min"),
          lesson("Cross-validation and model selection", "29 min"),
          lesson("Metrics, thresholds and trade-offs", "31 min"),
          lesson("Fairness and model documentation", "25 min")
        ]),
        mod("Capstone", [
          lesson("Defining the prediction task", "22 min"),
          lesson("Feature pipeline build", "42 min"),
          lesson("Model comparison and tuning", "44 min"),
          lesson("Final report and presentation", "35 min")
        ])
      ]
    }),
    build({
      slug: "data-analytics",
      image: "course-data-analytics.webp",
      title: "Data Analytics",
      code: "LS-DA-09",
      category: "Data Science",
      level: "Beginner",
      tone: "sand",
      icon: "chart",
      price: 1299,
      originalPrice: 2199,
      rating: 4.7,
      reviewCount: 287,
      students: 2210,
      duration: "25 hours",
      language: "English",
      featured: true,
      updated: "August 2026",
      short: "Turn raw data into clear decisions with spreadsheets, SQL and visual storytelling.",
      description:
        "A friendly, practical analytics course. Learn to clean data, ask better questions and present findings that people can act on.",
      overview:
        "Dashboards are only useful when they answer a real question. This course builds the full analytics loop: framing a question, collecting and cleaning data, exploring patterns, visualising honestly and presenting a recommendation. You will complete a guided analysis of a sample retail dataset.",
      outcomes: [
        "Frame a useful analytical question",
        "Clean and structure messy data",
        "Use spreadsheet and SQL techniques",
        "Choose visualisations that fit the message",
        "Spot misleading charts and metrics",
        "Present a clear, evidence-led recommendation"
      ],
      requirements: [
        "Comfort with spreadsheets",
        "No coding experience required",
        "Access to a spreadsheet tool and web browser"
      ],
      modules: [
        mod("Ask better questions", [
          lesson("Analytics that changes decisions", "17 min", true),
          lesson("Metrics, dimensions and segments", "24 min"),
          lesson("Cleaning data without losing meaning", "30 min"),
          lesson("Exploratory analysis habits", "27 min")
        ]),
        mod("Tools of the trade", [
          lesson("Spreadsheet power moves", "26 min"),
          lesson("SQL for analysts", "36 min"),
          lesson("Visualisation principles", "29 min"),
          lesson("Common chart mistakes", "21 min")
        ]),
        mod("Tell the story", [
          lesson("From insight to recommendation", "23 min"),
          lesson("Designing a clear dashboard", "32 min"),
          lesson("Project: retail performance review", "46 min"),
          lesson("Presenting with confidence", "25 min")
        ])
      ]
    }),
    build({
      slug: "graphic-design",
      image: "course-graphic-design.webp",
      title: "Graphic Design",
      code: "LS-GD-10",
      category: "Design",
      level: "Beginner",
      tone: "rose",
      icon: "palette",
      price: 899,
      originalPrice: 1499,
      rating: 4.8,
      reviewCount: 401,
      students: 2560,
      duration: "20 hours",
      language: "English",
      featured: true,
      updated: "July 2026",
      short: "Build visual taste and practical skills for brand, layout and digital design.",
      description:
        "Learn the principles behind confident design work and apply them in a complete visual identity project using accessible tools.",
      overview:
        "Design is a skill of decisions: what to emphasise, what to remove and how to guide the eye. This course covers type, colour, grids and composition with regular critique. You will develop a small brand system and a set of social and web layouts.",
      outcomes: [
        "Apply typography and hierarchy with intent",
        "Build harmonious, accessible colour palettes",
        "Use grids, spacing and alignment",
        "Create a consistent visual identity",
        "Design for web and social formats",
        "Give and receive useful design critique"
      ],
      requirements: [
        "A computer that can run a design tool",
        "No prior design experience required",
        "A willingness to iterate on your work"
      ],
      modules: [
        mod("Visual language", [
          lesson("How designers see", "18 min", true),
          lesson("Typography and hierarchy", "31 min"),
          lesson("Colour with purpose", "28 min"),
          lesson("Space, alignment and grids", "26 min")
        ]),
        mod("Identity & layout", [
          lesson("Logo thinking, not logo trends", "30 min"),
          lesson("Building a small brand system", "36 min"),
          lesson("Layouts for social and web", "33 min"),
          lesson("Accessibility in visual design", "24 min")
        ]),
        mod("Studio project", [
          lesson("Moodboards and art direction", "22 min"),
          lesson("Drafting the identity", "40 min"),
          lesson("Critique and refinement", "34 min"),
          lesson("Presenting the final brand", "27 min")
        ])
      ]
    }),
    build({
      slug: "video-editing",
      image: "course-video-editing.webp",
      title: "Video Editing",
      code: "LS-VE-11",
      category: "Design",
      level: "Beginner",
      tone: "slate",
      icon: "video",
      price: 799,
      originalPrice: 1399,
      rating: 4.7,
      reviewCount: 192,
      students: 1740,
      duration: "18 hours",
      language: "English",
      featured: false,
      updated: "June 2026",
      short: "Shape raw footage into clear, engaging stories with rhythm and polish.",
      description:
        "A practical editing course covering story structure, cuts, sound, colour and export settings for online video.",
      overview:
        "Great editing is invisible: it keeps attention and serves the story. This course takes you from organising footage to a finished short video. You will learn pacing, audio cleanup, simple motion, colour correction and delivery settings for different platforms.",
      outcomes: [
        "Organise footage and build a story",
        "Edit for pace, clarity and emotion",
        "Clean and mix audio confidently",
        "Apply titles, motion and transitions with restraint",
        "Correct colour consistently",
        "Export for web, social and presentation"
      ],
      requirements: [
        "A computer that can run editing software",
        "Any camera or phone for practice footage",
        "No previous editing experience required"
      ],
      modules: [
        mod("The edit starts before the timeline", [
          lesson("Story, selects and shot lists", "19 min", true),
          lesson("Organising your project", "21 min"),
          lesson("The grammar of cuts", "27 min"),
          lesson("Pacing and structure", "25 min")
        ]),
        mod("Sound & picture polish", [
          lesson("Audio cleanup and mixing", "30 min"),
          lesson("Titles and simple motion", "26 min"),
          lesson("Colour correction basics", "29 min"),
          lesson("Transitions that serve the story", "18 min")
        ]),
        mod("Finish & publish", [
          lesson("Reviewing your own edit", "17 min"),
          lesson("Export settings by platform", "22 min"),
          lesson("Project: 60-second brand film", "45 min"),
          lesson("Building an editing workflow", "20 min")
        ])
      ]
    }),
    build({
      slug: "computer-fundamentals",
      image: "course-computer-fundamentals.webp",
      title: "Computer Fundamentals",
      code: "LS-CF-12",
      category: "Computer Fundamentals",
      level: "Beginner",
      tone: "mist",
      icon: "monitor",
      price: 499,
      originalPrice: 999,
      rating: 4.6,
      reviewCount: 512,
      students: 3890,
      duration: "15 hours",
      language: "English",
      featured: false,
      updated: "May 2026",
      short: "A confident start with computers, the web, files and everyday digital tools.",
      description:
        "Build essential digital confidence: understand your device, manage files safely, browse intelligently and use core productivity tools.",
      overview:
        "Designed for complete beginners and anyone who wants to fill gaps. Short, patient lessons explain how computers work, how to stay safe online and how to use everyday tools without frustration. No jargon, no assumptions.",
      outcomes: [
        "Understand hardware, software and operating systems",
        "Organise files and folders confidently",
        "Browse the web safely and search effectively",
        "Use email, documents and spreadsheets",
        "Recognise common online scams",
        "Follow a simple backup routine"
      ],
      requirements: [
        "Access to a Windows, macOS or Linux computer",
        "No prior experience required",
        "Patience with yourself while practising"
      ],
      modules: [
        mod("Getting comfortable", [
          lesson("What is inside a computer?", "16 min", true),
          lesson("Operating systems and the desktop", "20 min"),
          lesson("Files, folders and storage", "24 min"),
          lesson("Keyboard and mouse shortcuts", "15 min")
        ]),
        mod("The digital world", [
          lesson("How the internet works", "22 min"),
          lesson("Searching the web effectively", "25 min"),
          lesson("Email and online communication", "23 min"),
          lesson("Passwords, scams and privacy", "28 min")
        ]),
        mod("Everyday tools", [
          lesson("Documents and PDFs", "21 min"),
          lesson("Spreadsheets from zero", "30 min"),
          lesson("Cloud storage and backups", "19 min"),
          lesson("Project: organise your digital life", "35 min")
        ])
      ]
    })
  ];

  var testimonials = [
    {
      name: "Aarav Sharma",
      initials: "AS",
      course: "web-development",
      rating: 5,
      quote:
        "The lessons are calm and clear. I finally understand how the frontend and backend fit together, and I shipped my first portfolio project in six weeks."
    },
    {
      name: "Priya Menon",
      initials: "PM",
      course: "python-programming",
      rating: 5,
      quote:
        "I came in knowing nothing and now I automate small reports at work. The projects made the concepts stick far better than watching endless tutorials."
    },
    {
      name: "Dev Patel",
      initials: "DP",
      course: "dsa",
      rating: 5,
      quote:
        "The visual explanations changed how I approach problems. Instead of memorising answers, I can actually reason about the right data structure."
    },
    {
      name: "Sara Khan",
      initials: "SK",
      course: "graphic-design",
      rating: 4,
      quote:
        "Honest critique made the biggest difference. My work looks more intentional now, and I have a brand project I am genuinely proud to show."
    },
    {
      name: "Nikhil Verma",
      initials: "NV",
      course: "data-analytics",
      rating: 5,
      quote:
        "The course taught me to ask better questions before opening a chart. That shift has been useful in every project since."
    },
    {
      name: "Ananya Das",
      initials: "AD",
      course: "artificial-intelligence",
      rating: 5,
      quote:
        "Rigorous without being intimidating. I especially appreciated the focus on evaluation and limitations, not just building something that looks clever."
    }
  ];

  var reviews = [
    {
      id: "rev-01",
      name: "Aarav Sharma",
      initials: "AS",
      course: "web-development",
      rating: 5,
      title: "The most practical course I have taken",
      text:
        "Every module ended with something real. The deployment lesson alone saved me hours of confusion. The instructor feedback was specific and kind.",
      date: "2026-10-18",
      demo: true
    },
    {
      id: "rev-02",
      name: "Priya Menon",
      initials: "PM",
      course: "python-programming",
      rating: 5,
      title: "Perfect starting point",
      text:
        "Short videos, clear examples and just enough challenge. I never felt lost, but I also never felt bored. The budget tracker project was fun.",
      date: "2026-10-11",
      demo: true
    },
    {
      id: "rev-03",
      name: "Dev Patel",
      initials: "DP",
      course: "dsa",
      rating: 5,
      title: "Finally makes algorithms visual",
      text:
        "The diagrams are excellent. I used the two-pointer and sliding-window lessons in an interview the same week and felt much calmer explaining my thinking.",
      date: "2026-09-29",
      demo: true
    },
    {
      id: "rev-04",
      name: "Sara Khan",
      initials: "SK",
      course: "graphic-design",
      rating: 4,
      title: "Strong critique culture",
      text:
        "I would have liked one more lesson on illustration, but the brand project and feedback were worth it. My typography has improved noticeably.",
      date: "2026-09-20",
      demo: true
    },
    {
      id: "rev-05",
      name: "Nikhil Verma",
      initials: "NV",
      course: "data-analytics",
      rating: 5,
      title: "Analytics with judgement",
      text:
        "The section on misleading charts should be required reading. It changed how I present numbers to my team and how I read other people's dashboards.",
      date: "2026-09-08",
      demo: true
    },
    {
      id: "rev-06",
      name: "Ananya Das",
      initials: "AD",
      course: "artificial-intelligence",
      rating: 5,
      title: "Thoughtful and current",
      text:
        "I appreciated that the course did not pretend AI is magic. The evaluation and safety modules gave me a much healthier framework for building.",
      date: "2026-08-27",
      demo: true
    },
    {
      id: "rev-07",
      name: "Rahul Joshi",
      initials: "RJ",
      course: "dbms",
      rating: 4,
      title: "Solid database foundations",
      text:
        "The query plan lesson was the highlight. Some SQL demos moved quickly, but the practice files made it easy to revisit at my own pace.",
      date: "2026-08-15",
      demo: true
    },
    {
      id: "rev-08",
      name: "Meghna Rao",
      initials: "MR",
      course: "video-editing",
      rating: 5,
      title: "Editing feels less mysterious",
      text:
        "The audio cleanup and pacing lessons made an immediate difference to my short films. The export guide is now pinned in my notes.",
      date: "2026-08-02",
      demo: true
    },
    {
      id: "rev-09",
      name: "Tariq Ali",
      initials: "TA",
      course: "computer-fundamentals",
      rating: 4,
      title: "Patient and respectful teaching",
      text:
        "I bought my first laptop at 52 and this course never made me feel behind. The scam-awareness lesson was genuinely useful for my family too.",
      date: "2026-07-21",
      demo: true
    },
    {
      id: "rev-10",
      name: "Ishita Bose",
      initials: "IB",
      course: "machine-learning",
      rating: 5,
      title: "Evaluation-first approach",
      text:
        "The capstone pushed me to justify every modelling decision. That is exactly the habit I was missing from tutorial-style courses.",
      date: "2026-07-09",
      demo: true
    }
  ];

  var faqs = [
    {
      question: "How can I enroll in a course?",
      answer:
        "Open any course page and choose Enroll Now. This demonstration stores the course in your browser so you can explore the student dashboard. No payment is taken and no real account is created. In a production platform, enrollment would be handled by a secure backend and payment provider."
    },
    {
      question: "Are the courses suitable for beginners?",
      answer:
        "Several courses are designed for complete beginners, including Python Programming, Graphic Design, Data Analytics and Computer Fundamentals. Each course page lists a skill level and suggested requirements so you can choose a comfortable starting point."
    },
    {
      question: "Do you provide certificates?",
      answer:
        "Course pages describe certificate eligibility as part of the learning experience. This preview does not issue real certificates. A production version would generate a verifiable certificate only after the required lessons and assessments are completed."
    },
    {
      question: "Can I contact instructors directly?",
      answer:
        "The platform is designed around structured mentor support, office hours and doubt-solving sessions. In this frontend demonstration, messages are stored locally and are not delivered to anyone. Instructor profiles are sample profiles for design preview only."
    },
    {
      question: "Are there any prerequisites?",
      answer:
        "Prerequisites vary by course. Foundational courses assume no prior knowledge, while advanced courses such as Machine Learning and Artificial Intelligence recommend comfort with Python and basic algebra. Check the Requirements section on each course page."
    },
    {
      question: "How do I access course materials?",
      answer:
        "After enrollment, learners would access lessons, resources and progress tracking from their dashboard. In this demonstration, lesson completion is saved in your browser storage so the experience persists when you return on the same device."
    }
  ];

  var stats = [
    { label: "Students enrolled", value: 12480, suffix: "+" },
    { label: "Available courses", value: 12, suffix: "" },
    { label: "Expert instructors", value: 8, suffix: "" },
    { label: "Course completions", value: 9640, suffix: "+" }
  ];

  var categories = [
    { name: "Programming", icon: "code" },
    { name: "Web Development", icon: "monitor" },
    { name: "Database", icon: "database" },
    { name: "Artificial Intelligence", icon: "brain" },
    { name: "Data Science", icon: "chart" },
    { name: "Design", icon: "palette" },
    { name: "Computer Fundamentals", icon: "cpu" }
  ];

  function bySlug(slug) {
    for (var i = 0; i < courses.length; i++) {
      if (courses[i].slug === slug) return courses[i];
    }
    return null;
  }

  function instructorById(id) {
    for (var i = 0; i < instructors.length; i++) {
      if (instructors[i].id === id) return instructors[i];
    }
    return null;
  }

  function instructorForCourse(slug) {
    for (var i = 0; i < instructors.length; i++) {
      if (instructors[i].courses.indexOf(slug) > -1) return instructors[i];
    }
    return null;
  }

  function reviewsForCourse(slug) {
    return reviews.filter(function (review) {
      return review.course === slug;
    });
  }

  function courseTitle(slug) {
    var course = bySlug(slug);
    return course ? course.title : "Course";
  }

  window.LS_DATA = {
    courses: courses,
    instructors: instructors,
    testimonials: testimonials,
    reviews: reviews,
    faqs: faqs,
    stats: stats,
    categories: categories,
    bySlug: bySlug,
    instructorById: instructorById,
    instructorForCourse: instructorForCourse,
    reviewsForCourse: reviewsForCourse,
    courseTitle: courseTitle
  };
})();
