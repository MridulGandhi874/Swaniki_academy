import { connectDB } from "@/lib/db";
import CourseModel from "@/lib/models/Course";

interface SeedLesson {
  title: string;
  type: "reading" | "video" | "code" | "assignment";
  content: string;
  objectives: string[];
  codeBlocks?: { language: string; code: string; caption?: string }[];
}

interface SeedModule {
  day: number;
  title: string;
  lessons: SeedLesson[];
  handsOnProject: { title: string; description: string };
  assignment: { title: string; instructions: string };
}

interface SeedCourse {
  courseId: string;
  title: string;
  description: string;
  bannerUrl: string;
  price: number;
  badge: string;
  domainTags: string[];
  skillLevel: "beginner" | "intermediate" | "advanced";
  totalDays: number;
  rating: number;
  activeStudentCount: number;
  evaluationCriteria: { criterion: string; weight: number; description: string }[];
  modules: SeedModule[];
}

const STANDARD_CRITERIA = (domain: string) => [
  {
    criterion: "Code Structure",
    weight: 30,
    description: `Repository is organized, readable, and follows conventions expected in professional ${domain} work.`,
  },
  {
    criterion: "Architecture & Documentation",
    weight: 30,
    description: "README and design notes clearly explain architecture, setup, and key decisions.",
  },
  {
    criterion: "Live Proof & Functionality",
    weight: 40,
    description: "The submitted link is live, publicly reachable, and demonstrates working functionality.",
  },
];

const COURSES: SeedCourse[] = [
  {
    courseId: "full-stack-web-development",
    bannerUrl: "/course-banners/full-stack-web-development.svg",
    price: 2999,
    domainTags: ["full-stack"],
    skillLevel: "intermediate",
    title: "Professional · Full-Stack Development: The Next.js & Node Track",
    description:
      "Build production-grade web applications end to end with Next.js, Node.js, and MongoDB — from server components and API routes to authentication and database design.",
    badge: "Most Popular",
    totalDays: 24,
    rating: 3.9,
    activeStudentCount: 842,
    evaluationCriteria: STANDARD_CRITERIA("full-stack web development"),
    modules: [
      {
        day: 1,
        title: "Modern Frontend Foundations with Next.js",
        lessons: [
          {
            title: "App Router, Server Components & Routing",
            type: "code",
            content:
              "<p>Next.js's App Router splits every route into server and client components. Server components render on the server and never ship their JS to the browser, which keeps bundles small and data fetching close to the source.</p><p>You'll build a multi-route app using nested layouts, dynamic segments, and loading/error boundaries.</p>",
            objectives: [
              "Differentiate server vs. client components",
              "Implement nested layouts and dynamic route segments",
            ],
            codeBlocks: [
              {
                language: "tsx",
                code: "export default async function Page({ params }: { params: { id: string } }) {\n  const data = await fetch(`https://api.example.com/items/${params.id}`).then(r => r.json());\n  return <ItemDetail item={data} />;\n}",
                caption: "Server component fetching data directly, no client-side loading state needed.",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Multi-route product catalog",
          description: "Build a catalog with a dynamic product detail route and a nested layout for filters.",
        },
        assignment: {
          title: "Route architecture writeup",
          instructions: "Document why each route in your catalog is a server or client component.",
        },
      },
      {
        day: 2,
        title: "Backend APIs with Node.js & Express",
        lessons: [
          {
            title: "Designing RESTful Route Handlers",
            type: "code",
            content:
              "<p>A well-designed API separates routing, validation, and business logic. You'll build Express middleware for request validation and centralized error handling.</p>",
            objectives: ["Structure Express routers by resource", "Write middleware for validation and error handling"],
            codeBlocks: [
              {
                language: "javascript",
                code: "app.post('/api/orders', validateOrder, async (req, res, next) => {\n  try {\n    const order = await Order.create(req.body);\n    res.status(201).json(order);\n  } catch (err) { next(err); }\n});",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Orders API",
          description: "Build a CRUD API for orders with validation middleware and centralized error responses.",
        },
        assignment: {
          title: "API contract document",
          instructions: "Write an OpenAPI-style spec for every endpoint you built.",
        },
      },
      {
        day: 3,
        title: "Persisting Data with MongoDB & Mongoose",
        lessons: [
          {
            title: "Schema Design & Relationships",
            type: "reading",
            content:
              "<p>MongoDB's document model rewards denormalization for read-heavy paths but still needs careful schema design for consistency. You'll model a one-to-many relationship (users to orders) and add compound indexes for common queries.</p>",
            objectives: ["Design a schema with embedded vs. referenced relationships", "Add indexes for query performance"],
          },
        ],
        handsOnProject: {
          title: "Indexed order history query",
          description: "Add a compound index and benchmark a paginated order-history query before and after.",
        },
        assignment: {
          title: "Schema design rationale",
          instructions: "Explain why you chose embedding vs. referencing for each relationship.",
        },
      },
      {
        day: 4,
        title: "Capstone: Full-Stack Deployment",
        lessons: [
          {
            title: "Shipping a Production Build",
            type: "assignment",
            content:
              "<p>Bring the catalog frontend and orders API together into a single deployed application with authentication, then deploy it publicly.</p>",
            objectives: ["Integrate frontend and backend into one deployable app", "Deploy publicly with environment-based config"],
          },
        ],
        handsOnProject: {
          title: "Deployed full-stack app",
          description: "Combine everything into one live, publicly accessible full-stack application.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with a working deployed link in the README.",
        },
      },
    ],
  },
  {
    courseId: "applied-ai-ml-systems",
    bannerUrl: "/course-banners/applied-ai-ml-systems.svg",
    price: 3999,
    domainTags: ["ai-ml"],
    skillLevel: "advanced",
    title: "Advanced · AI & Machine Learning: Production ML Systems",
    description:
      "Go from PyTorch fundamentals to production ML systems — train computer vision models, build LLM inference pipelines, and ship a model behind a real API.",
    badge: "High Demand",
    totalDays: 28,
    rating: 4.0,
    activeStudentCount: 731,
    evaluationCriteria: STANDARD_CRITERIA("applied machine learning"),
    modules: [
      {
        day: 1,
        title: "PyTorch Fundamentals & Tensor Operations",
        lessons: [
          {
            title: "Tensors, Autograd, and Training Loops",
            type: "code",
            content:
              "<p>PyTorch's autograd engine tracks operations on tensors to compute gradients automatically. You'll write a training loop from scratch — forward pass, loss, backward pass, optimizer step — before relying on higher-level abstractions.</p>",
            objectives: ["Write a manual training loop with autograd", "Explain backpropagation through a computation graph"],
            codeBlocks: [
              {
                language: "python",
                code: "for epoch in range(epochs):\n    pred = model(x)\n    loss = loss_fn(pred, y)\n    optimizer.zero_grad()\n    loss.backward()\n    optimizer.step()",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Linear regression from scratch",
          description: "Implement and train a linear regression model using only tensors and autograd.",
        },
        assignment: {
          title: "Gradient descent writeup",
          instructions: "Explain, with your own training curve plot, how learning rate affected convergence.",
        },
      },
      {
        day: 2,
        title: "Computer Vision with Convolutional Networks",
        lessons: [
          {
            title: "Building and Training a CNN Classifier",
            type: "code",
            content:
              "<p>Convolutional layers exploit spatial locality in images. You'll build a CNN image classifier, apply data augmentation, and evaluate with a confusion matrix rather than accuracy alone.</p>",
            objectives: ["Build a CNN with conv/pool/fc layers", "Evaluate a classifier beyond raw accuracy"],
          },
        ],
        handsOnProject: {
          title: "Image classifier",
          description: "Train a CNN on a labeled image dataset and report precision/recall per class.",
        },
        assignment: {
          title: "Error analysis report",
          instructions: "Identify your model's most confused class pairs and propose a fix.",
        },
      },
      {
        day: 3,
        title: "Building LLM Inference Pipelines",
        lessons: [
          {
            title: "Serving Transformer Models Efficiently",
            type: "code",
            content:
              "<p>Serving LLMs in production requires batching, quantization, and careful memory management. You'll build an inference pipeline that batches requests and streams tokens back to the client.</p>",
            objectives: ["Implement request batching for throughput", "Stream token-by-token generation to a client"],
          },
        ],
        handsOnProject: {
          title: "Streaming inference API",
          description: "Wrap a transformer model in an API that streams generated tokens over HTTP.",
        },
        assignment: {
          title: "Latency benchmark",
          instructions: "Benchmark p50/p95 latency of your pipeline under concurrent load.",
        },
      },
      {
        day: 4,
        title: "Capstone: Deploying a Vision Model as an API",
        lessons: [
          {
            title: "Productionizing a Model",
            type: "assignment",
            content:
              "<p>Package your trained CNN behind a REST API with proper input validation, and deploy it so it can be called publicly.</p>",
            objectives: ["Package a model behind a versioned API", "Deploy publicly with input validation"],
          },
        ],
        handsOnProject: {
          title: "Deployed vision API",
          description: "Deploy your image classifier behind a public inference endpoint.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL including the deployed endpoint in the README.",
        },
      },
    ],
  },
  {
    courseId: "devops-cloud-native",
    bannerUrl: "/course-banners/devops-cloud-native.svg",
    price: 3499,
    domainTags: ["devops-cloud"],
    skillLevel: "intermediate",
    title: "Professional · DevOps & Cloud: Cloud-Native Architecture",
    description:
      "Containerize, orchestrate, and automate deployment of real applications using Docker, Kubernetes, and AWS CI/CD pipelines — the same stack production platform teams run.",
    badge: "Industry Track",
    totalDays: 21,
    rating: 4.0,
    activeStudentCount: 654,
    evaluationCriteria: STANDARD_CRITERIA("cloud infrastructure"),
    modules: [
      {
        day: 1,
        title: "Containerizing Applications with Docker",
        lessons: [
          {
            title: "Writing Production-Grade Dockerfiles",
            type: "code",
            content:
              "<p>A good Dockerfile minimizes image size and build time through multi-stage builds and layer caching. You'll containerize a Node.js API with a multi-stage build.</p>",
            objectives: ["Write a multi-stage Dockerfile", "Reduce image size using layer caching strategy"],
            codeBlocks: [
              {
                language: "dockerfile",
                code: "FROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=build /app/dist ./dist\nCOPY --from=build /app/node_modules ./node_modules\nCMD [\"node\", \"dist/index.js\"]",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Multi-stage containerized API",
          description: "Containerize an existing API with a multi-stage Dockerfile under 150MB.",
        },
        assignment: {
          title: "Image size report",
          instructions: "Document your before/after image size and what caused the reduction.",
        },
      },
      {
        day: 2,
        title: "Orchestration with Kubernetes",
        lessons: [
          {
            title: "Deployments, Services, and Health Checks",
            type: "code",
            content:
              "<p>Kubernetes Deployments manage replica sets and rolling updates; Services provide stable networking. You'll write manifests with liveness/readiness probes so the cluster can self-heal.</p>",
            objectives: ["Write a Deployment with rolling update strategy", "Configure liveness and readiness probes"],
          },
        ],
        handsOnProject: {
          title: "Self-healing deployment",
          description: "Deploy your containerized API to Kubernetes with health probes and verify auto-recovery.",
        },
        assignment: {
          title: "Rollout strategy notes",
          instructions: "Explain your rolling update configuration and how it prevents downtime.",
        },
      },
      {
        day: 3,
        title: "CI/CD Pipelines on AWS",
        lessons: [
          {
            title: "Automating Build, Test, and Deploy",
            type: "reading",
            content:
              "<p>A CI/CD pipeline should fail fast on bad code and deploy automatically on green builds. You'll wire a pipeline that builds, tests, and pushes a container image to a registry on every merge.</p>",
            objectives: ["Automate build/test/deploy on merge to main", "Push versioned images to a container registry"],
          },
        ],
        handsOnProject: {
          title: "Automated deploy pipeline",
          description: "Build a pipeline that deploys to your cluster automatically on a successful merge.",
        },
        assignment: {
          title: "Pipeline diagram",
          instructions: "Diagram every stage of your pipeline and what gates progression to the next.",
        },
      },
      {
        day: 4,
        title: "Capstone: Production-Grade Deployment Pipeline",
        lessons: [
          {
            title: "End-to-End Infrastructure",
            type: "assignment",
            content:
              "<p>Combine containerization, orchestration, and CI/CD into one pipeline that takes a code push to a live, publicly reachable deployment.</p>",
            objectives: ["Combine Docker, Kubernetes, and CI/CD into one pipeline", "Verify a live public deployment"],
          },
        ],
        handsOnProject: {
          title: "Live infrastructure pipeline",
          description: "Ship a fully automated pipeline ending in a publicly reachable deployment.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your infrastructure repository URL with the pipeline config and live URL documented.",
        },
      },
    ],
  },
  {
    courseId: "cybersecurity-offensive-systems",
    bannerUrl: "/course-banners/cybersecurity-offensive-systems.svg",
    price: 4499,
    domainTags: ["cybersecurity"],
    skillLevel: "advanced",
    title: "Advanced · Cybersecurity: Offensive Security & Pentesting",
    description:
      "Learn offensive security the way real red teams operate — network protocol analysis, web application penetration testing, and exploit development, all in authorized lab environments.",
    badge: "Advanced",
    totalDays: 26,
    rating: 4.4,
    activeStudentCount: 512,
    evaluationCriteria: [
      {
        criterion: "Vulnerability Coverage & Methodology",
        weight: 30,
        description: "Testing methodology is systematic and covers the relevant attack surface.",
      },
      {
        criterion: "Documentation & Reporting",
        weight: 30,
        description: "Findings are documented clearly enough for a remediation team to act on.",
      },
      {
        criterion: "Live Proof & Functionality",
        weight: 40,
        description: "Proof-of-concept evidence is reachable and demonstrates the reported issue.",
      },
    ],
    modules: [
      {
        day: 1,
        title: "Reconnaissance & Network Protocol Analysis",
        lessons: [
          {
            title: "Passive Recon and Packet-Level Analysis",
            type: "reading",
            content:
              "<p>Every authorized engagement starts with reconnaissance: mapping hosts, open ports, and services without alerting the target. You'll analyze packet captures to identify protocols and misconfigurations.</p>",
            objectives: ["Perform passive and active reconnaissance in a lab environment", "Analyze packet captures to fingerprint services"],
          },
        ],
        handsOnProject: {
          title: "Lab network recon report",
          description: "Map a provided lab network's hosts, open ports, and running services.",
        },
        assignment: {
          title: "Recon writeup",
          instructions: "Document your methodology and findings from the lab reconnaissance exercise.",
        },
      },
      {
        day: 2,
        title: "Web Application Penetration Testing",
        lessons: [
          {
            title: "OWASP Top 10 in Practice",
            type: "reading",
            content:
              "<p>Working through injection, broken auth, and access-control flaws against an intentionally vulnerable lab app teaches you to think like an attacker before you defend like one.</p>",
            objectives: ["Identify and exploit OWASP Top 10 vulnerabilities in a lab app", "Distinguish false positives from exploitable findings"],
          },
        ],
        handsOnProject: {
          title: "Vulnerable app assessment",
          description: "Assess a provided intentionally-vulnerable web app and catalog exploitable findings.",
        },
        assignment: {
          title: "Findings summary",
          instructions: "Rank your findings by severity using CVSS scoring.",
        },
      },
      {
        day: 3,
        title: "Exploit Development Fundamentals",
        lessons: [
          {
            title: "From Crash to Controlled Exploit",
            type: "reading",
            content:
              "<p>Exploit development starts with reliably triggering a crash, then controlling program flow. You'll work through a memory-safety bug in a lab binary end to end.</p>",
            objectives: ["Trigger and analyze a memory-safety crash", "Explain the path from crash to controlled exploitation"],
          },
        ],
        handsOnProject: {
          title: "Lab exploit walkthrough",
          description: "Document a full exploit chain against a provided lab binary.",
        },
        assignment: {
          title: "Exploit writeup",
          instructions: "Write a technical walkthrough suitable for a security research blog.",
        },
      },
      {
        day: 4,
        title: "Capstone: Full Penetration Test Report",
        lessons: [
          {
            title: "Professional Reporting",
            type: "assignment",
            content:
              "<p>A penetration test is only as useful as its report. You'll produce a complete, professional report against a capstone lab environment.</p>",
            objectives: ["Produce a professional pentest report", "Prioritize findings with actionable remediation guidance"],
          },
        ],
        handsOnProject: {
          title: "Capstone penetration test",
          description: "Run a full assessment of a capstone lab environment and produce a formal report.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit a link to your report (PDF or Drive) with executive summary and findings.",
        },
      },
    ],
  },
  {
    courseId: "backend-microservices-engineering",
    bannerUrl: "/course-banners/backend-microservices-engineering.svg",
    price: 2999,
    domainTags: ["distributed-systems","full-stack"],
    skillLevel: "advanced",
    title: "Advanced · Distributed Systems: Backend Microservices Engineering",
    description:
      "Design and build distributed backend systems in Go — service boundaries, gRPC communication, and distributed caching — the way high-scale platform teams architect backends.",
    badge: "Systems Track",
    totalDays: 22,
    rating: 4.0,
    activeStudentCount: 468,
    evaluationCriteria: STANDARD_CRITERIA("distributed backend systems"),
    modules: [
      {
        day: 1,
        title: "Designing Services in Go",
        lessons: [
          {
            title: "Service Boundaries and Package Layout",
            type: "code",
            content:
              "<p>Go rewards small, composable packages with clear boundaries. You'll design a service around a single responsibility with a clean internal/ layout separating handlers, domain logic, and storage.</p>",
            objectives: ["Structure a Go service with clear package boundaries", "Separate handler, domain, and storage layers"],
            codeBlocks: [
              {
                language: "go",
                code: "func (s *OrderService) CreateOrder(ctx context.Context, req *CreateOrderRequest) (*Order, error) {\n\tif err := req.Validate(); err != nil {\n\t\treturn nil, fmt.Errorf(\"invalid request: %w\", err)\n\t}\n\treturn s.repo.Save(ctx, req.ToOrder())\n}",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Single-responsibility Go service",
          description: "Build an orders service in Go with a clean layered package structure.",
        },
        assignment: {
          title: "Package layout rationale",
          instructions: "Document why you separated handlers, domain, and storage the way you did.",
        },
      },
      {
        day: 2,
        title: "Inter-Service Communication with gRPC",
        lessons: [
          {
            title: "Defining Contracts with Protocol Buffers",
            type: "code",
            content:
              "<p>gRPC's strongly-typed contracts via Protocol Buffers eliminate a whole class of integration bugs. You'll define a service contract and generate client/server stubs.</p>",
            objectives: ["Define a service contract in Protocol Buffers", "Implement a gRPC client and server"],
          },
        ],
        handsOnProject: {
          title: "gRPC service-to-service call",
          description: "Connect two services over gRPC using a shared .proto contract.",
        },
        assignment: {
          title: "Contract versioning notes",
          instructions: "Explain how you'd evolve this contract without breaking existing clients.",
        },
      },
      {
        day: 3,
        title: "Distributed Caching Strategies",
        lessons: [
          {
            title: "Cache Invalidation and Consistency",
            type: "reading",
            content:
              "<p>Caching is easy; invalidating correctly under concurrent writes is the hard part. You'll implement a write-through cache and reason about staleness windows.</p>",
            objectives: ["Implement a write-through distributed cache", "Reason about cache staleness and invalidation"],
          },
        ],
        handsOnProject: {
          title: "Write-through cache layer",
          description: "Add a distributed cache in front of your orders service and measure the read speedup.",
        },
        assignment: {
          title: "Consistency tradeoffs writeup",
          instructions: "Document the consistency tradeoffs your caching strategy introduces.",
        },
      },
      {
        day: 4,
        title: "Capstone: Multi-Service Order System",
        lessons: [
          {
            title: "Composing Services into a System",
            type: "assignment",
            content:
              "<p>Bring your services together into a multi-service order system communicating over gRPC with a shared cache layer, deployed and publicly reachable.</p>",
            objectives: ["Compose multiple services into one system", "Deploy a multi-service system publicly"],
          },
        ],
        handsOnProject: {
          title: "Deployed multi-service system",
          description: "Deploy your composed order system so it's publicly reachable end to end.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with architecture diagram in the README.",
        },
      },
    ],
  },
  {
    courseId: "mobile-app-development",
    bannerUrl: "/course-banners/mobile-app-development.svg",
    price: 2499,
    domainTags: ["mobile"],
    skillLevel: "intermediate",
    title: "Professional · Mobile Development: Cross-Platform Apps with Flutter",
    description:
      "Build cross-platform mobile applications with Flutter and Firebase — from widget composition and state management to shipping a real app to both iOS and Android.",
    badge: "Cross-Platform",
    totalDays: 20,
    rating: 3.3,
    activeStudentCount: 597,
    evaluationCriteria: STANDARD_CRITERIA("mobile application development"),
    modules: [
      {
        day: 1,
        title: "Flutter Fundamentals & Widget Trees",
        lessons: [
          {
            title: "Composing UI from Widgets",
            type: "code",
            content:
              "<p>Everything in Flutter is a widget, composed into a tree that rebuilds efficiently on state change. You'll build a screen from scratch using layout, styling, and stateful widgets.</p>",
            objectives: ["Compose a screen from layout and stateful widgets", "Explain Flutter's rebuild model"],
            codeBlocks: [
              {
                language: "dart",
                code: "class CounterButton extends StatefulWidget {\n  @override\n  State<CounterButton> createState() => _CounterButtonState();\n}\n\nclass _CounterButtonState extends State<CounterButton> {\n  int count = 0;\n  @override\n  Widget build(BuildContext context) {\n    return ElevatedButton(\n      onPressed: () => setState(() => count++),\n      child: Text('Count: $count'),\n    );\n  }\n}",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Composed UI screen",
          description: "Build a multi-widget screen with at least one stateful interactive element.",
        },
        assignment: {
          title: "Widget tree diagram",
          instructions: "Sketch and explain the widget tree of the screen you built.",
        },
      },
      {
        day: 2,
        title: "State Management at Scale",
        lessons: [
          {
            title: "Beyond setState: App-Wide State",
            type: "code",
            content:
              "<p>setState works for local widget state, but real apps need shared state across screens. You'll implement app-wide state management and connect it to multiple screens.</p>",
            objectives: ["Implement app-wide state shared across screens", "Avoid unnecessary rebuilds with scoped state"],
          },
        ],
        handsOnProject: {
          title: "Shared state across screens",
          description: "Wire a piece of state (e.g., a shopping cart) shared across at least three screens.",
        },
        assignment: {
          title: "State architecture notes",
          instructions: "Explain your state management choice and why it scales for this app.",
        },
      },
      {
        day: 3,
        title: "Firebase Integration for Mobile",
        lessons: [
          {
            title: "Auth, Firestore, and Push Notifications",
            type: "reading",
            content:
              "<p>Firebase gives mobile apps auth, a real-time database, and push notifications without standing up custom backend infrastructure. You'll wire authentication and real-time data sync into your app.</p>",
            objectives: ["Integrate Firebase Auth into a Flutter app", "Sync real-time data with Firestore"],
          },
        ],
        handsOnProject: {
          title: "Authenticated real-time app",
          description: "Add Firebase Auth and a Firestore-backed real-time feed to your app.",
        },
        assignment: {
          title: "Data flow diagram",
          instructions: "Diagram how data flows from Firestore to your UI in real time.",
        },
      },
      {
        day: 4,
        title: "Capstone: Cross-Platform App Launch",
        lessons: [
          {
            title: "Shipping to Both Platforms",
            type: "assignment",
            content:
              "<p>Bring your screens, state management, and Firebase integration together into one polished cross-platform app, built and ready for both iOS and Android.</p>",
            objectives: ["Assemble a complete cross-platform app", "Produce release builds for iOS and Android"],
          },
        ],
        handsOnProject: {
          title: "Release-ready mobile app",
          description: "Produce a working release build demonstrating your complete app.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with setup and build instructions in the README.",
        },
      },
    ],
  },
  {
    courseId: "data-engineering-analytics",
    bannerUrl: "/course-banners/data-engineering-analytics.svg",
    price: 3499,
    domainTags: ["data-engineering"],
    skillLevel: "advanced",
    title: "Advanced · Data Engineering: Analytics Pipelines at Scale",
    description:
      "Build the pipelines that power analytics at scale — distributed processing with Apache Spark, event streaming with Kafka, and warehousing with Snowflake.",
    badge: "High Demand",
    totalDays: 24,
    rating: 3.1,
    activeStudentCount: 439,
    evaluationCriteria: STANDARD_CRITERIA("data engineering"),
    modules: [
      {
        day: 1,
        title: "Distributed Processing with Apache Spark",
        lessons: [
          {
            title: "Transformations, Actions, and Lazy Evaluation",
            type: "code",
            content:
              "<p>Spark builds a lazy execution plan from transformations and only computes when an action is called. You'll write a Spark job that processes a real dataset and reason about its execution plan.</p>",
            objectives: ["Write Spark transformations and actions", "Read and explain a Spark execution plan"],
            codeBlocks: [
              {
                language: "python",
                code: "df = spark.read.csv('events.csv', header=True)\nresult = df.filter(df.status == 'completed').groupBy('user_id').count()\nresult.write.parquet('output/')",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Batch processing job",
          description: "Write a Spark job that aggregates a real dataset and writes results to Parquet.",
        },
        assignment: {
          title: "Execution plan writeup",
          instructions: "Explain your job's execution plan and where the shuffle stages occur.",
        },
      },
      {
        day: 2,
        title: "Event Streaming with Kafka",
        lessons: [
          {
            title: "Producers, Consumers, and Partitioning",
            type: "code",
            content:
              "<p>Kafka's partition model determines both throughput and ordering guarantees. You'll build a producer/consumer pair and reason about partition keys for ordering guarantees you actually need.</p>",
            objectives: ["Build a Kafka producer and consumer", "Choose partition keys for required ordering guarantees"],
          },
        ],
        handsOnProject: {
          title: "Streaming ingestion pipeline",
          description: "Build a producer that streams events and a consumer that processes them in order.",
        },
        assignment: {
          title: "Partitioning strategy notes",
          instructions: "Explain your partition key choice and its ordering implications.",
        },
      },
      {
        day: 3,
        title: "Warehousing with Snowflake",
        lessons: [
          {
            title: "Modeling for Analytical Queries",
            type: "reading",
            content:
              "<p>Warehouse schemas optimize for analytical query patterns, not transactional ones. You'll model a star schema and write analytical queries against it.</p>",
            objectives: ["Design a star schema for analytics", "Write efficient analytical SQL queries"],
          },
        ],
        handsOnProject: {
          title: "Star schema warehouse",
          description: "Load processed data into a star-schema warehouse and write reporting queries.",
        },
        assignment: {
          title: "Schema design writeup",
          instructions: "Explain your fact/dimension table choices and the queries they optimize for.",
        },
      },
      {
        day: 4,
        title: "Capstone: End-to-End Analytics Pipeline",
        lessons: [
          {
            title: "From Raw Events to Dashboards",
            type: "assignment",
            content:
              "<p>Connect ingestion, processing, and warehousing into one pipeline that takes raw events all the way to query-ready analytics tables.</p>",
            objectives: ["Connect ingestion, processing, and warehousing into one pipeline", "Produce query-ready analytics tables"],
          },
        ],
        handsOnProject: {
          title: "End-to-end pipeline",
          description: "Ship a pipeline from raw event ingestion to a queryable analytics table.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with a pipeline architecture diagram in the README.",
        },
      },
    ],
  },
  {
    courseId: "distributed-systems-design",
    bannerUrl: "/course-banners/distributed-systems-design.svg",
    price: 3999,
    domainTags: ["distributed-systems"],
    skillLevel: "advanced",
    title: "Advanced · Distributed Systems: Design & Performance",
    description:
      "Learn how large-scale systems actually stay fast and available — load balancing, consistent hashing, read/write scaling, and consensus under failure.",
    badge: "Advanced",
    totalDays: 25,
    rating: 3.4,
    activeStudentCount: 388,
    evaluationCriteria: STANDARD_CRITERIA("distributed systems design"),
    modules: [
      {
        day: 1,
        title: "Load Balancing & Consistent Hashing",
        lessons: [
          {
            title: "Distributing Load Without Hotspots",
            type: "reading",
            content:
              "<p>Naive modulo-based sharding causes massive data movement when nodes are added or removed. Consistent hashing minimizes remapping. You'll implement a consistent hash ring and measure rebalancing cost.</p>",
            objectives: ["Implement a consistent hashing ring", "Measure rebalancing cost when nodes join/leave"],
          },
        ],
        handsOnProject: {
          title: "Consistent hash ring simulator",
          description: "Implement a hash ring and simulate node churn, measuring keys remapped.",
        },
        assignment: {
          title: "Rebalancing cost report",
          instructions: "Compare remapping cost between modulo hashing and your consistent hash ring.",
        },
      },
      {
        day: 2,
        title: "Scaling Reads & Writes at Scale",
        lessons: [
          {
            title: "Replication and Read Scaling",
            type: "reading",
            content:
              "<p>Read replicas scale read throughput but introduce replication lag. You'll design a replication strategy and reason about the staleness a client might observe.</p>",
            objectives: ["Design a read-replica strategy", "Reason about replication lag and staleness"],
          },
        ],
        handsOnProject: {
          title: "Replication lag experiment",
          description: "Simulate a primary/replica setup and measure observed staleness under load.",
        },
        assignment: {
          title: "Staleness tradeoffs writeup",
          instructions: "Explain what staleness bound your design guarantees and why.",
        },
      },
      {
        day: 3,
        title: "Fault Tolerance & Consensus",
        lessons: [
          {
            title: "Achieving Agreement Under Failure",
            type: "reading",
            content:
              "<p>Consensus protocols like Raft let a cluster agree on state even when nodes fail. You'll trace through leader election and log replication in a Raft simulation.</p>",
            objectives: ["Trace leader election in a consensus protocol", "Explain how log replication tolerates node failure"],
          },
        ],
        handsOnProject: {
          title: "Consensus trace analysis",
          description: "Run a Raft simulation under induced node failures and document the recovery sequence.",
        },
        assignment: {
          title: "Failure scenario writeup",
          instructions: "Walk through what happens to your system under a leader failure.",
        },
      },
      {
        day: 4,
        title: "Capstone: Designing a Scalable System",
        lessons: [
          {
            title: "A Complete System Design",
            type: "assignment",
            content:
              "<p>Produce a full system design — load balancing, replication, and fault tolerance — for a system handling real scale, with a working prototype demonstrating the core mechanism.</p>",
            objectives: ["Produce a complete scalable system design", "Demonstrate the core mechanism with a working prototype"],
          },
        ],
        handsOnProject: {
          title: "System design + prototype",
          description: "Deliver a design doc and a working prototype of your system's core scaling mechanism.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with the design doc and prototype linked in the README.",
        },
      },
    ],
  },
  {
    courseId: "web3-blockchain-systems",
    bannerUrl: "/course-banners/web3-blockchain-systems.svg",
    price: 3499,
    domainTags: ["web3"],
    skillLevel: "intermediate",
    title: "Professional · Web3 & Blockchain: Smart Contract Systems",
    description:
      "Write, secure, and ship smart contracts — Solidity fundamentals, contract auditing practices, and building real dApps with Ethers.js.",
    badge: "Emerging Tech",
    totalDays: 20,
    rating: 3.2,
    activeStudentCount: 301,
    evaluationCriteria: [
      {
        criterion: "Smart Contract Code Structure",
        weight: 30,
        description: "Contract code follows Solidity best practices and is gas-conscious.",
      },
      {
        criterion: "Architecture & Documentation",
        weight: 30,
        description: "Contract architecture and security assumptions are clearly documented.",
      },
      {
        criterion: "Live Proof & Functionality",
        weight: 40,
        description: "Contract is deployed and verifiably reachable/interactable.",
      },
    ],
    modules: [
      {
        day: 1,
        title: "Solidity Fundamentals & the EVM",
        lessons: [
          {
            title: "Contracts, Storage, and Gas",
            type: "code",
            content:
              "<p>Every storage write on the EVM costs gas, so contract design is as much about cost as correctness. You'll write your first contract and reason about its storage layout and gas cost.</p>",
            objectives: ["Write and deploy a basic Solidity contract", "Reason about storage layout and gas cost"],
            codeBlocks: [
              {
                language: "solidity",
                code: "contract Counter {\n    uint256 public count;\n    function increment() external {\n        count += 1;\n    }\n}",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Deployed test contract",
          description: "Write and deploy a simple contract to a testnet.",
        },
        assignment: {
          title: "Gas cost writeup",
          instructions: "Document the gas cost of your contract's key functions and how you'd reduce it.",
        },
      },
      {
        day: 2,
        title: "Smart Contract Security & Auditing",
        lessons: [
          {
            title: "Common Vulnerability Classes",
            type: "reading",
            content:
              "<p>Reentrancy, integer overflow, and access-control bugs have caused real financial losses. You'll audit a deliberately vulnerable contract and document each finding.</p>",
            objectives: ["Identify reentrancy and access-control vulnerabilities", "Write an audit report for a smart contract"],
          },
        ],
        handsOnProject: {
          title: "Contract audit",
          description: "Audit a provided vulnerable contract and document exploitable findings.",
        },
        assignment: {
          title: "Audit report",
          instructions: "Produce a formal audit report with severity ratings for each finding.",
        },
      },
      {
        day: 3,
        title: "Building dApps with Ethers.js",
        lessons: [
          {
            title: "Connecting a Frontend to a Contract",
            type: "code",
            content:
              "<p>Ethers.js bridges a web frontend to on-chain contracts. You'll wire a frontend to call your deployed contract and reflect on-chain state in the UI.</p>",
            objectives: ["Connect a frontend to a deployed contract via Ethers.js", "Reflect on-chain state changes in the UI"],
          },
        ],
        handsOnProject: {
          title: "dApp frontend",
          description: "Build a frontend that reads and writes to your deployed contract.",
        },
        assignment: {
          title: "Interaction flow writeup",
          instructions: "Document the transaction flow from UI click to on-chain confirmation.",
        },
      },
      {
        day: 4,
        title: "Capstone: Audited Smart Contract Deployment",
        lessons: [
          {
            title: "Ship a Secure Contract",
            type: "assignment",
            content:
              "<p>Combine secure contract design, a self-audit, and a working frontend into one deployed dApp on a public testnet.</p>",
            objectives: ["Deploy an audited contract to a public testnet", "Ship a working frontend for it"],
          },
        ],
        handsOnProject: {
          title: "Deployed audited dApp",
          description: "Deploy your audited contract and frontend to a public testnet.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with the deployed contract address in the README.",
        },
      },
    ],
  },
  {
    courseId: "embedded-systems-edge-ai",
    bannerUrl: "/course-banners/embedded-systems-edge-ai.svg",
    price: 3999,
    domainTags: ["embedded-edge-ai"],
    skillLevel: "advanced",
    title: "Advanced · Embedded & Edge AI: Real-Time Systems",
    description:
      "Program real hardware constraints — C++ for embedded targets, real-time operating systems, and running computer vision models on resource-constrained edge devices.",
    badge: "Hardware Track",
    totalDays: 22,
    rating: 3.4,
    activeStudentCount: 274,
    evaluationCriteria: STANDARD_CRITERIA("embedded systems"),
    modules: [
      {
        day: 1,
        title: "C++ for Embedded Systems",
        lessons: [
          {
            title: "Memory Constraints and Deterministic Timing",
            type: "code",
            content:
              "<p>Embedded C++ trades convenience for predictability — no dynamic allocation in hot paths, tight memory budgets. You'll write firmware that operates within a fixed memory budget.</p>",
            objectives: ["Write embedded C++ avoiding dynamic allocation in hot paths", "Work within a fixed memory budget"],
            codeBlocks: [
              {
                language: "cpp",
                code: "static uint8_t buffer[256];\nvoid readSensor(uint8_t* out, size_t len) {\n    for (size_t i = 0; i < len && i < sizeof(buffer); ++i) {\n        out[i] = buffer[i];\n    }\n}",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Fixed-budget firmware module",
          description: "Write a firmware module that reads sensor data within a strict static memory budget.",
        },
        assignment: {
          title: "Memory budget report",
          instructions: "Document your memory usage and where you avoided dynamic allocation.",
        },
      },
      {
        day: 2,
        title: "Real-Time Operating Systems (RTOS)",
        lessons: [
          {
            title: "Task Scheduling and Priority Inversion",
            type: "reading",
            content:
              "<p>RTOS scheduling guarantees matter when a sensor read has a hard deadline. You'll design a task schedule with priorities and reason about priority inversion risks.</p>",
            objectives: ["Design a prioritized task schedule under an RTOS", "Explain priority inversion and its mitigation"],
          },
        ],
        handsOnProject: {
          title: "Prioritized task schedule",
          description: "Implement a set of RTOS tasks with priorities meeting a hard real-time deadline.",
        },
        assignment: {
          title: "Scheduling analysis",
          instructions: "Document your task priorities and worst-case timing analysis.",
        },
      },
      {
        day: 3,
        title: "Edge Computer Vision on Constrained Devices",
        lessons: [
          {
            title: "Quantized Models on Microcontrollers",
            type: "code",
            content:
              "<p>Running vision models on microcontrollers requires aggressive quantization to fit in kilobytes of memory. You'll deploy a quantized model to a constrained device and measure inference latency.</p>",
            objectives: ["Deploy a quantized vision model to a constrained device", "Measure real-world inference latency on-device"],
          },
        ],
        handsOnProject: {
          title: "On-device vision inference",
          description: "Deploy a quantized model to an edge device and measure inference latency.",
        },
        assignment: {
          title: "Latency & accuracy tradeoff report",
          instructions: "Document the accuracy you gave up for the latency/memory you gained through quantization.",
        },
      },
      {
        day: 4,
        title: "Capstone: IoT Edge Vision Deployment",
        lessons: [
          {
            title: "A Complete Edge Vision System",
            type: "assignment",
            content:
              "<p>Combine your firmware, RTOS scheduling, and quantized vision model into one working edge device demo with real sensor input and real-time inference.</p>",
            objectives: ["Combine firmware, scheduling, and inference into one system", "Demonstrate real-time inference on real sensor input"],
          },
        ],
        handsOnProject: {
          title: "Working edge vision demo",
          description: "Demonstrate real-time inference on real sensor input on your target device.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with a demo video/link and hardware setup notes in the README.",
        },
      },
    ],
  },
  {
    courseId: "java-programming-fundamentals",
    bannerUrl: "/course-banners/java-programming-fundamentals.svg",
    price: 1499,
    domainTags: ["full-stack"],
    skillLevel: "beginner",
    title: "Foundations · Java Programming: Core Language & OOP",
    description:
      "Learn Java from the ground up — syntax, object-oriented design, collections, and exception handling — building toward a real console application you can point to as proof of skill.",
    badge: "Beginner Friendly",
    totalDays: 18,
    rating: 4.0,
    activeStudentCount: 356,
    evaluationCriteria: STANDARD_CRITERIA("Java programming"),
    modules: [
      {
        day: 1,
        title: "Java Syntax & Object-Oriented Basics",
        lessons: [
          {
            title: "Classes, Objects, and the JVM",
            type: "code",
            content:
              "<p>Java source compiles to platform-independent bytecode that runs on the JVM. You'll write a class with fields, a constructor, and methods, and see how objects are instantiated from it.</p>",
            objectives: ["Write and compile a Java class with fields and methods", "Explain how the JVM executes bytecode"],
            codeBlocks: [
              {
                language: "java",
                code: "public class BankAccount {\n    private double balance;\n\n    public BankAccount(double initialBalance) {\n        this.balance = initialBalance;\n    }\n\n    public void deposit(double amount) {\n        if (amount <= 0) throw new IllegalArgumentException(\"Amount must be positive\");\n        balance += amount;\n    }\n}",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Bank account class",
          description: "Model a BankAccount class with deposit/withdraw methods and balance validation.",
        },
        assignment: {
          title: "OOP writeup",
          instructions: "Explain encapsulation using your BankAccount class as the example.",
        },
      },
      {
        day: 2,
        title: "Collections & Generics",
        lessons: [
          {
            title: "Lists, Maps, and Type-Safe Generics",
            type: "code",
            content:
              "<p>The java.util collections (ArrayList, HashMap, etc.) combined with generics let you write reusable, type-safe code. You'll pick the right collection for a real use case and use generics to avoid unchecked casts.</p>",
            objectives: ["Choose the right collection type for a use case", "Use generics to write type-safe reusable code"],
            codeBlocks: [
              {
                language: "java",
                code: "Map<String, Integer> inventory = new HashMap<>();\ninventory.put(\"SKU-001\", 42);\ninventory.merge(\"SKU-001\", 5, Integer::sum);",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Inventory tracker",
          description: "Build an inventory tracker using a HashMap keyed by product SKU.",
        },
        assignment: {
          title: "Collection choice rationale",
          instructions: "Explain why you picked each collection type in your tracker.",
        },
      },
      {
        day: 3,
        title: "Exception Handling & File I/O",
        lessons: [
          {
            title: "Try/Catch, Custom Exceptions, and Reading Files",
            type: "code",
            content:
              "<p>Java distinguishes checked and unchecked exceptions, and try-with-resources ensures files are closed correctly even on error. You'll write a custom exception and use it while reading a file.</p>",
            objectives: ["Handle checked and unchecked exceptions correctly", "Read files using try-with-resources"],
            codeBlocks: [
              {
                language: "java",
                code: "try (BufferedReader reader = new BufferedReader(new FileReader(path))) {\n    String line;\n    while ((line = reader.readLine()) != null) {\n        process(line);\n    }\n} catch (IOException e) {\n    throw new DataLoadException(\"Failed to read \" + path, e);\n}",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "CSV parser",
          description: "Parse a CSV file into objects, handling malformed rows with a custom exception.",
        },
        assignment: {
          title: "Error handling writeup",
          instructions: "Document which exceptions you chose to catch vs. propagate and why.",
        },
      },
      {
        day: 4,
        title: "Capstone: Console Application",
        lessons: [
          {
            title: "Bringing It Together",
            type: "assignment",
            content:
              "<p>Combine OOP design, collections, and file I/O into one complete console application with persistent state.</p>",
            objectives: ["Design a multi-class console application", "Persist and reload application state from a file"],
          },
        ],
        handsOnProject: {
          title: "Complete console app",
          description: "Ship a console application (e.g., a library or task manager) with persistent storage.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with build/run instructions in the README.",
        },
      },
    ],
  },
  {
    courseId: "python-programming-fundamentals",
    bannerUrl: "/course-banners/python-programming-fundamentals.svg",
    price: 1499,
    domainTags: ["ai-ml","data-engineering"],
    skillLevel: "beginner",
    title: "Foundations · Python Programming: Core Language & Scripting",
    description:
      "Master Python fundamentals — syntax, data structures, functions, and working with real-world data — culminating in a data-driven command-line tool.",
    badge: "Beginner Friendly",
    totalDays: 16,
    rating: 3.5,
    activeStudentCount: 498,
    evaluationCriteria: STANDARD_CRITERIA("Python programming"),
    modules: [
      {
        day: 1,
        title: "Python Syntax & Data Structures",
        lessons: [
          {
            title: "Lists, Dicts, and Comprehensions",
            type: "code",
            content:
              "<p>Python's built-in list and dict types, combined with comprehensions, cover most everyday data manipulation. You'll write comprehensions that replace multi-line loops with a single readable expression.</p>",
            objectives: ["Use list and dict comprehensions idiomatically", "Choose the right built-in data structure for a task"],
            codeBlocks: [
              {
                language: "python",
                code: "with open('notes.txt') as f:\n    words = f.read().split()\n\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\n\ntop = sorted(counts.items(), key=lambda kv: -kv[1])[:10]",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Word frequency counter",
          description: "Build a script that counts word frequency in a text file using a dict comprehension.",
        },
        assignment: {
          title: "Data structure choices",
          instructions: "Explain your data structure choices and their time complexity.",
        },
      },
      {
        day: 2,
        title: "Functions, Modules & Virtual Environments",
        lessons: [
          {
            title: "Writing Reusable, Testable Functions",
            type: "code",
            content:
              "<p>Clear function signatures and small, focused modules make code testable and reusable. You'll extract logic into a module and set up an isolated virtual environment with pip.</p>",
            objectives: ["Write reusable functions with clear signatures", "Set up an isolated virtual environment for a project"],
            codeBlocks: [
              {
                language: "python",
                code: "def word_counts(text: str, *, min_length: int = 1) -> dict[str, int]:\n    words = [w for w in text.split() if len(w) >= min_length]\n    return {w: words.count(w) for w in set(words)}",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Reusable utility module",
          description: "Extract your word-counter logic into a reusable, tested module.",
        },
        assignment: {
          title: "Module structure writeup",
          instructions: "Explain how you organized your code into modules and why.",
        },
      },
      {
        day: 3,
        title: "Working with Real-World Data",
        lessons: [
          {
            title: "Parsing JSON/CSV and Handling Errors",
            type: "code",
            content:
              "<p>Real data is messy — missing fields, wrong types, malformed rows. You'll parse JSON and CSV data and handle errors so a few bad rows don't crash the whole script.</p>",
            objectives: ["Parse and validate real-world JSON/CSV data", "Handle malformed data gracefully without crashing"],
            codeBlocks: [
              {
                language: "python",
                code: "import csv\n\ncleaned = []\nwith open('data.csv') as f:\n    for row in csv.DictReader(f):\n        try:\n            row['price'] = float(row['price'])\n            cleaned.append(row)\n        except ValueError:\n            print(f\"Skipping malformed row: {row}\")",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Data cleaner",
          description: "Build a script that ingests a messy CSV and outputs a cleaned version.",
        },
        assignment: {
          title: "Data quality report",
          instructions: "Document what data quality issues you found and how you handled each.",
        },
      },
      {
        day: 4,
        title: "Capstone: CLI Data Tool",
        lessons: [
          {
            title: "Shipping a Command-Line Tool",
            type: "assignment",
            content:
              "<p>Combine everything into an installable command-line tool using argparse, ready to run against real data files.</p>",
            objectives: ["Build a CLI tool with argparse", "Package a Python project for distribution"],
          },
        ],
        handsOnProject: {
          title: "CLI data tool",
          description: "Ship a command-line tool that processes real data end to end.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with usage instructions in the README.",
        },
      },
    ],
  },
  {
    courseId: "ai-ml-foundations",
    bannerUrl: "/course-banners/ai-ml-foundations.svg",
    price: 1999,
    domainTags: ["ai-ml"],
    skillLevel: "beginner",
    title: "Foundations · AI & Machine Learning: Your First Models",
    description:
      "Build a solid foundation in machine learning — from data wrangling and classical algorithms to model evaluation — training your first real models with pandas and scikit-learn.",
    badge: "Beginner Friendly",
    totalDays: 20,
    rating: 3.1,
    activeStudentCount: 412,
    evaluationCriteria: STANDARD_CRITERIA("machine learning"),
    modules: [
      {
        day: 1,
        title: "Data Wrangling with Pandas",
        lessons: [
          {
            title: "Cleaning and Exploring Datasets",
            type: "code",
            content:
              "<p>Most of applied ML is data cleaning, not modeling. You'll load a real dataset into pandas, handle missing values, and explore it before writing a single line of model code.</p>",
            objectives: ["Clean a real dataset with pandas", "Perform exploratory data analysis before modeling"],
            codeBlocks: [
              {
                language: "python",
                code: "import pandas as pd\n\ndf = pd.read_csv('housing.csv')\ndf['bedrooms'] = df['bedrooms'].fillna(df['bedrooms'].median())\nsummary = df.groupby('neighborhood')['price'].mean()",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Dataset cleaning report",
          description: "Clean a public dataset and document the issues you fixed.",
        },
        assignment: {
          title: "EDA writeup",
          instructions: "Summarize your exploratory findings with at least 3 visualizations.",
        },
      },
      {
        day: 2,
        title: "Classical ML Algorithms",
        lessons: [
          {
            title: "Regression, Classification & scikit-learn",
            type: "code",
            content:
              "<p>scikit-learn's consistent fit/predict API covers most classical algorithms. You'll train a classifier, split data correctly into train/test sets, and understand what each does.</p>",
            objectives: ["Train a classification model with scikit-learn", "Correctly split data into train/test sets"],
            codeBlocks: [
              {
                language: "python",
                code: "from sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\nmodel = DecisionTreeClassifier(max_depth=5).fit(X_train, y_train)\nprint(model.score(X_test, y_test))",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Trained classifier",
          description: "Train and evaluate a classifier on a real dataset.",
        },
        assignment: {
          title: "Model comparison",
          instructions: "Compare at least two algorithms on the same dataset and explain the winner.",
        },
      },
      {
        day: 3,
        title: "Model Evaluation & Overfitting",
        lessons: [
          {
            title: "Cross-Validation and Avoiding Overfitting",
            type: "reading",
            content:
              "<p>A single train/test split can be misleading. K-fold cross-validation gives a more reliable estimate, and understanding the bias-variance tradeoff helps you diagnose overfitting.</p>",
            objectives: ["Apply k-fold cross-validation to evaluate a model", "Diagnose and address overfitting"],
          },
        ],
        handsOnProject: {
          title: "Cross-validated model",
          description: "Re-evaluate your classifier with k-fold cross-validation.",
        },
        assignment: {
          title: "Overfitting diagnosis",
          instructions: "Document evidence of overfitting/underfitting in your model and your fix.",
        },
      },
      {
        day: 4,
        title: "Capstone: End-to-End ML Notebook",
        lessons: [
          {
            title: "From Raw Data to Trained Model",
            type: "assignment",
            content:
              "<p>Combine data wrangling, model training, and evaluation into one complete, well-documented notebook someone else could reproduce.</p>",
            objectives: [
              "Produce an end-to-end ML workflow from raw data to evaluated model",
              "Document a notebook clearly enough for someone else to reproduce it",
            ],
          },
        ],
        handsOnProject: {
          title: "End-to-end ML notebook",
          description: "Ship a complete, reproducible notebook covering the full ML workflow.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with the notebook and a summary README.",
        },
      },
    ],
  },
  {
    courseId: "fullstack-development-fundamentals",
    bannerUrl: "/course-banners/fullstack-development-fundamentals.svg",
    price: 1999,
    domainTags: ["full-stack"],
    skillLevel: "beginner",
    title: "Foundations · Full-Stack Development: The MERN Track",
    description:
      "Your on-ramp to full-stack development — HTML/CSS/JavaScript fundamentals, a Node/Express backend, and connecting a real frontend to a real API.",
    badge: "Beginner Friendly",
    totalDays: 18,
    rating: 4.4,
    activeStudentCount: 389,
    evaluationCriteria: STANDARD_CRITERIA("full-stack development"),
    modules: [
      {
        day: 1,
        title: "HTML, CSS & JavaScript Fundamentals",
        lessons: [
          {
            title: "Building a Static Page with Real Interactivity",
            type: "code",
            content:
              "<p>Semantic HTML and flexbox layout form the skeleton; vanilla JavaScript DOM APIs add interactivity without a framework. You'll build a responsive page with at least one real interactive feature.</p>",
            objectives: ["Build a semantic, responsive page with flexbox", "Add interactivity with vanilla JS DOM APIs"],
            codeBlocks: [
              {
                language: "javascript",
                code: "document.querySelector('#toggle').addEventListener('click', () => {\n  document.querySelector('#panel').classList.toggle('open');\n});",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Interactive landing page",
          description: "Build a responsive static page with at least one interactive JS feature.",
        },
        assignment: {
          title: "Semantic markup review",
          instructions: "Explain your semantic tag choices and responsive layout approach.",
        },
      },
      {
        day: 2,
        title: "Building a Backend with Node & Express",
        lessons: [
          {
            title: "Your First REST API",
            type: "code",
            content:
              "<p>Express turns route definitions into a working API in a few lines. You'll set up a server with multiple routes returning structured JSON.</p>",
            objectives: ["Set up an Express server with multiple routes", "Return structured JSON responses from an API"],
            codeBlocks: [
              {
                language: "javascript",
                code: "app.get('/api/notes', (req, res) => {\n  res.json(notes);\n});\n\napp.post('/api/notes', (req, res) => {\n  const note = { id: Date.now(), text: req.body.text };\n  notes.push(note);\n  res.status(201).json(note);\n});",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Notes API",
          description: "Build a simple REST API for creating and listing notes.",
        },
        assignment: {
          title: "API testing notes",
          instructions: "Document how you tested each endpoint (e.g., with curl or Postman).",
        },
      },
      {
        day: 3,
        title: "Connecting Frontend to Backend",
        lessons: [
          {
            title: "Fetch, Async/Await & Rendering Data",
            type: "code",
            content:
              "<p>The fetch API with async/await connects your static page to your own backend. You'll render fetched data into the DOM and handle the case where the request fails.</p>",
            objectives: ["Fetch data from your own API asynchronously", "Render fetched data into the DOM with error handling"],
            codeBlocks: [
              {
                language: "javascript",
                code: "async function loadNotes() {\n  try {\n    const res = await fetch('/api/notes');\n    const notes = await res.json();\n    render(notes);\n  } catch (err) {\n    showError('Could not load notes.');\n  }\n}",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Connected frontend",
          description: "Connect your landing page to the Notes API so notes display live.",
        },
        assignment: {
          title: "Error handling review",
          instructions: "Explain what happens in your UI when the API call fails.",
        },
      },
      {
        day: 4,
        title: "Capstone: Full-Stack Notes App",
        lessons: [
          {
            title: "Shipping the Complete App",
            type: "assignment",
            content:
              "<p>Combine your frontend and Notes API into one deployed full-stack application, publicly reachable.</p>",
            objectives: ["Combine frontend and backend into one working application", "Deploy the app publicly"],
          },
        ],
        handsOnProject: {
          title: "Deployed notes app",
          description: "Deploy your full-stack notes app so it's publicly accessible.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with the deployed link in the README.",
        },
      },
    ],
  },
  {
    courseId: "devops-engineering-fundamentals",
    bannerUrl: "/course-banners/devops-engineering-fundamentals.svg",
    price: 1499,
    domainTags: ["devops-cloud"],
    skillLevel: "beginner",
    title: "Foundations · DevOps & Cloud: Git, Docker & CI/CD Basics",
    description:
      "Learn the DevOps mindset and toolchain from scratch — Git collaboration workflows, your first Docker container, and a simple automated CI/CD pipeline.",
    badge: "Beginner Friendly",
    totalDays: 16,
    rating: 4.3,
    activeStudentCount: 301,
    evaluationCriteria: STANDARD_CRITERIA("DevOps engineering"),
    modules: [
      {
        day: 1,
        title: "Git Workflows & Collaboration",
        lessons: [
          {
            title: "Branching, Merging, and Pull Requests",
            type: "reading",
            content:
              "<p>A feature-branch workflow with pull requests is how real teams collaborate without stepping on each other. You'll practice branching, and resolve a merge conflict by hand.</p>",
            objectives: ["Use a feature-branch workflow with pull requests", "Resolve a merge conflict correctly"],
          },
        ],
        handsOnProject: {
          title: "Branching practice repo",
          description: "Set up a repo with a documented branching strategy and at least one resolved conflict.",
        },
        assignment: {
          title: "Workflow writeup",
          instructions: "Document your branching strategy and why you chose it.",
        },
      },
      {
        day: 2,
        title: "Your First Docker Container",
        lessons: [
          {
            title: "Writing a Dockerfile",
            type: "code",
            content:
              "<p>A Dockerfile is a recipe for a reproducible runtime. You'll write one for a simple app, build the image, and run it locally exposing the right port.</p>",
            objectives: ["Write a Dockerfile for a simple app", "Build and run a container exposing the right port"],
            codeBlocks: [
              {
                language: "dockerfile",
                code: "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"index.js\"]",
              },
            ],
          },
        ],
        handsOnProject: {
          title: "Containerized app",
          description: "Containerize a simple app and run it locally from the built image.",
        },
        assignment: {
          title: "Dockerfile walkthrough",
          instructions: "Explain each instruction in your Dockerfile.",
        },
      },
      {
        day: 3,
        title: "Automating with CI",
        lessons: [
          {
            title: "Your First CI Pipeline",
            type: "reading",
            content:
              "<p>Continuous integration catches broken code before it merges. You'll set up a pipeline that runs your test suite automatically on every push and fails loudly when something breaks.</p>",
            objectives: ["Set up a CI pipeline that runs on every push", "Fail a build automatically when tests fail"],
          },
        ],
        handsOnProject: {
          title: "CI pipeline",
          description: "Add a CI workflow that runs your test suite on every push.",
        },
        assignment: {
          title: "Pipeline config review",
          instructions: "Document what your CI pipeline checks and why.",
        },
      },
      {
        day: 4,
        title: "Capstone: Automated Deploy",
        lessons: [
          {
            title: "From Push to Deployed",
            type: "assignment",
            content:
              "<p>Combine containerization and CI into one pipeline that deploys automatically whenever the build succeeds.</p>",
            objectives: ["Combine Docker and CI into one automated pipeline", "Deploy automatically on a successful build"],
          },
        ],
        handsOnProject: {
          title: "Automated deployment",
          description: "Ship a pipeline that deploys your containerized app automatically.",
        },
        assignment: {
          title: "Final submission",
          instructions: "Submit your GitHub repository URL with the pipeline config and live/deployed link in the README.",
        },
      },
    ],
  },
];

export async function seedCourses() {
  await connectDB();

  const results: string[] = [];
  for (const course of COURSES) {
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

    const saved = await CourseModel.findOneAndUpdate(
      { courseId: course.courseId },
      {
        $set: {
          title: course.title,
          description: course.description,
          bannerUrl: course.bannerUrl,
          price: course.price,
          badge: course.badge,
          domainTags: course.domainTags,
          skillLevel: course.skillLevel,
          totalDays: course.totalDays,
          rating: course.rating,
          activeStudentCount: course.activeStudentCount,
          evaluationCriteria: course.evaluationCriteria,
          modules: course.modules,
          totalLessons,
          active: true,
        },
        $setOnInsert: { courseId: course.courseId, createdAt: Date.now() },
      },
      { upsert: true, new: true }
    ).lean();

    results.push(saved!.courseId);
  }

  return results;
}
