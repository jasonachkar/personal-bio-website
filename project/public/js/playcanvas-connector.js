/**
 * PlayCanvas Connector - Bridge between PlayCanvas games and your React website
 * 
 * This script should be included in your PlayCanvas project to enable communication
 * with your website through the postMessage API.
 */

// Initialize the PlayCanvas connector
var PlayCanvasConnector = {
    initialized: false,
    targetOrigin: '*', // In production, specify your website's origin for security
    score: 0,
    playerHealth: 100,
    
    // Initialize the connector
    init: function() {
        if (this.initialized) return;
        
        // Listen for messages from the parent (your website)
        window.addEventListener('message', this.handleIncomingMessage.bind(this));
        
        // Notify parent that connector is ready
        this.sendMessage('CONNECTOR_READY', { version: '1.0' });
        
        // Mark as initialized
        this.initialized = true;
        console.log('PlayCanvas Connector initialized');
        
        // Mark loading as complete after a short delay (simulating game loading)
        setTimeout(function() {
            PlayCanvasConnector.sendGameEvent('LOADING_COMPLETE');
        }, 3000);
    },
    
    // Handle messages received from the website
    handleIncomingMessage: function(event) {
        // In production, validate event.origin
        
        const data = event.data;
        if (!data || !data.type) return;
        
        if (data.type === 'GAME_CONTROL') {
            switch (data.action) {
                case 'START_GAME':
                    this.startGame();
                    break;
                case 'PAUSE_GAME':
                    this.pauseGame();
                    break;
                case 'RESUME_GAME':
                    this.resumeGame();
                    break;
                case 'RESET_GAME':
                    this.resetGame();
                    break;
                default:
                    console.warn('Unknown game control action:', data.action);
            }
        }
    },
    
    // Send a message to the parent website
    sendMessage: function(type, data) {
        if (window.parent) {
            const message = {
                source: 'PLAYCANVAS_GAME',
                type: type,
                ...data
            };
            
            window.parent.postMessage(message, this.targetOrigin);
        }
    },
    
    // Send a game event
    sendGameEvent: function(action, data) {
        this.sendMessage('GAME_EVENT', { 
            action: action,
            ...data
        });
    },
    
    // Game flow control methods
    startGame: function() {
        console.log('Game started via connector');
        this.sendGameMessage('Game started! Use WASD to move and mouse to look around.');
        
        // Demo: Start updating score and health periodically to demonstrate communication
        this.startDemoUpdates();
    },
    
    pauseGame: function() {
        console.log('Game paused via connector');
        this.sendGameMessage('Game paused');
    },
    
    resumeGame: function() {
        console.log('Game resumed via connector');
        this.sendGameMessage('Game resumed');
    },
    
    resetGame: function() {
        console.log('Game reset via connector');
        this.score = 0;
        this.playerHealth = 100;
        this.sendGameEvent('SCORE_UPDATE', { value: this.score });
        this.sendGameEvent('HEALTH_UPDATE', { value: this.playerHealth });
        this.sendGameMessage('Game has been reset');
    },
    
    // Game state update methods
    updateScore: function(points) {
        this.score += points;
        this.sendGameEvent('SCORE_UPDATE', { value: this.score });
        
        if (points > 0) {
            this.sendGameMessage('You gained ' + points + ' points!');
        }
    },
    
    updateHealth: function(change) {
        this.playerHealth = Math.max(0, Math.min(100, this.playerHealth + change));
        this.sendGameEvent('HEALTH_UPDATE', { value: this.playerHealth });
        
        if (change < 0) {
            this.sendGameMessage('You took damage! Health: ' + this.playerHealth);
        } else if (change > 0) {
            this.sendGameMessage('Health restored! Health: ' + this.playerHealth);
        }
        
        if (this.playerHealth <= 0) {
            this.sendGameMessage('Game Over! You were defeated.');
        }
    },
    
    sendGameMessage: function(message) {
        this.sendGameEvent('GAME_MESSAGE', { message: message });
    },
    
    // Demo updates to showcase communication
    startDemoUpdates: function() {
        // Simulate score increases every few seconds
        setInterval(function() {
            if (Math.random() < 0.7) {
                PlayCanvasConnector.updateScore(10);
            }
        }, 5000);
        
        // Simulate occasional damage
        setInterval(function() {
            if (PlayCanvasConnector.playerHealth > 0) {
                if (Math.random() < 0.3) {
                    PlayCanvasConnector.updateHealth(-5);
                } else if (Math.random() < 0.1) {
                    PlayCanvasConnector.updateHealth(10);
                    PlayCanvasConnector.sendGameMessage('Found a health pack!');
                }
            }
        }, 8000);
    }
};

// Initialize when the script is loaded
document.addEventListener('DOMContentLoaded', function() {
    PlayCanvasConnector.init();
});

// Also make it globally accessible for the PlayCanvas scripts
window.PlayCanvasConnector = PlayCanvasConnector; 