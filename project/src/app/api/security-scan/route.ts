import { NextRequest, NextResponse } from 'next/server';
import {
  scanSSL,
  scanObservatory,
  inspectHeaders,
  extractDomain,
  parseObservatoryToHeaders,
  type SecurityHeadersResult,
  type SSLLabsResult,
  type ObservatoryResult,
} from '@/features/vulnerability-scanner/utils/apiClients';
import type { RealScanData } from '@/features/vulnerability-scanner/utils/realScanParser';

// Cache for scan results (5 minutes TTL)
const scanCache = new Map<string, { data: RealScanData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target, useRealScan = true } = body;

    if (!target || typeof target !== 'string') {
      return NextResponse.json(
        { error: 'Target URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(target);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Check cache - use domain as key to avoid caching different paths on same domain
    const domain = extractDomain(target);
    const cacheKey = domain || target;
    const cached = scanCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Returning cached scan result for:', cacheKey);
      return NextResponse.json(cached.data);
    }

    // If real scan is disabled, return empty data
    if (!useRealScan) {
      return NextResponse.json({
        target,
        timestamp: new Date().toISOString(),
      } as RealScanData);
    }

    const extractedDomain = extractDomain(target);
    if (!extractedDomain) {
      return NextResponse.json(
        { error: 'Could not extract domain from URL' },
        { status: 400 }
      );
    }

    console.log('Starting real security scan for:', extractedDomain);

    // Run scans in parallel with timeout
    // Note: scanSecurityHeaders internally calls Observatory, so we skip it to avoid duplication
    const timeout = 30000; // 30 seconds timeout
    const scanPromises = [
      Promise.race([
        scanObservatory(extractedDomain),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), timeout)),
      ]),
      Promise.race([
        scanSSL(extractedDomain),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), timeout)),
      ]),
      Promise.race([
        inspectHeaders(target),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), timeout)),
      ]),
    ];

    const [observatory, sslAnalysis, directHeaders] = await Promise.all(scanPromises);

    // Convert Observatory result to SecurityHeaders format for consistency
    let securityHeaders: SecurityHeadersResult | undefined;
    if (observatory && 'scan_id' in observatory) {
      securityHeaders = parseObservatoryToHeaders(observatory as ObservatoryResult);
    }

    const scanData: RealScanData = {
      target,
      timestamp: new Date().toISOString(),
      securityHeaders: securityHeaders,
      sslAnalysis: (sslAnalysis && 'host' in sslAnalysis) 
        ? (sslAnalysis as SSLLabsResult) 
        : undefined,
      observatory: (observatory && 'scan_id' in observatory) 
        ? (observatory as ObservatoryResult) 
        : undefined,
      directHeaders: (directHeaders && typeof directHeaders === 'object' && !('grade' in directHeaders) && !('host' in directHeaders) && !('scan_id' in directHeaders)) 
        ? (directHeaders as Record<string, string>) 
        : undefined,
    };

    console.log('Scan results:', {
      hasSecurityHeaders: !!scanData.securityHeaders,
      hasSSLAnalysis: !!scanData.sslAnalysis,
      hasObservatory: !!scanData.observatory,
      hasDirectHeaders: !!scanData.directHeaders,
      target: extractedDomain,
    });

    // Cache result using domain as key
    scanCache.set(cacheKey, {
      data: scanData,
      timestamp: Date.now(),
    });
    console.log('Cached scan result for:', cacheKey);

    // Clean old cache entries
    if (scanCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of scanCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          scanCache.delete(key);
        }
      }
    }

    return NextResponse.json(scanData);
  } catch (error) {
    console.error('Security scan API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform security scan' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Security Scan API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/security-scan - Perform security scan on target URL',
    },
  });
}

