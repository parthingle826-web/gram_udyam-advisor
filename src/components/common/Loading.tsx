interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({
  message = "Loading...",
  fullScreen = false,
}: LoadingProps) {
  return (
    <div
      className={`
        flex items-center justify-center
        ${fullScreen ? "min-h-screen" : "py-12"}
      `}
    >
      <div className="text-center">

        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

        <p className="mt-4 text-sm text-gray-600">
          {message}
        </p>

      </div>
    </div>
  );
}