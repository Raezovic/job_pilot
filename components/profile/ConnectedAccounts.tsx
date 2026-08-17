"use client";

import { useState } from "react";

export function ConnectedAccounts() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-4">
      <div>
        <h2 className="text-base sm:text-lg font-bold text-text-primary">
          Connected Accounts
        </h2>
        <p className="text-xs sm:text-sm font-medium text-text-secondary mt-1">
          Connect your LinkedIn to let the agent handle manual apply with LinkedIn workflows.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center gap-3.5">
          {/* LinkedIn Icon Container */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linkedin-light/50 p-2 text-linkedin">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-linkedin text-linkedin-foreground shadow-2xs font-bold text-sm">
              in
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary leading-tight">
              LinkedIn
            </h3>
            <p className="text-xs font-medium text-text-muted mt-0.5">
              {isConnected ? "Connected" : "Not connected"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsConnected(!isConnected)}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer ${
            isConnected
              ? "bg-surface-secondary border border-border text-text-primary hover:bg-border-light"
              : "bg-linkedin hover:bg-linkedin/90 text-linkedin-foreground"
          }`}
        >
          {isConnected ? "Disconnect" : "Connect LinkedIn"}
        </button>
      </div>
    </div>
  );
}
