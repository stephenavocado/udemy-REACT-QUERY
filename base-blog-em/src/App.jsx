import "./App.css";

import { Posts } from "./Posts";

import { QueryClient, QueryProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    // provide React Query client to App
    <QueryClientProvider>
      <div className="App">
        <h1>Blog Posts</h1>
        <Posts />
      </div>
		</QueryClientProvider>
  );
}

export default App;