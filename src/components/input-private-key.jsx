"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';
import { useRouter } from 'next/navigation'

const ESP_SERVER_URL = 'https://' + process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + '/api/'

export default function InputPrivateKey() {
  const [scanResult, setScanResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(result) {
      scanner.clear();
      setScanResult(result);
      handleSendPrivateKey(result);
    }

    function onScanError(err) {
      console.warn(err);
    }

    return () => {
      scanner.clear();
    };
  }, []);

  const handleModeChange = (mode) => {
    console.log("Mode changed to " + mode)
  
    axios.post(ESP_SERVER_URL + 'mode', 
      {
        "modeVote": mode,
      }, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).catch((err) => {
        console.log(err)
      }
    )
  }

  const handleSendPrivateKey = async (privateKey) => {
    console.log("Sending", privateKey)
    axios.post(ESP_SERVER_URL + 'privateKey', 
        {
          "privateKey": privateKey,
        }, 
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then((resp) => {
          if (resp.status === 200) {
            handleModeChange("key")
            router.push('/vote');
          } 
        }
      ).catch((err) => {
          console.log(err)
        }
      )
  }

  return (
    <div className="min-h-screen bg-[#001A1E] bg-gradient-to-br from-[#001A1E] via-[#003644] to-[#002A35]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <h1 className="text-4xl font-light text-white mb-12 text-center">
          Input Private Key
        </h1>

        <div className="backdrop-blur-sm bg-[#001214]/50 rounded-2xl p-6 border border-white/5">
          <h2 className="text-2xl font-light text-white mb-4">
            Scan Private Key
          </h2>
          {scanResult ? (
            <div className="text-center">
              <div className="mb-4 text-gray-300">
                Private key scanned successfully
              </div>
              <div className="bg-[#001214]/50 p-4 rounded-lg mb-6">
                <p className="font-mono break-all text-[#00E5CC]">{scanResult}</p>
              </div>
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
      </main>
    </div>
  );
}
