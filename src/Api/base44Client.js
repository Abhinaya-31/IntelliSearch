import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

// Fallback Mock Implementation for Hackathon (when no actual backend is connected)
if (!appId || appId === "local" || appId === "default") {
  console.log("Initializing Base44 Local Storage Mock...");

  const getLocal = (key) => JSON.parse(localStorage.getItem(`mock_${key}`) || "[]");
  const setLocal = (key, data) => localStorage.setItem(`mock_${key}`, JSON.stringify(data));

  base44.entities = {
    SearchQuery: {
      list: async () => getLocal('SearchQuery').sort((a, b) => b.created_date - a.created_date),
      create: async (data) => {
        const items = getLocal('SearchQuery');
        const newItem = { id: Date.now().toString(), created_date: Date.now(), ...data };
        setLocal('SearchQuery', [...items, newItem]);
        return newItem;
      },
      update: async (id, data) => {
        const items = getLocal('SearchQuery');
        const index = items.findIndex(i => i.id === id);
        if (index > -1) {
          items[index] = { ...items[index], ...data };
          setLocal('SearchQuery', items);
          return items[index];
        }
      }
    },
    Feedback: {
      list: async () => getLocal('Feedback').sort((a, b) => (b.created_date || 0) - (a.created_date || 0)),
      create: async (data) => {
        const items = getLocal('Feedback');
        const newItem = { id: Date.now().toString(), created_date: Date.now(), ...data };
        setLocal('Feedback', [...items, newItem]);
        return newItem;
      }
    },
    SearchDocument: {
      list: async () => getLocal('SearchDocument'),
      create: async (data) => {
        const items = getLocal('SearchDocument');
        const newItem = { id: Date.now().toString(), created_date: Date.now(), ...data };
        setLocal('SearchDocument', [...items, newItem]);
        return newItem;
      },
      delete: async (id) => {
        const items = getLocal('SearchDocument');
        setLocal('SearchDocument', items.filter(i => i.id !== id));
      }
    },
    SearchPolicy: {
      list: async () => getLocal('SearchPolicy').sort((a, b) => b.created_date - a.created_date),
      create: async (data) => {
        const items = getLocal('SearchPolicy');
        const newItem = { id: Date.now().toString(), created_date: Date.now(), ...data };
        setLocal('SearchPolicy', [...items, newItem]);
        return newItem;
      },
      update: async (id, data) => {
        const items = getLocal('SearchPolicy');
        const index = items.findIndex(i => i.id === id);
        if (index > -1) {
          items[index] = { ...items[index], ...data };
          setLocal('SearchPolicy', items);
          return items[index];
        }
      },
      delete: async (id) => {
        const items = getLocal('SearchPolicy');
        setLocal('SearchPolicy', items.filter(i => i.id !== id));
      }
    },
    AuditLog: {
      list: async (sort, limit) => {
        let items = getLocal('AuditLog').sort((a, b) => b.created_date - a.created_date) || [];
        if (limit) items = items.slice(0, limit);
        return items;
      },
      create: async (data) => {
        const items = getLocal('AuditLog') || [];
        const newItem = { id: Date.now().toString(), created_date: Date.now(), ...data };
        setLocal('AuditLog', [...items, newItem]);
        return newItem;
      }
    },
    TeamMemory: {
      list: async (sort, limit) => {
        let items = getLocal('TeamMemory').sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0)) || [];
        if (limit) items = items.slice(0, limit);
        return items;
      },
      create: async (data) => {
        const items = getLocal('TeamMemory') || [];
        const newItem = { id: Date.now().toString(), created_date: Date.now(), ...data };
        setLocal('TeamMemory', [...items, newItem]);
        return newItem;
      },
      update: async (id, data) => {
        const items = getLocal('TeamMemory');
        const index = items.findIndex(i => i.id === id);
        if (index > -1) {
          items[index] = { ...items[index], ...data };
          setLocal('TeamMemory', items);
          return items[index];
        }
      },
      delete: async (id) => {
        const items = getLocal('TeamMemory');
        setLocal('TeamMemory', items.filter(i => i.id !== id));
      }
    }
  };

  base44.integrations = {
    Core: {
      InvokeLLM: async ({ prompt }) => {
        await new Promise(r => setTimeout(r, 800)); // fake delay
        const docs = getLocal('SearchDocument');
        const results = docs.map((d, i) => ({
          document_index: i,
          similarity_score: Math.random() * 0.4 + 0.5,
          explanation: "Semantic match found in document content."
        }));
        return { intent: "lookup", results };
      },
      SendEmail: async () => {
        return { success: true };
      },
      UploadFile: async () => {
        return { file_url: "mock_url" };
      },
      ExtractDataFromUploadedFile: async () => {
        return { output: { text_content: "Mock extracted content from file." } };
      }
    }
  };
}

// Middleware: Log User Action
let searchCount = 0;
let lastSearchTime = Date.now();

export const logUserAction = async (action, details, extraData = {}) => {
  try {
    const user = JSON.parse(localStorage.getItem('currentUser')) || { id: 'guest', email: 'guest@example.com' };
    let severity = 'info';

    // Suspicious Activity Detection
    if (action === 'search') {
      const now = Date.now();
      if (now - lastSearchTime > 60000) { // reset every minute
        searchCount = 1;
        lastSearchTime = now;
      } else {
        searchCount++;
      }
      if (searchCount > 20) {
        severity = 'critical';
        details = 'Suspicious activity: Over 20 searches in 1 minute. ' + details;
      }
    }

    if (action === 'delete_action' || action === 'policy_change') {
      severity = 'warning';
    }

    if (extraData?.severity) {
      severity = extraData.severity;
      delete extraData.severity;
    }

    await base44.entities.AuditLog.create({
      action,
      details,
      user_id: user.id || 'system',
      severity,
      timestamp: Date.now(),
      ip_address: '127.0.0.1', // mock
      ...extraData
    });
  } catch (err) {
    console.error('Failed to log action', err);
  }
};

