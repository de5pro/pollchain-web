"use client";

require("dotenv").config();

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Camera } from "lucide-react";
import mqtt from "mqtt";
import Webcam from "react-webcam";
import { inertia } from "framer-motion";
import axios from 'axios'

const MQTT_TOPIC_NPM = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + "/npm";
const MQTT_TOPIC_PIN = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + "/pin";
const MQTT_TOPIC_CAPTURE = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + "/capture";
const MQTT_TOPIC_DEL = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + "/api/clear";
const MQTT_BROKER_URL = process.env.NEXT_PUBLIC_MQTT_BROKER;
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VerificationPage() {
  const [npm, setNpm] = useState(Array(10).fill(""));
  const [pin, setPin] = useState(Array(6).fill(""));
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFaceVerified, setIsFaceVerified] = useState(false);
  const [inCapture, setInCapture] = useState(false);
  const webcamRef = useRef(null);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER_URL, {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    });

    client.on("connect", () => {
      client.subscribe([MQTT_TOPIC_NPM, MQTT_TOPIC_PIN, MQTT_TOPIC_CAPTURE, MQTT_TOPIC_DEL]);
    });

    client.on("message", (topic, message) => {
      const char = new TextDecoder("utf-8").decode(message);
      if (topic === MQTT_TOPIC_NPM && npm.includes("")) {
        updateOtpInput(setNpm, char);
      } else if (topic === MQTT_TOPIC_PIN && pin.includes("")) {
        updateOtpInput(setPin, char);
      } else if (topic === MQTT_TOPIC_DEL) {
        console.log("DELETE")
        if (capturedImage) {
          // Reset the captured image for retry
          setCapturedImage(null);
          setIsFaceVerified(false);
        } else {          
          // Delete from NPM if not fully filled, else delete from PIN
          if (pin.includes("") && !inCapture) {
            console.log("npm")
            console.log(inCapture)
            deleteOtpInput(setNpm);
          } else {
            console.log("pin")
            deleteOtpInput(setPin);
          }
        }
      } else if (topic === MQTT_TOPIC_CAPTURE) {
        captureImage();
        if (char === "complete") {
          setIsFaceVerified(true);
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
    if (!capturedImage) {
      console.error("No face photo captured for login.");
      return;
    }
   

    try {
      // Convert capturedImage (Base64 string) to a Blob
    const imageBlob = await (await fetch(capturedImage)).blob(); 

    const result = await axios.postForm(API_BASE_URL + 'login', {
      npm: npm + "",
      password: pin + "",
      photo_face: imageBlob,
    })

    console.log(result.request)
    console.log(result.data)
    
    if (result.status === 200) {
      // setShowDialog(true)
      alert("Login successful!");
      setIsFaceVerified(true);
    } 
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please check your credentials and try again.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-50 dark:from-sky-900 dark:to-cyan-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Voter Verification</CardTitle>
          <CardDescription>Please complete the steps sequentially</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="npm">NPM (10 Digits)</Label>
            <div className="flex space-x-1">
              {npm.map((digit, index) => (
                <Input key={index} value={digit} readOnly className="w-8 text-center" />
              ))}
            </div>
          </div>

          {npm.every((digit) => digit !== "") && (
            <div className="space-y-2">
              <Label htmlFor="pin">6-Digit PIN</Label>
              <div className="flex space-x-1">
                {pin.map((digit, index) => (
                  <Input key={index} value={digit} readOnly className="w-10 text-center" />
                ))}
              </div>
            </div>
          )}

          {pin.every((digit) => digit !== "") && !capturedImage && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden" onLoad={() => setInCapture(true)}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button onClick={captureImage} className="w-full">
                <Camera className="mr-2 h-4 w-4" /> Capture Image
              </Button>
            </div>
          )}

          {capturedImage && !isFaceVerified && (
            <div className="space-y-4">
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover rounded-lg" />
              <Button onClick={verifyFace} className="w-full">
                Verify Face
              </Button>
            </div>
          )}

          {isFaceVerified && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <p className="text-xl font-semibold">Verification Complete</p>
              <p>You can now proceed to vote.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ensure you're in a well-lit area for the face verification step.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}