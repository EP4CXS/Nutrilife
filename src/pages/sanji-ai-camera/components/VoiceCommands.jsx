import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VoiceCommands = ({ 
  onCommand, 
  isEnabled = true, 
  supportedCommands = [] 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [lastCommand, setLastCommand] = useState(null);
  const recognitionRef = useRef(null);

  // Default supported commands
  const defaultCommands = [
    { phrase: 'capture', action: 'capture', description: 'Take a photo' },
    { phrase: 'take photo', action: 'capture', description: 'Take a photo' },
    { phrase: 'snap', action: 'capture', description: 'Take a photo' },
    { phrase: 'flash on', action: 'flash_on', description: 'Turn flash on' },
    { phrase: 'flash off', action: 'flash_off', description: 'Turn flash off' },
    { phrase: 'gallery', action: 'gallery', description: 'Open photo gallery' },
    { phrase: 'switch camera', action: 'switch_camera', description: 'Switch camera mode' },
    { phrase: 'focus', action: 'focus', description: 'Auto focus camera' },
    { phrase: 'zoom in', action: 'zoom_in', description: 'Zoom in' },
    { phrase: 'zoom out', action: 'zoom_out', description: 'Zoom out' },
    { phrase: 'help', action: 'help', description: 'Show voice commands' },
    { phrase: 'stop listening', action: 'stop', description: 'Stop voice recognition' }
  ];

  const allCommands = supportedCommands?.length > 0 ? supportedCommands : defaultCommands;

  useEffect(() => {
    // Check if Speech Recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef?.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event?.resultIndex; i < event?.results?.length; i++) {
          const transcript = event?.results?.[i]?.[0]?.transcript;
          const confidence = event?.results?.[i]?.[0]?.confidence;

          if (event?.results?.[i]?.isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);

        if (finalTranscript) {
          processCommand(finalTranscript?.toLowerCase()?.trim(), confidence);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event?.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setTranscript('');
      };
    }

    return () => {
      if (recognitionRef?.current) {
        recognitionRef?.current?.stop();
      }
    };
  }, []);

  const processCommand = (transcript, confidence) => {
    const matchedCommand = allCommands?.find(cmd => 
      transcript?.includes(cmd?.phrase?.toLowerCase())
    );

    if (matchedCommand && confidence > 0.7) {
      setLastCommand({
        ...matchedCommand,
        timestamp: new Date(),
        confidence: confidence
      });
      
      onCommand?.(matchedCommand?.action, {
        phrase: matchedCommand?.phrase,
        transcript: transcript,
        confidence: confidence
      });

      // Auto-stop listening for certain commands
      if (matchedCommand?.action === 'stop' || matchedCommand?.action === 'capture') {
        stopListening();
      }
    }
  };

  const startListening = () => {
    if (recognitionRef?.current && isSupported && isEnabled) {
      recognitionRef?.current?.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef?.current) {
      recognitionRef?.current?.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-error';
  };

  if (!isSupported) {
    return (
      <div className="bg-card border border-border rounded-organic p-4">
        <div className="flex items-center space-x-3">
          <Icon name="MicOff" size={20} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium text-foreground">Voice Commands Not Supported</p>
            <p className="text-xs text-muted-foreground">Your browser doesn't support speech recognition</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Voice Control Panel */}
      <div className="bg-card border border-border rounded-organic p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon 
              name={isListening ? "Mic" : "MicOff"} 
              size={20} 
              className={isListening ? "text-primary animate-pulse-gentle" : "text-muted-foreground"} 
            />
            <div>
              <p className="text-sm font-medium text-foreground">Voice Commands</p>
              <p className="text-xs text-muted-foreground">
                {isListening ? 'Listening...' : 'Ready to listen'}
              </p>
            </div>
          </div>

          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={toggleListening}
            disabled={!isEnabled}
            iconName={isListening ? "Square" : "Mic"}
            iconPosition="left"
          >
            {isListening ? 'Stop' : 'Start'}
          </Button>
        </div>

        {/* Live Transcript */}
        {isListening && (
          <div className="mb-4">
            <div className="bg-muted rounded-organic p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Live Transcript:</span>
                {confidence > 0 && (
                  <span className={`text-xs ${getConfidenceColor(confidence)}`}>
                    {Math.round(confidence * 100)}% confident
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground">
                {transcript || 'Say a command...'}
              </p>
            </div>
          </div>
        )}

        {/* Last Command */}
        {lastCommand && (
          <div className="mb-4">
            <div className="bg-success/10 border border-success/20 rounded-organic p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm font-medium text-success">Command Recognized</span>
              </div>
              <p className="text-sm text-foreground">"{lastCommand?.phrase}"</p>
              <p className="text-xs text-muted-foreground">
                {Math.round(lastCommand?.confidence * 100)}% confidence • {new Date(lastCommand.timestamp)?.toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}

        {/* Quick Commands */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => processCommand('capture', 1.0)}
            disabled={!isEnabled}
            iconName="Camera"
            iconPosition="left"
          >
            Capture
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => processCommand('gallery', 1.0)}
            disabled={!isEnabled}
            iconName="Image"
            iconPosition="left"
          >
            Gallery
          </Button>
        </div>
      </div>
      {/* Available Commands */}
      <div className="bg-card border border-border rounded-organic p-4">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center space-x-2">
          <Icon name="List" size={16} />
          <span>Available Voice Commands</span>
        </h4>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {allCommands?.map((command, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div>
                <p className="text-sm font-medium text-foreground">"{command?.phrase}"</p>
                <p className="text-xs text-muted-foreground">{command?.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => processCommand(command?.phrase, 1.0)}
                disabled={!isEnabled}
                className="h-8 w-8"
              >
                <Icon name="Play" size={14} />
              </Button>
            </div>
          ))}
        </div>
      </div>
      {/* Tips */}
      <div className="bg-muted/50 rounded-organic p-4">
        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center space-x-2">
          <Icon name="Lightbulb" size={16} />
          <span>Voice Command Tips</span>
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Speak clearly and at normal volume</li>
          <li>• Wait for the listening indicator before speaking</li>
          <li>• Use exact command phrases for best recognition</li>
          <li>• Commands work best in quiet environments</li>
          <li>• Say "help" to see all available commands</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceCommands;