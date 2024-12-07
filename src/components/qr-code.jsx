"use client";

import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { QRCodeSVG } from "qrcode.react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRPage() {
  return (
    <div className="min-h-screen bg-[#001A1E] bg-gradient-to-br from-[#001A1E] via-[#003644] to-[#002A35]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <h1 className="text-4xl font-light text-white mb-12 text-center">
          PollPal QR Code Tools
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          <QRCodeGenerator />
          <QRCodeReader />
        </div>
      </main>
    </div>
  );
}

function QRCodeGenerator() {
  const [text, setText] = useState("");

  return (
    <div className="backdrop-blur-sm bg-[#001214]/50 rounded-2xl p-6 border border-white/5">
      <h2 className="text-2xl font-light text-white mb-4">QR Code Generator</h2>
      <div className="mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text for QR code"
          className="w-full px-4 py-2 rounded-md bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00E5CC]"
        />
      </div>
      <div className="flex justify-center bg-white p-4 rounded-md">
        <QRCodeSVG value={text || "https://pollpal.com"} size={200} />
      </div>
    </div>
  );
}

function QRCodeReader() {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(result);
    }

    function error(err) {
      console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="backdrop-blur-sm bg-[#001214]/50 rounded-2xl p-6 border border-white/5">
      <h2 className="text-2xl font-light text-white mb-4">QR Code Reader</h2>
      {scanResult ? (
        <div className="text-center">
          <div className="mb-4 text-gray-300">
            QR Code scanned successfully
          </div>
          <div className="bg-[#001214]/50 p-4 rounded-lg mb-6">
            <p className="font-mono break-all text-[#00E5CC]">{scanResult}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#00E5CC] text-gray-900 px-6 py-2 rounded-md hover:bg-[#00C4B0] transition-colors"
          >
            Scan Again
          </button>
        </div>
      ) : (
        <div>
          <div id="reader" className="mx-auto overflow-hidden rounded-lg"></div>
          <p className="text-center mt-4 text-gray-400">
            Please position the QR code within the frame
          </p>
        </div>
      )}
    </div>
  );
}
