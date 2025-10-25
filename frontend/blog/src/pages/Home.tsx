interface HomeProps {
  onLogout: () => void;
}

export default function Home({ onLogout }: HomeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-4">
      <div className="bg-gray-800 text-white border-[1px] border-gray-700 shadow-lg w-full sm:w-auto p-6 sm:p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
        <p className="mb-4">You are logged in.</p>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700 cursor-pointer transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
