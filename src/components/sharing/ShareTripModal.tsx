'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, Link2, ToggleLeft, ToggleRight, Trash2, Plus, AlertCircle, Globe } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { TripShareRow, fetchTripShares, createTripShare, setTripShareActive, deleteTripShare } from '@/lib/api/sharing';

export interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  tripName: string;
}

export function ShareTripModal({ isOpen, onClose, tripId, tripName }: ShareTripModalProps) {
  const [shares, setShares] = useState<TripShareRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || 'https://globetrotter.app';

  const loadShares = async () => {
    setIsLoading(true);
    const { data, error: err } = await fetchTripShares(tripId);
    setShares(data);
    if (err) setError(err);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadShares();
      setError(null);
      setCopiedToken(null);
    }
  }, [isOpen, tripId]);

  const handleCreate = async () => {
    setIsCreating(true);
    setError(null);
    const { data, error: err } = await createTripShare(tripId);
    if (err || !data) {
      setError(err || 'Could not generate share link.');
    } else {
      setShares((prev) => [data, ...prev]);
    }
    setIsCreating(false);
  };

  const handleToggle = async (share: TripShareRow) => {
    const { error: err } = await setTripShareActive(share.id, !share.is_active);
    if (err) {
      setError(err);
    } else {
      setShares((prev) =>
        prev.map((s) => (s.id === share.id ? { ...s, is_active: !s.is_active } : s))
      );
    }
  };

  const handleDelete = async (shareId: string) => {
    if (!confirm('Delete this share link? Anyone using it will lose access.')) return;
    const { error: err } = await deleteTripShare(shareId);
    if (err) {
      setError(err);
    } else {
      setShares((prev) => prev.filter((s) => s.id !== shareId));
    }
  };

  const handleCopy = (token: string) => {
    const url = `${origin}/shared/${token}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2500);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share "${tripName}"`} maxWidth="md">
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-4 rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-700 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-300 flex items-start gap-2">
        <Globe className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
        <span>
          Share links allow anyone with the URL to view your trip itinerary in read-only mode — no login required.
          Only you can manage these links.
        </span>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center py-6 text-xs text-slate-400">Loading share links...</p>
        ) : shares.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No share links yet. Create one to share this trip with anyone.
          </div>
        ) : (
          shares.map((share) => {
            const url = `${origin}/shared/${share.share_token}`;
            const isCopied = copiedToken === share.share_token;
            return (
              <div
                key={share.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[11px] font-mono text-slate-500 truncate max-w-[200px] sm:max-w-[260px]">
                      /shared/{share.share_token}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={share.is_active ? 'success' : 'secondary'} size="sm">
                      {share.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(share.share_token)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      isCopied
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Link
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleToggle(share)}
                    title={share.is_active ? 'Deactivate link' : 'Activate link'}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {share.is_active ? (
                      <ToggleRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(share.id)}
                    title="Delete share link"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
        <Button type="button" variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button
          type="button"
          variant="primary"
          isLoading={isCreating}
          onClick={handleCreate}
        >
          <Plus className="h-4 w-4" />
          Generate New Share Link
        </Button>
      </div>
    </Modal>
  );
}
