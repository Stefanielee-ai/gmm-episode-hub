import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      // 仅保留 video 类型结果，避免频道类型导致报错
      const videoItems = (data.items || []).filter((item: any) => item.id.kind === 'youtube#video');
      setResults(videoItems);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Head>
        <title>GMM Episode Hub | YouTube Search</title>
      </Head>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">GMM Episode Search</h1>
          <p className="text-gray-600 mt-2">Find your favorite episodes quickly.</p>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter keywords (e.g., 'Will It?')"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item: any) => (
              <div key={item.id.videoId} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-2">
                <img 
                  src={item.snippet.thumbnails.medium.url} 
                  alt={item.snippet.title} 
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="font-semibold text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                  <a href={`https://www.youtube.com/watch?v=${item.id.videoId}`} target="_blank" rel="noopener noreferrer">
                    {item.snippet.title}
                  </a>
                </h3>
                <p className="text-xs text-gray-500">{item.snippet.channelTitle}</p>
              </div>
            ))}
            {!loading && results.length === 0 && (
              <p className="text-gray-500 italic">No search results found.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
