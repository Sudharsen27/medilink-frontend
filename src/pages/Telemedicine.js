import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Telemedicine = ({ user }) => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callStatus, setCallStatus] = useState('connecting');
  const [localStream, setLocalStream] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const messagesEndRef = useRef();

  const fetchAppointmentDetails = useCallback(async () => {
    try {
      // Mock appointment data for testing
      const mockAppointment = {
        id: appointmentId,
        doctor_name: "Dr. Sarah Johnson",
        doctor_specialization: "Cardiology",
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: "14:30",
        reason: "Heart palpitations follow-up"
      };
      setAppointment(mockAppointment);
    } catch (error) {
      console.error('Error fetching appointment:', error);
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    fetchAppointmentDetails();
    initializeCall();
  }, [fetchAppointmentDetails]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setCallStatus('waiting');
      setPermissionError(false);

      // Simulate doctor joining after 3 seconds
      setTimeout(() => {
        setCallStatus('connected');
      }, 3000);

    } catch (error) {
      console.error('Error accessing media devices:', error);
      setCallStatus('failed');
      setPermissionError(true);
      
      // Continue without camera for testing
      setTimeout(() => {
        setCallStatus('connected');
      }, 3000);
    }
  };

  const requestPermissionsAgain = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setPermissionError(false);
      setCallStatus('waiting');
      
      setTimeout(() => {
        setCallStatus('connected');
      }, 3000);
      
    } catch (error) {
      console.error('Still cannot access media:', error);
      alert('Please allow camera and microphone permissions in your browser settings.');
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: user.name,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setCallStatus('ended');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Telemedicine Consultation</h1>
            <p className="text-gray-400">
              with Dr. {appointment?.doctor_name} - {appointment?.doctor_specialization}
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-block px-3 py-1 rounded-full ${
              callStatus === 'connected' ? 'bg-green-500' : 
              callStatus === 'waiting' ? 'bg-yellow-500' : 
              callStatus === 'ended' ? 'bg-red-500' : 'bg-gray-500'
            }`}>
              {callStatus.charAt(0).toUpperCase() + callStatus.slice(1)}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Appointment ID: {appointmentId}
            </p>
          </div>
        </div>

        {/* Permission Error Banner */}
        {permissionError && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-200">Camera/Microphone Access Required</h3>
                <p className="text-red-300 text-sm mt-1">
                  Please allow camera and microphone permissions to use video calling features.
                </p>
              </div>
              <button
                onClick={requestPermissionsAgain}
                className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Call Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Remote Video (Doctor) */}
            <div className="bg-black rounded-lg aspect-video relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full rounded-lg"
              />
              {callStatus === 'waiting' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Waiting for doctor to join...</p>
                  </div>
                </div>
              )}
              {callStatus === 'connected' && !permissionError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👨‍⚕️</div>
                    <p>Doctor is connected</p>
                    <p className="text-sm text-gray-400">Video call is active</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded">
                Dr. {appointment?.doctor_name}
              </div>
            </div>

            {/* Local Video (Patient) */}
            <div className="bg-black rounded-lg w-64 aspect-video relative">
              {localStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📹</div>
                    <p className="text-sm text-gray-400">Camera Off</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                You ({user.name})
              </div>
            </div>

            {/* Call Controls */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleAudio}
                disabled={!localStream}
                className={`p-4 rounded-full ${
                  isAudioMuted ? 'bg-red-500' : 'bg-gray-600'
                } hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isAudioMuted ? '🔇' : '🎤'}
              </button>
              
              <button
                onClick={toggleVideo}
                disabled={!localStream}
                className={`p-4 rounded-full ${
                  isVideoOff ? 'bg-red-500' : 'bg-gray-600'
                } hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isVideoOff ? '📷 Off' : '📷'}
              </button>
              
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
              >
                📞 End
              </button>

              {permissionError && (
                <button
                  onClick={requestPermissionsAgain}
                  className="p-4 rounded-full bg-green-600 hover:bg-green-700 transition-colors"
                >
                  🔄 Retry
                </button>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-gray-800 rounded-lg flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-700">
              <h3 className="font-semibold">Chat with Doctor</h3>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                  <div className="text-4xl mb-2">💬</div>
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation</p>
                </div>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`mb-3 ${
                      message.sender === user.name ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === user.name
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={callStatus === 'ended'}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                  disabled={callStatus === 'ended'}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Info */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Consultation Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Patient:</strong> {user.name}</p>
              <p><strong>Doctor:</strong> Dr. {appointment?.doctor_name}</p>
              <p><strong>Specialization:</strong> {appointment?.doctor_specialization}</p>
            </div>
            <div>
              <p><strong>Date:</strong> {new Date(appointment?.appointment_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appointment?.appointment_time}</p>
              <p><strong>Reason:</strong> {appointment?.reason}</p>
            </div>
          </div>
        </div>

        {/* Post-Call Actions */}
        {callStatus === 'ended' && (
          <div className="mt-6 bg-blue-900 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Consultation Ended</h3>
            <p className="mb-4">Thank you for using Medilink Telemedicine services.</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/prescriptions')}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded transition-colors"
              >
                View Prescription
              </button>
              <button
                onClick={() => navigate('/appointments')}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded transition-colors"
              >
                Back to Appointments
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Telemedicine;