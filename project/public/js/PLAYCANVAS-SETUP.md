# Creating Your Own PlayCanvas Game

This guide explains how to set up your own custom PlayCanvas game to replace the example game used in the `PlayCanvasGame` component.

## Getting Started with PlayCanvas

1. **Create a Free PlayCanvas Account**
   - Go to [PlayCanvas.com](https://playcanvas.com) and sign up for a free account
   - No credit card required for basic usage

2. **Create a New Project**
   - Click "New Project" in your dashboard
   - Select "Empty Project" or choose from templates (FPS template recommended for a dungeon crawler)
   - Name your project "Cyber Dungeon Explorer" or similar

3. **Learn the Editor Basics**
   - PlayCanvas has a visual editor similar to Unity
   - Browse the [PlayCanvas tutorials](https://developer.playcanvas.com/en/tutorials/) to get familiar

## Integrating with Your Website

1. **Enable Communication**
   - Copy the `playcanvas-connector.js` file from `public/js/` into your PlayCanvas project
   - In PlayCanvas, go to Settings > External Scripts and add the URL to this file
     - If you've uploaded it to your site: `https://yoursite.com/js/playcanvas-connector.js`
     - Alternatively, paste the code into a new script in your PlayCanvas project

2. **Set Up Event Handlers in Your Game**
   - Create game events that call the PlayCanvasConnector functions:
   ```javascript
   // When player takes damage
   PlayCanvasConnector.updateHealth(-10);
   
   // When player defeats an enemy
   PlayCanvasConnector.updateScore(50);
   
   // Send a game message
   PlayCanvasConnector.sendGameMessage("You found a secret area!");
   ```

3. **Publish Your Game**
   - In PlayCanvas, click "Publish" in the top right
   - Choose "Download .zip" if you want to host it yourself, or "Publish to PlayCanvas" for cloud hosting
   - Copy the published URL (e.g., `https://playcanv.as/p/YOUR_GAME_ID/`)

4. **Update Your React Component**
   - In `src/components/PlayCanvasGame.tsx`, update the iframe src with your game's URL:
   ```jsx
   <iframe
     ref={iframeRef}
     src="https://playcanv.as/p/YOUR_GAME_ID/" 
     title="Cyber Dungeon Explorer"
     // ...rest of the props
   ></iframe>
   ```

## Making It Look Amazing

### Graphics Tips
1. **Use a Cyberpunk Color Palette**
   - Neon greens, blues, and purples
   - Dark backgrounds with high contrast
   - Use bloom/glow effects for that cyberpunk aesthetic

2. **Add Post-Processing Effects**
   - In PlayCanvas, use the post-processing library
   - Add bloom, chromatic aberration, and film grain effects
   - These can be added via script or the editor

3. **Use Quality 3D Models**
   - Find cyberpunk assets on sites like [Sketchfab](https://sketchfab.com) or [TurboSquid](https://turbosquid.com)
   - Many free and paid options are available
   - Ensure models are optimized for web (low poly where possible)

### Performance Tips
1. **Optimize for Web**
   - Keep texture sizes reasonable (1024x1024 max for most textures)
   - Use texture atlases where possible
   - Limit draw calls by combining meshes

2. **Progressive Loading**
   - Load essential assets first, then load additional content progressively
   - Show a loading screen during initial load

3. **Mobile Considerations**
   - Create lower quality settings for mobile devices
   - Detect device capabilities and adjust accordingly

## Example Projects for Inspiration

1. **[Cyberpunk City](https://playcanvas.com/project/446537/overview/cyberpunk-city)** - A detailed cyberpunk environment
2. **[FPS Starter Kit](https://playcanvas.com/project/435733/overview/fps-starter-kit)** - Good starting point for an FPS game
3. **[Neon Challenge](https://playcanvas.com/project/446331/overview/neon-challenge)** - Shows great neon visual effects

## Further Resources

- [PlayCanvas API Reference](https://developer.playcanvas.com/en/api/)
- [PlayCanvas Forum](https://forum.playcanvas.com/)
- [3D Model Resources](https://developer.playcanvas.com/en/user-manual/assets/models/loading/)
- [Tutorial: Creating a Complete Game](https://developer.playcanvas.com/en/tutorials/mini-games/gem-quest/) 