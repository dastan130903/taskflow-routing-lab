export default function StatusMessage({
  loading,
  error,
  empty = false,
  retry,
  children,
}) {
  if (loading) {
    return <div className="route-loader" role="status">Loading tasks…</div>;
  }

  if (error) {
    return (
      <div className="notice error" role="alert">
        {error}
        {retry && (
          <button type="button" className="button outline" onClick={retry}>
            Try again
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return <p className="empty-state">No matching tasks found.</p>;
  }

  return children;
}
