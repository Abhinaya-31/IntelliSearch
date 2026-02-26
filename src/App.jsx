import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from './tempFolder/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './tempFolder/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

function AuthenticatedApp() {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      // Auto-detect if new user with zero queries/documents and seed data
      const seedData = async () => {
        try {
          const queries = await base44.entities.SearchQuery.list("-created_date", 1);
          if (queries.length === 0) {
            // Seed a document
            await base44.entities.SearchDocument.create({
              title: "What is Semantic Search in MongoDB?",
              content: "Semantic search uses vector embeddings to find data based on conceptual meaning rather than exact keywords. MongoDB Atlas Vector Search allows you to build AI-powered applications easily.",
              category: "technical",
              status: "indexed"
            });
            await base44.entities.SearchDocument.create({
              title: "Base44 Platform Overview",
              content: "Base44 provides a low-code infrastructure layer designed for rapid prototyping and AI hackathons. It eliminates tedious backend setups.",
              category: "business",
              status: "indexed"
            });
            // Seed a query
            await base44.entities.SearchQuery.create({
              query_text: "How do vector databases work?",
              results_count: 5,
              was_successful: true,
              response_time_ms: 241
            });

            // Seed Team Memory
            await base44.entities.TeamMemory.create({
              query_pattern: "MongoDB Vector Search",
              best_query: "How to implement hybrid search in MongoDB Atlas?",
              saved_query: "MongoDB Vector Search",
              selected_documents: 2,
              user_id: "admin",
              user_email: "admin@example.com",
              team: "Engineering",
              notes: "Great resources for setting up the new search algorithm.",
              tags: ["mongodb", "vector-search", "hybrid"],
              category: "expert",
              success_rate: 95,
              usage_count: 12,
              is_pinned: true
            });
            await base44.entities.TeamMemory.create({
              query_pattern: "Error 500 API Gateway",
              best_query: "API Gateway 500 Internal Server Error troubleshooting",
              saved_query: "Error 500 API Gateway",
              selected_documents: 1,
              user_id: "support",
              user_email: "support@example.com",
              team: "Support",
              notes: "Common troubleshooting steps for gateway timeouts.",
              tags: ["api", "error-500", "troubleshooting"],
              category: "common",
              success_rate: 88,
              usage_count: 45,
              is_pinned: false
            });
          }
        } catch (e) {
          console.error("Seeding failed", e);
        }
      };
      seedData();
    }
  }, [isAuthenticated]);

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }


  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App