'use client'

require('dotenv').config()

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from '@/components/ui/progress'
import { Switch } from './ui/switch'
import Image from 'next/image'
import axios from 'axios'
import mqtt from 'mqtt'

const MQTT_TOPIC_KEY = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + '/key'
const MQTT_TOPIC_VOTE = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + '/vote'
const ESP_SERVER_URL = 'https://' + process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + '/api/'

export default function VotePage() {
  const [privateKey, setPrivateKey] = useState('')
  const [vote, setVote] = useState('')
  const [modeVote, setModeVote] = useState(false) 
  const [progress, setProgress] = useState(100)
  const candidates = [
    { id: 1, name: 'Candidate 1', image: '/candidates/candidate1.png' },
    { id: 2, name: 'Candidate 2', image: '/candidates/candidate2.png' },
    { id: 3, name: 'Candidate 3', image: '/candidates/candidate3.png' },
  ]

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_MQTT_BROKER
    const client = mqtt.connect(url, {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    }) 

    client.on('connect', () => {
      client.subscribe(MQTT_TOPIC_KEY) 
      client.subscribe(MQTT_TOPIC_VOTE) 
    })

    client.on('message', (topic, message) => {
      if (topic === MQTT_TOPIC_KEY) {
        setPrivateKey(new TextDecoder('utf-8').decode(message)) 
      } else if (topic === MQTT_TOPIC_VOTE) {
        setVote(new TextDecoder('utf-8').decode(message))
      }
    })

    return () => {
      client.end()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 100 / 600 // Decrease progress every 0.1 seconds
      })
    }, 100)

    return () => clearInterval(interval)
  })

  const handleModeChange = async () => {
    axios.post(ESP_SERVER_URL + 'mode', 
      {
        "modeVote": !modeVote,
      }, 
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((resp) => {
        if (resp.status === 200) {
          setModeVote(!modeVote)
        }
        setModeVote(!modeVote)
      }
    ).catch((err) => {
        setModeVote(!modeVote) //temporary until CORS is fixed
        console.log(err)
      }
    )
  }

  const handleClearInput = async () => {
    axios.get(ESP_SERVER_URL + 'clear')
      .then((resp) => {
        if (resp.status === 200) {
          if (modeVote === false) {
            setPrivateKey('') 
          } else {
            setVote('')
          }
        }
        if (modeVote === false) {
          setPrivateKey('') 
        } else {
          setVote('')
        }
      })
      .catch((err) => {
        if (modeVote === false) {
          setPrivateKey('') 
        } else {
          setVote('')
        }
        console.log(err)
      })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-black">Cast Your Vote</h1>
      </header>

      <main className="space-y-8">
        <section
          className="grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 250px))",
            justifyContent: "center",
          }}
        >
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="bg-white border-gray-200 shadow-md">
              <CardHeader className="flex flex-col items-center justify-center">
                <CardTitle className="text-3xl font-semibold text-black">{candidate.id}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Image
                  src={candidate.image}
                  width={200}
                  height={200}
                  alt="candidate image"
                  className="mb-4 rounded border-2 border-gray-300"
                />
                <p className="text-gray-600 text-xl text-center">{candidate.name}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-4">
          <Progress value={progress} className="h-4 bg-gray-200" />
          <div className="text-center">
            {progress > 0
              ? `${((progress / 100) * 60).toFixed(1)} seconds remaining`
              : "Time is up!"}
          </div>
        </section>

        <section className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`text-lg font-semibold transition ${
                !modeVote ? "text-black" : "text-gray-400 blur-[1px]"
              }`}
            >
              Private Key
            </div>
            <Switch
              onCheckedChange={handleModeChange}
              className="bg-yellow-500"
            />
            <div
              className={`text-lg font-semibold transition ${
                modeVote ? "text-black" : "text-gray-400 blur-[1px]"
              }`}
            >
              Vote
            </div>
          </div>
        </section>

        <section className="text-center space-y-4">
          <div className="text-lg">
            <strong>Private Key: </strong>
            <span className="text-yellow-600">{privateKey}</span>
          </div>
          <div className="text-lg">
            <strong>Vote: </strong>
            <span className="text-yellow-600">{vote}</span>
          </div>
        </section>

        <section className="flex justify-center space-x-4">
          <Button
            className="bg-red-500 text-white hover:bg-red-600 transition-colors"
            onClick={handleClearInput}
          >
            Clear Input
          </Button>
        </section>
      </main>
    </div>
  )
}