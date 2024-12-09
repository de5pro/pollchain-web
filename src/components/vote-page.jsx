'use client'

require('dotenv').config()

import { useEffect, useState } from 'react'
import axios from 'axios'
import mqtt from 'mqtt'
import { useRouter } from 'next/navigation'
import { candidates, polling } from '@/lib/data'

const MQTT_TOPIC_KEY = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + '/key'
const MQTT_TOPIC_VOTE = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + '/vote'
const MQTT_TOPIC_VOTE_STATUS = process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + '/voteStatus'
const ESP_SERVER_URL = 'https://' + process.env.NEXT_PUBLIC_ESP_IP_ADDRESS + '/api/'

export default function VotePage() {
  const [privateKey, setPrivateKey] = useState('')
  const [vote, setVote] = useState('')
  const [progress, setProgress] = useState(100)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const router = useRouter();

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
      } else if (topic === MQTT_TOPIC_VOTE_STATUS) {
        router.push('/live')
      }
    })

    return () => {
      client.end()
    }
  }, [])

  useEffect(() => {
    handleModeChange('vote')

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 100 / 300
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress <= 0) {
      router.push('/live')
    }
  }, [progress])

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


  const handleCandidateSelect = (candidateId) => {
    setSelectedCandidate(candidateId);
    setVote(candidateId.toString());
  }

  return (
    <div className="min-h-screen pt-12 pb-16 bg-[#001A1E] bg-gradient-to-br from-[#001A1E] via-[#003644] to-[#002A35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-light text-white">
            {polling.header}
            <br />
            <span className="font-semibold bg-gradient-to-r from-cyan-500 to-blue-200 bg-clip-text text-transparent text-5xl">
              { polling.title }
            </span>
          </h1>
          <p className="text-lg tracking-wide text-gray-400 pt-2">
            {polling.description}
          </p>
        </div>

        {/* Candidates Section */}
        <section>
          <div className="grid md:grid-cols-3 gap-8">
            {candidates.map((candidate, index) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                isSelected={selectedCandidate === candidate.id}
                onSelect={() => handleCandidateSelect(candidate.id)}
                number={index + 1}
              />
            ))}
          </div>
        </section>

        {/* Voting Interface */}
        <div className="mt-16 backdrop-blur-sm bg-[#001214]/50 rounded-2xl p-8 border border-white/5 hover:border-[#00E5CC]/30 transition-colors group">
          <h2 className="text-2xl font-light text-white mb-8 group-hover:text-[#00E5CC]">
            Voting Progress
          </h2>
          
          <div className="space-y-4">
            {/* Progress Section */}
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-4">
              <div 
                className="bg-[#00E5CC] h-4 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-center text-white mb-6">
              {progress > 0
                ? `${((progress / 100) * 60).toFixed(1)} seconds remaining`
                : "Time is up!"}
            </div>

            <div className="text-center space-y-4 text-white">
              <div className="text-lg">
                <strong className="text-[#00E5CC]">Private Key: </strong>
                <span>{privateKey}</span>
              </div>
              <div className="text-lg">
                <strong className="text-[#00E5CC]">Selected Candidate: </strong>
                <span>{vote || 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CandidateCard({ candidate, isSelected, onSelect, number }) {
  const { id, name, subtitle, image, description } = candidate;

  return (
    <div 
      onClick={onSelect}
      className={`backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 cursor-pointer relative
        ${isSelected 
          ? 'bg-[#00E5CC]/20 border-[#00E5CC] shadow-lg shadow-[#00E5CC]/10' 
          : 'bg-[#001214]/50 border-white/5 hover:border-[#00E5CC]/30'}`}
    >
      <div className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full border-2 border-[#00E5CC] flex items-center justify-center bg-[#001214]/80">
        <span className="text-[#00E5CC] text-2xl font-light">{number}</span>
      </div>
      <div className="relative mb-4 overflow-hidden rounded-xl w-full h-[16rem]">
        {/* Number on top of the image */}
        <div className="absolute top-4 left-4 text-5xl font-light text-[#00E5CC] opacity-50 z-10">
          {id}
        </div>
        {/* Image */}
        <img
          src={image}
          alt={`Portrait of ${name}`}
          className={`object-cover w-full h-full transition-transform duration-300 
            ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}
        />
      </div>

      <h3 className={`text-2xl font-light mb-2 transition-colors 
        ${isSelected ? 'text-[#00E5CC]' : 'text-white group-hover:text-[#00E5CC]'}`}>
        {name}
      </h3>
      <p className={`mb-4 transition-colors 
        ${isSelected ? 'text-white' : 'text-[#00E5CC]'}`}>
        {subtitle}
      </p>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}