import React, { useState, useEffect } from 'react';

// --- API Configuration ---
const API_URL = 'http://127.0.0.1:5000/api';

// --- Main App Component ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simple state to toggle between public and admin
  const [loading, setLoading] = useState(false); // Set to false initially, no auth check needed for now

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  if (loading) {
    return <div className="bg-gray-100 min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isLoggedIn) {
    return <PublicSite onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}


// --- Public Facing Site Component ---
const PublicSite = ({ onLogin }) => {
  const [posts, setPosts] = useState([]);

  // Fetch posts for the public view
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        // Don't show an error on the public page, just an empty state.
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-[#F5F5DC] min-h-screen font-sans text-gray-800">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Awesome Site</h1>
        <button
          onClick={onLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Admin Login
        </button>
      </header>
      <main className="container mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="relative mb-4">
              <input type="text" placeholder="Search..." className="w-full pl-3 pr-10 py-2 border rounded-md" />
              <svg className="w-5 h-5 absolute right-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <nav className="flex flex-col space-y-1">
              {['Blog', 'Email', 'Feed', 'Admin', 'Controls'].map(item => (
                <a key={item} href="#" className="px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100">{item}</a>
              ))}
            </nav>
          </div>
        </aside>
        <section className="md:col-span-3 space-y-4">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p>{post.content}</p>
              </div>
            ))
          ) : (
            <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md text-center">
              Nothing here yet!
            </div>
          )}
        </section>
      </main>
    </div>
  );
};


// --- Admin Dashboard Components ---
const AdminDashboard = ({ onLogout }) => {
  const [adminPage, setAdminPage] = useState('write');

  return (
    <div className="bg-[#333] min-h-screen text-gray-300 font-sans">
      <header className="bg-[#222] py-4">
        <div className="container mx-auto flex justify-between items-center px-8">
          <h1 className="text-2xl text-white font-bold">My Awesome Site</h1>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm font-semibold"
          >
            Log Out
          </button>
        </div>
      </header>
      <nav className="bg-[#444] py-2">
        <div className="container mx-auto flex justify-center space-x-2">
          <AdminNavButton name="write" currentPage={adminPage} setPage={setAdminPage}>Write</AdminNavButton>
          <AdminNavButton name="manage" currentPage={adminPage} setPage={setAdminPage}>Manage</AdminNavButton>
          <AdminNavButton name="settings" currentPage={adminPage} setPage={setAdminPage}>Settings</AdminNavButton>
          <AdminNavButton name="extend" currentPage={adminPage} setPage={setAdminPage}>Extend</AdminNavButton>
        </div>
      </nav>
      <main className="container mx-auto p-8">
        {adminPage === 'write' && <WritePage />}
        {adminPage === 'manage' && <ManagePage />}
        {adminPage === 'settings' && <SettingsPage />}
        {adminPage === 'extend' && <ExtendPage />}
      </main>
    </div>
  );
};

const AdminNavButton = ({ name, currentPage, setPage, children }) => {
  const isActive = name === currentPage;
  const baseClasses = "px-12 py-3 rounded-t-md font-semibold focus:outline-none transition-colors duration-200";
  const activeClasses = "bg-[#eee] text-gray-800";
  const inactiveClasses = "bg-[#555] hover:bg-[#666]";

  return (
    <button onClick={() => setPage(name)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {children}
    </button>
  );
};

// --- Admin Sub-Pages ---
const WritePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a title and content.' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          content: content,
          feather_type: 'Text', // Defaulting to 'Text' feather
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const newPost = await response.json();
      console.log('Successfully created post:', newPost);
      setStatusMessage({ type: 'success', text: 'Post published successfully!' });
      // Clear fields after successful post
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error publishing post:', error);
      setStatusMessage({ type: 'error', text: 'Error publishing post. Is the backend server running?' });
    }

    // Clear the message after 3 seconds
    setTimeout(() => {
      setStatusMessage({ type: '', text: '' });
    }, 3000);
  };


  return (
    <div className="bg-[#eee] text-gray-800 p-6 rounded-b-lg shadow-xl">
      <div className="grid grid-cols-3 gap-px bg-gray-300">
        <div className="bg-white p-3 font-bold col-span-2">Page</div>
        <div className="bg-white p-3 font-bold">Text</div>
      </div>
      <div className="bg-white p-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />

        <label className="block text-sm font-medium text-gray-600 mb-1">Body</label>
        <div className="border border-gray-300 rounded-md">
          <div className="bg-gray-50 p-2 border-b">
            <span className="font-bold">H1 B</span> <i>I</i> ...
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-2 focus:outline-none"
          ></textarea>
        </div>

        {/* Other form fields like Status, Slug etc. can be added to state as needed */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Status</label>
            <select className="w-full p-2 border border-gray-300 rounded-md mt-1">
              <option>Public</option>
              <option>Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Pinned?</label>
            <input type="checkbox" className="mt-2" />
            <span className="ml-2 text-sm text-gray-500">shows this post above all others</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Slug</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Timestamp</label>
            <input type="text" readOnly value={new Date().toISOString().slice(0, 19).replace('T', ' ')} className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-gray-100" />
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button onClick={handlePublish} className="flex-1 bg-green-500 text-white py-3 rounded-md font-bold hover:bg-green-600">Publish</button>
          <button className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-md font-bold hover:bg-blue-200">Save</button>
        </div>
      </div>
      {statusMessage.text && (
        <div className={`mt-4 p-3 rounded-md text-center font-semibold ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {statusMessage.text}
        </div>
      )}
    </div>
  );
};

const ManagePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Fetch error:", error.message);
        setError("Failed to load posts. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-[#eee] text-gray-800 p-6 rounded-b-lg shadow-xl">
      <div className="grid grid-cols-7 gap-px bg-gray-300 mb-4">
        {['Posts', 'Pages', 'Users', 'Groups', 'Uploads', 'Import', 'Export'].map(tab => (
          <button key={tab} className={`p-3 font-semibold ${tab === 'Posts' ? 'bg-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{tab}</button>
        ))}
      </div>
      <div className="bg-white p-4">
        <div className="flex items-center space-x-2 mb-4 border-b pb-4">
          <input type="text" placeholder="Search..." className="flex-grow p-2 border rounded-md" />
          <button className="bg-gray-200 px-6 py-2 rounded-md font-semibold hover:bg-gray-300">Search</button>
          <button className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-600">⊕ New Post</button>
        </div>
        <h2 className="text-xl font-bold mb-2">Posts</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Title</th>
              <th className="p-3">Posted</th>
              <th className="p-3">Status</th>
              <th className="p-3">Author</th>
              <th className="p-3">Controls</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-3 text-center text-gray-500">Loading posts...</td></tr>
            ) : error ? (
              <tr><td colSpan="5" className="p-3 text-center text-red-500">{error}</td></tr>
            ) : posts.length > 0 ? (
              posts.map(post => (
                <tr key={post.id} className="border-b">
                  <td className="p-3">{post.title}</td>
                  <td className="p-3">{/* Date would go here */}</td>
                  <td className="p-3">Public</td>
                  <td className="p-3">Admin</td>
                  <td className="p-3">
                    <button className="text-blue-500 hover:underline">Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  ⊗ No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  // This page remains static for now, as there are no backend endpoints for settings.
  return (
    <div className="bg-[#eee] text-gray-800 p-6 rounded-b-lg shadow-xl">
      <div className="grid grid-cols-4 gap-px bg-gray-300 mb-4">
        {['General', 'Content', 'Users', 'Routes'].map(tab => (
          <button key={tab} className={`p-3 font-semibold ${tab === 'General' ? 'bg-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{tab}</button>
        ))}
      </div>
      <div className="bg-white p-6">
        <h2 className="text-2xl font-bold mb-6">General Settings</h2>
        <div className="space-y-4">
          <SettingInput label="Site Name" value="My Awesome Site" />
          <SettingInput label="Description" />
          <SettingInput label="Chyrp URL" value="http://127.0.0.1/chyrp-lite" helpText="The base URL for your site." />
          <SettingInput label="Canonical URL (optional)" helpText="Have your site URLs point someplace other than your install directory." />
          <SettingInput label="Contact Email Address" value="adithyaparameswaran72@gmail.com" type="email" />

          <div className="grid grid-cols-2 gap-4">
            <SettingSelect label="Time Zone" options={['Europe/Berlin']} />
            <SettingSelect label="Language" options={['en_US']} />
          </div>
          <SettingInput label="Monospace Font" helpText="Write with a monospace font." />
          <div className="flex items-center">
            <input type="checkbox" defaultChecked id="updates" className="mr-2" />
            <label htmlFor="updates" className="font-medium">Check for Updates</label>
            <span className="text-sm text-gray-500 ml-2">Current version: 2025.02</span>
          </div>
        </div>

        <div className="mt-8">
          <button className="bg-green-500 text-white px-8 py-2 rounded-md font-semibold hover:bg-green-600">Update</button>
        </div>
      </div>
    </div>
  );
};

// Helper component for Settings Page inputs
const SettingInput = ({ label, type = 'text', value = '', helpText = '' }) => (
  <div>
    <label className="block font-medium text-gray-700">{label}</label>
    <input type={type} defaultValue={value} className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
    {helpText && <p className="text-sm text-gray-500 mt-1">{helpText}</p>}
  </div>
);
const SettingSelect = ({ label, options }) => (
  <div>
    <label className="block font-medium text-gray-700">{label}</label>
    <select className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
      {options.map(opt => <option key={opt}>{opt}</option>)}
    </select>
  </div>
)

// --- Extend Page Components (NEWLY RE-ADDED) ---
// NOTE: The backend provided does not have endpoints for managing these settings.
// This UI is functional on the frontend but will not persist changes without backend support.

const modulesData = {
  enabled: [
    { name: 'Cascade', description: 'Adds ajax-powered infinite scrolling to your blog.' },
    { name: 'Easy Embed', description: 'Embed content in your blog by pasting its URL surrounded by <!-- and -->.' },
    { name: 'Syntax Highlighting', description: 'Adds syntax highlighting to nested <pre><code> blocks.' },
    { name: 'Lightbox', description: 'A lightbox for your images.' },
  ],
  disabled: [
    { name: 'Cacher', description: 'Caches pages, drastically reducing server load.' },
    { name: 'Categorize', description: 'Categorize your posts.' },
    { name: 'Comments', description: 'Adds commenting functionality to your posts, with webmention support.' },
    { name: 'Likes', description: 'Allow users to “like” a post.' },
    { name: 'MAPTCHA', description: 'Ask users to solve simple mathematics problems to prevent spam.' },
    { name: 'MathJax', description: 'A JavaScript display engine for mathematics.' },
    { name: 'Migration Assistant', description: 'Enables import from Wordpress, MovableType, TextPattern, and Tumblr.' },
    { name: 'Mentionable', description: 'Register webmentions from blogs that link to yours.' },
    { name: 'Post Views', description: 'Counts the number of times your posts have been viewed.' },
    { name: 'Read More', description: 'Add “…more” links to your blog index by typing <!--more--> or <!--more custom text--> in your posts.' },
    { name: 'Rights', description: 'Adds post options for attribution and assigning intellectual property rights.' },
    { name: 'Sitemap Generator', description: 'Creates a sitemap.xml file on your server to help search engines index your blog.' },
    { name: 'Tagginator', description: 'Adds tagging functionality to posts.' },
  ]
};

const feathersData = [
  { name: 'Audio', description: 'A feather for audio.' },
  { name: 'Link', description: 'Link to other sites and add an optional description.' },
  { name: 'Photo', description: 'Upload and display an image with a caption.' },
  { name: 'Quote', description: 'Post quotes and cite sources.' },
  { name: 'Text', description: 'A basic text feather.' },
  { name: 'Uploader', description: 'Upload files and make them available for visitors to download.' },
  { name: 'Video', description: 'A feather for video.' },
];

const themesData = [
  { name: 'Blossom', description: 'The default theme provided with Chyrp Lite.', active: true },
  { name: 'Sparrow', description: 'An unobtrusive tumbleblog theme for Chyrp Lite.', active: false },
  { name: 'Topaz', description: 'A minimalist responsive theme for Chyrp Lite.', active: false },
  { name: 'Umbra', description: 'A dark tumbleblog theme for Chyrp Lite.', active: false },
  { name: 'Virgula', description: 'A high-contrast theme for Chyrp Lite.', active: false },
];


const ExtendPage = () => {
  const [tab, setTab] = useState('modules');

  return (
    <div className="bg-[#eee] text-gray-800 p-6 rounded-b-lg shadow-xl">
      <div className="grid grid-cols-3 gap-px bg-gray-300 mb-4">
        <ExtendTabButton name="modules" currentTab={tab} setTab={setTab}>Modules</ExtendTabButton>
        <ExtendTabButton name="feathers" currentTab={tab} setTab={setTab}>Feathers</ExtendTabButton>
        <ExtendTabButton name="themes" currentTab={tab} setTab={setTab}>Themes</ExtendTabButton>
      </div>
      <div>
        {tab === 'modules' && <ModulesTab />}
        {tab === 'feathers' && <FeathersTab />}
        {tab === 'themes' && <ThemesTab />}
      </div>
    </div>
  );
};

const ExtendTabButton = ({ name, currentTab, setTab, children }) => {
  const isActive = name === currentTab;
  return (
    <button
      onClick={() => setTab(name)}
      className={`p-3 font-semibold ${isActive ? 'bg-white' : 'bg-gray-100 hover:bg-gray-200'}`}
    >
      {children}
    </button>
  );
};

const ModulesTab = () => {
  const [modules, setModules] = useState(modulesData);

  const toggleModule = (moduleName, status) => {
    setModules(prev => {
      if (status === 'enabled') {
        const moduleToMove = prev.enabled.find(m => m.name === moduleName);
        return {
          enabled: prev.enabled.filter(m => m.name !== moduleName),
          disabled: [...prev.disabled, moduleToMove].sort((a, b) => a.name.localeCompare(b.name)),
        };
      } else {
        const moduleToMove = prev.disabled.find(m => m.name === moduleName);
        return {
          disabled: prev.disabled.filter(m => m.name !== moduleName),
          enabled: [...prev.enabled, moduleToMove].sort((a, b) => a.name.localeCompare(b.name)),
        };
      }
    });
  };

  return (
    <div className="bg-white p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2 border-b pb-2">Enabled</h2>
        <div className="space-y-2 mt-2">
          {modules.enabled.map(mod => (
            <div key={mod.name} className="bg-green-100 border border-green-200 p-3 rounded-md flex justify-between items-center">
              <div>
                <h3 className="font-bold">{mod.name} ⓘ</h3>
                <p className="text-sm text-gray-600">{mod.description}</p>
              </div>
              <button onClick={() => toggleModule(mod.name, 'enabled')} className="bg-white border border-gray-300 px-4 py-1 rounded-md text-sm font-semibold hover:bg-gray-50">Disable</button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2 border-b pb-2">Disabled</h2>
        <div className="space-y-2 mt-2">
          {modules.disabled.map(mod => (
            <div key={mod.name} className="bg-gray-50 border p-3 rounded-md flex justify-between items-center">
              <div>
                <h3 className="font-bold">{mod.name} ⓘ</h3>
                <p className="text-sm text-gray-600">{mod.description}</p>
              </div>
              <button onClick={() => toggleModule(mod.name, 'disabled')} className="bg-white border border-gray-300 px-4 py-1 rounded-md text-sm font-semibold hover:bg-gray-50">Enable</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeathersTab = () => {
  // In a real app, this state would determine which feathers are enabled/disabled
  const [feathers, setFeathers] = useState(feathersData.map(f => ({ ...f, enabled: true })));

  const toggleFeather = (featherName) => {
    setFeathers(prev => prev.map(f => f.name === featherName ? { ...f, enabled: !f.enabled } : f));
  }

  return (
    <div className="bg-white p-4">
      <h2 className="text-xl font-bold mb-2 border-b pb-2">Enabled</h2>
      <div className="space-y-2 mt-2">
        {feathers.filter(f => f.enabled).map(feather => (
          <div key={feather.name} className="bg-green-100 border border-green-200 p-3 rounded-md flex justify-between items-center">
            <div>
              <h3 className="font-bold">{feather.name} ⓘ</h3>
              <p className="text-sm text-gray-600">{feather.description}</p>
            </div>
            <button onClick={() => toggleFeather(feather.name)} className="bg-white border border-gray-300 px-4 py-1 rounded-md text-sm font-semibold hover:bg-gray-50">Disable</button>
          </div>
        ))}
      </div>
      {feathers.some(f => !f.enabled) && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2 border-b pb-2">Disabled</h2>
          <div className="space-y-2 mt-2">
            {feathers.filter(f => !f.enabled).map(feather => (
              <div key={feather.name} className="bg-gray-50 border p-3 rounded-md flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{feather.name} ⓘ</h3>
                  <p className="text-sm text-gray-600">{feather.description}</p>
                </div>
                <button onClick={() => toggleFeather(feather.name)} className="bg-white border border-gray-300 px-4 py-1 rounded-md text-sm font-semibold hover:bg-gray-50">Enable</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ThemesTab = () => {
  const [themes, setThemes] = useState(themesData);

  const selectTheme = (themeName) => {
    setThemes(prev => prev.map(t => ({ ...t, active: t.name === themeName })));
  };

  return (
    <div className="bg-white p-4">
      <h2 className="text-xl font-bold mb-2 border-b pb-2">Blog Themes</h2>
      <div className="space-y-2 mt-2">
        {themes.map(theme => (
          <div key={theme.name} className={`border p-3 rounded-md flex justify-between items-center ${theme.active ? 'bg-green-100 border-green-200' : 'bg-gray-50'}`}>
            <div>
              <h3 className="font-bold">{theme.name} ⓘ</h3>
              <p className="text-sm text-gray-600">{theme.description}</p>
            </div>
            <div className="space-x-2">
              <button className="bg-white border border-gray-300 px-4 py-1 rounded-md text-sm font-semibold hover:bg-gray-50">Preview</button>
              {!theme.active && <button onClick={() => selectTheme(theme.name)} className="bg-white border border-gray-300 px-4 py-1 rounded-md text-sm font-semibold hover:bg-gray-50">Select</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

