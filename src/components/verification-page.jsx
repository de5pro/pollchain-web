"use client";

require("dotenv").config();

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Camera, ChevronRight } from "lucide-react";
import mqtt from "mqtt";
import Webcam from "react-webcam";
import axios from 'axios';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation'

const MQTT_TOPIC_NPM = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + "/npm";
const MQTT_TOPIC_PIN = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + "/pin";
const MQTT_TOPIC_BUTTON = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + "/button";
const MQTT_BROKER_URL = process.env.NEXT_PUBLIC_MQTT_BROKER;
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const ESP_SERVER_URL = 'https://' + process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + '/api/'

export default function VerificationPage() {
  const [npm, setNpm] = useState(Array(10).fill(""));
  const [pin, setPin] = useState(Array(6).fill(""));
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFaceVerified, setIsFaceVerified] = useState(false);
  const [inCapture, setInCapture] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);
  const router = useRouter();

  const handleSendToken = async (token) => {
    axios.post(ESP_SERVER_URL + 'token', 
      {
        "token": token,
      }, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((resp) => {
        if (resp.status === 200) {
          setTimeout(() => router.push('/private-key'), 5000)
        } 

        setTimeout(() => router.push('/private-key'), 2000)
      }
    ).catch((err) => {
        console.log(err)
      }
    )
  }

  const handleModeChange = (mode) => {
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

  useEffect(() => {
    if (npm.every((digit) => digit !== "")) {
      handleModeChange("pin")
    }
  }, [npm]);

  useEffect(() => {
    if (pin.every((digit) => digit !== "")) {
      handleModeChange("capture")
    }
  }, [pin]);

  useEffect(() => {
    if (capturedImage !== null) {
      verifyFace()
    }
  }, [capturedImage]);

  const handleDelete = (mode) => {
    if (capturedImage) {
      setCapturedImage(null);
      setIsFaceVerified(false);
    } else {
      console.log(mode)
      if (mode === "deleteNpm") {
        deleteOtpInput(setNpm);
      } else if (mode === "deletePin") {
        deleteOtpInput(setPin);
      }
    }
  }

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER_URL, {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    });

    client.on("connect", () => {
      console.log("Connected")
      client.subscribe([MQTT_TOPIC_NPM, MQTT_TOPIC_PIN, MQTT_TOPIC_BUTTON]);
    });

    client.on("message", (topic, message) => {
      const char = new TextDecoder("utf-8").decode(message);
      console.log(topic)
      console.log(char)

      if (topic === MQTT_TOPIC_NPM && npm.includes("")) {
        updateOtpInput(setNpm, char);
      } else if (topic === MQTT_TOPIC_PIN && pin.includes("")) {
        updateOtpInput(setPin, char);
      } else if (topic === MQTT_TOPIC_BUTTON) {
        
        if (char.includes("delete") ) {
          handleDelete(char);
        } else if (char === "capture") {
          captureImage();
        }
      } 
    });

    return () => {
      client.end();
    };
  }, []);

  const updateOtpInput = (setOtpState, char) => {
    setOtpState((prev) => {
      const firstEmptyIndex = prev.findIndex((digit) => digit === "");
      if (firstEmptyIndex !== -1) {
        const updated = [...prev];
        updated[firstEmptyIndex] = char;
        return updated;
      }
      return prev;
    });
  };
  
  const deleteOtpInput = (setOtpState) => {
    setOtpState((prev) => {
      const lastFilledIndex = prev.slice().reverse().findIndex((digit) => digit !== "");
      if (lastFilledIndex !== -1) {
        const updated = [...prev];
        updated[prev.length - 1 - lastFilledIndex] = "";
        return updated;
      }
      return prev;
    });
  };

  const handleNpmComplete = (value) => setNpm(value);
  const handlePinComplete = (value) => setPin(value);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const verifyFace = async () => {
    setIsLoading(true)

    if (!capturedImage) {
      console.error("No face photo captured for login.");
      return;
    }
   

    try {
      // Convert capturedImage (Base64 string) to a Blob
    const imageBlob = await (await fetch(capturedImage)).blob(); 
    
    const result = await axios.postForm(API_BASE_URL + 'login', {
      npm: npm.join(""),
      password: pin.join(""),
      photo_face: imageBlob,
    })

    // const result = await axios.postForm(API_BASE_URL + 'login', {
    //   npm: "2106704894",
    //   password: "123654",
    //   photo_face: imageBlob,
    // })
  
    console.log(result.data)
    if (result.status === 200) {
      // setShowDialog(true)
      setIsFaceVerified(true);
      handleSendToken(result.data.token)
    } 
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials and try again.");
      setTimeout(() => {window.location.reload()}, 3000)
    }
  };


  return (
    <div className="min-h-screen bg-[#001A1E] bg-gradient-to-br from-[#001A1E] via-[#003644] to-[#002A35] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md backdrop-blur-sm bg-[#001214]/50 rounded-2xl border border-white/5 overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-4xl font-light mb-2 text-white text-center">
            Voter Verification
          </h2>
          <p className="text-[#00E5CC] text-xl mb-8 text-center">
            Complete Your Authentication
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-300">NPM (10 Digits)</Label>
              <div className="flex space-x-1">
                {npm.map((digit, index) => (
                  <Input 
                    key={index} 
                    value={digit} 
                    readOnly 
                    className="w-8 text-center text-white bg-[#001A1E] border-[#00E5CC]/30 focus:border-[#00E5CC]" 
                  />
                ))}
              </div>
            </div>

            {npm.every((digit) => digit !== "") && (
              <div className="space-y-2">
                <Label className="text-gray-300">6-Digit PIN</Label>
                <div className="flex space-x-1">
                  {pin.map((digit, index) => (
                    <Input 
                      key={index} 
                      value={digit} 
                      readOnly 
                      className="w-10 text-center text-white bg-[#001A1E] border-[#00E5CC]/30 focus:border-[#00E5CC]" 
                    />
                  ))}
                </div>
              </div>
            )}

            {pin.every((digit) => digit !== "") && !capturedImage && (
              <div className="space-y-4">
                <div className="relative aspect-video bg-[#003644] rounded-lg overflow-hidden">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "user" }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button 
                  onClick={captureImage} 
                  className="w-full bg-[#00E5CC] text-[#001A1E] hover:bg-[#00c4af] transition-colors"
                >
                  <Camera className="mr-2 h-4 w-4" /> Capture Image
                </Button>
              </div>
            )}

            {capturedImage && !isFaceVerified && (
              <div className="space-y-4">
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full h-full object-cover rounded-lg" 
                />
                <Button 
                  onClick={verifyFace} 
                  className="w-full bg-[#00E5CC] text-[#001A1E] hover:bg-[#00c4af] transition-colors"
                >
                  Verify Face
                </Button>
              </div>
            )}

            {isFaceVerified && (
              <div className="text-center space-y-4">
                <CheckCircle2 className="mx-auto h-16 w-16 text-[#00E5CC]" />
                <p className="text-xl font-light text-white">Verification Complete</p>
                <p className="text-gray-300">Prepare your QR code!</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#001214]/50 p-4 text-center">
          <p className="text-sm text-gray-400">
            Ensure you're in a well-lit area for face verification
          </p>
        </div>
      </motion.div>
    </div>
  );
}