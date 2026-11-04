export default function StatusMessage({loading,error,empty,retry,children}) {
 if(loading)return <div className="center-state" role="status"><div className="spinner"/><p>Loading data from Fake API…</p></div>;
 if(error)return <div className="center-state error-text" role="alert"><strong>Something went wrong</strong><p>{error}</p>{retry&&<button className="button outline" onClick={retry}>Try again</button>}</div>;
 if(empty)return <div className="center-state"><strong>No results found</strong><p>Try changing the filters or create your first task.</p></div>;
 return children;
}
