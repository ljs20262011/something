import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EcoSphere uncaught runtime error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('ecosphere_character_data');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-4">
          <div className="bg-white border-2 border-rose-200 rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-black text-[#1B4332]">화면을 불러오는 중 문제가 발생했습니다</h2>
            <p className="text-xs text-[#52796F] leading-relaxed">
              브라우저 캐시 또는 환경적 요인으로 인해 일시적인 오류가 발생했습니다. 아래 버튼을 눌러 안전하게 다시 로드하거나 초기화할 수 있습니다.
            </p>

            {this.state.error && (
              <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3 text-left">
                <p className="text-[11px] font-mono text-rose-800 break-all">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:flex-1 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                페이지 다시 불러오기
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:flex-1 py-3 bg-[#F1F5F9] hover:bg-rose-50 text-[#475569] hover:text-rose-700 font-bold text-xs rounded-xl border border-[#E2E8F0] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                데이터 초기화 후 복구
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
