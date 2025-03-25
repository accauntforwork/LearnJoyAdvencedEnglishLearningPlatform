const NotFound = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="text-lg mt-2">Page Not Found</p>
      <a href="/" className="text-blue-500 underline mt-4 inline-block">
        Go to Home
      </a>
    </div>
  );
};

export default NotFound;
