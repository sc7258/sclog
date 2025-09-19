'use client';

import { useEffect, useRef, useState } from 'react';

type AdUnitStatus = 'idle' | 'rendered' | 'blocked';

type AdUnitProps = {
  adClientId?: string;
  adSlotId?: string;
  adFormat?: string;
  isResponsive?: boolean;
  className?: string;
  fallbackMessage?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const DEFAULT_FALLBACK_MESSAGE =
  '광고가 차단된 것 같습니다. 광고 수익은 서비스 운영에 큰 도움이 됩니다.';

export default function AdUnit({
  adClientId,
  adSlotId,
  adFormat = 'auto',
  isResponsive = true,
  className,
  fallbackMessage = DEFAULT_FALLBACK_MESSAGE,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const [status, setStatus] = useState<AdUnitStatus>('idle');

  useEffect(() => {
    const element = adRef.current;
    if (!element) {
      return;
    }

    if (!adClientId || !adSlotId) {
      setStatus('blocked');
      return;
    }

    const observer = new MutationObserver(() => {
      const hasRendered = (adRef.current?.clientHeight ?? 0) > 0;
      if (hasRendered) {
        setStatus('rendered');
        observer.disconnect();
        window.clearTimeout(timeoutId);
      }
    });

    observer.observe(element, { childList: true, subtree: true });

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn('AdSense 로딩 중 오류가 발생했습니다.', err);
      setStatus('blocked');
      observer.disconnect();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const hasRendered = (adRef.current?.clientHeight ?? 0) > 0;
      if (!hasRendered) {
        setStatus('blocked');
        observer.disconnect();
      }
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [adClientId, adSlotId]);

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={adClientId}
        data-ad-slot={adSlotId}
        data-ad-format={adFormat}
        data-full-width-responsive={isResponsive ? 'true' : undefined}
      />
      {status === 'blocked' && (
        <div className="mt-4 rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500">
          {fallbackMessage}
        </div>
      )}
    </div>
  );
}
