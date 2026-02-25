# 🚀 IntelliSearch: AI-Powered Semantic Search Engine

IntelliSearch is a next-generation semantic search platform that allows users to discover information using natural language, understanding **meaning and context** rather than just matching keywords. Designed for modern teams, it provides a sophisticated interface for managing knowledge and search insights.

![App Theme](https://img.shields.io/badge/Theme-Navy%20Gradient-blue)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Tailwind%20%7C%20Vector%20Search-teal)

## ✨ Features

### 🔍 Semantic Vector Search
- **Meanings, Not Keywords**: Find documents based on conceptual relevance.
- **Context Awareness**: Understands the intent behind complex natural language queries.
- **Lightning Fast**: Optimized vector search indexing for millisecond response times.

### 📊 Intelligent Dashboard
- **Insights at a Glance**: Track search performance, successful query rates, and team engagement.
- **Actionable Metrics**: Visualize how your search engine is being utilized.

### 🧠 Team Memory
- **Collaborative Knowledge**: Save and pin high-performing search patterns for the whole team.
- **Expert Curation**: Tag and categorize search results to build a shared brain for your organization.

### 🛡️ Governance & Tracking
- **Audit Logs**: Full visibility into search activities and system interactions.
- **Policy Management**: Define and enforce search policies to ensure data relevance and security.

### 🎨 Premium Aesthetics
- **Navy Gradient Theme**: A professional, easy-on-the-eyes dark navy theme with subtle glows.
- **Glassmorphism UI**: Modern, translucent components for a state-of-the-art user experience.

---

## 🛠️ Tech Stack

- **Frontend**: [React.js](https://reactjs.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Infrastructure**: [Base44 SDK](https://base44.com/) (MongoDB Atlas Vector Search)
- **Deployment**: Integrated with Base44 platform for rapid prototyping.

---

## 🚀 Getting Started

### Prerequisites

1.  **Clone the repository**:
    ```bash
    git clone [your-repo-url]
    cd IntelliSearch
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create an `.env.local` file in the root directory:
    ```env
    VITE_BASE44_APP_ID=your_app_id
    VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
    ```

### Local Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📖 How It Works

IntelliSearch leverages **Vector Embeddings** to convert text into multi-dimensional numerical representations. When a user searches, the engine doesn't look for matching characters; it finds vectors in the same conceptual "neighborhood."

1.  **Ingestion**: Documents are processed and converted into vectors.
2.  **Search**: Queries are embedded and compared against the document database using cosine similarity.
3.  **Refinement**: Team feedback and "Team Memory" rankings help the system learn and improve results over time.

---

## 🤝 Support

For more details, visit the [Base44 Documentation](https://docs.base44.com/) or reach out via the [Support Portal](https://app.base44.com/support).

---
*Built for the future of information discovery.*