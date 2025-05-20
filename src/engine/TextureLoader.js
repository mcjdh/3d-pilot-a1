/**
 * Utility for loading and managing textures
 */
export class TextureLoader {
    constructor() {
        this.textures = {};
        this.loader = new THREE.TextureLoader();
    }

    /**
     * Load a texture from URL
     * @param {string} name - Identifier for the texture
     * @param {string} url - URL of the texture
     * @param {function} onLoad - Callback when texture is loaded
     */
    load(name, url, onLoad = null) {
        const texture = this.loader.load(url, 
            // onLoad callback
            (loadedTexture) => {
                // Configure the texture
                loadedTexture.wrapS = THREE.RepeatWrapping;
                loadedTexture.wrapT = THREE.RepeatWrapping;
                loadedTexture.repeat.set(1, 1);
                
                if (onLoad) onLoad(loadedTexture);
            }
        );
        
        this.textures[name] = texture;
        return texture;
    }

    /**
     * Get a previously loaded texture
     * @param {string} name - Identifier for the texture
     * @returns {THREE.Texture} The requested texture
     */
    get(name) {
        return this.textures[name];
    }

    /**
     * Check if a texture has been loaded
     * @param {string} name - Identifier for the texture
     * @returns {boolean} Whether the texture exists
     */
    has(name) {
        return !!this.textures[name];
    }
}