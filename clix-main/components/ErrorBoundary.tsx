import React from 'react';

interface State { hasError: boolean; error?: Error | null; }

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: any) {
        console.error('Uncaught error in React tree:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--bg-main)] text-[var(--text-main)]">
                    <div className="max-w-2xl text-center uni-pill-card p-8 border border-[var(--border-color)] rounded-2xl">
                        <h2 className="text-2xl font-black mb-4">Something went wrong</h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">An unexpected error occurred. Try reloading the page. If the problem persists, check the developer console for details.</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-primary text-white rounded-2xl font-bold">Reload</button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
