// Game Engine - Zombie Apocalypse
class ZombieGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = 'menu'; // menu, playing, gameOver
        this.score = 0;
        this.wave = 1;
        this.zombiesKilledTotal = 0;
        
        // Player
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            width: 20,
            height: 20,
            speed: 5,
            health: 100,
            maxHealth: 100,
            angle: 0
        };
        
        // Input handling
        this.keys = {};
        this.mouse = { x: 0, y: 0, down: false };
        
        // Game objects
        this.bullets = [];
        this.zombies = [];
        this.particles = [];
        this.powerUps = [];
        
        // Weapons system
        this.weapons = [
            {
                name: 'PISTOL',
                damage: 25,
                fireRate: 300,
                currentAmmo: 15,
                maxAmmo: 15,
                totalAmmo: 90,
                reloadTime: 1500,
                bulletSpeed: 12,
                spread: 0.1
            },
            {
                name: 'RIFLE',
                damage: 40,
                fireRate: 150,
                currentAmmo: 30,
                maxAmmo: 30,
                totalAmmo: 120,
                reloadTime: 2000,
                bulletSpeed: 15,
                spread: 0.05
            },
            {
                name: 'SHOTGUN',
                damage: 15,
                fireRate: 800,
                currentAmmo: 8,
                maxAmmo: 8,
                totalAmmo: 32,
                reloadTime: 2500,
                bulletSpeed: 10,
                spread: 0.3,
                pellets: 5
            }
        ];
        
        this.currentWeapon = 0;
        this.lastShot = 0;
        this.reloading = false;
        this.reloadStartTime = 0;
        
        // Wave system
        this.zombiesInWave = 10;
        this.zombiesSpawned = 0;
        this.waveStartTime = 0;
        this.wavePrepTime = 3000; // 3 seconds between waves
        
        // Performance
        this.lastTime = 0;
        this.fps = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupUI();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Weapon switching
            if (e.key >= '1' && e.key <= '3') {
                const weaponIndex = parseInt(e.key) - 1;
                if (weaponIndex < this.weapons.length) {
                    this.switchWeapon(weaponIndex);
                }
            }
            
            // Reload
            if (e.key.toLowerCase() === 'r') {
                this.reload();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click
                this.mouse.down = true;
            }
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                this.mouse.down = false;
            }
        });
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    setupUI() {
        // Menu buttons
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('instructionsBtn').addEventListener('click', () => {
            this.showInstructions();
        });
        
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.resetGame();
            this.startGame();
        });
        
        document.getElementById('mainMenuBtn').addEventListener('click', () => {
            this.resetGame();
            this.showMainMenu();
        });
        
        // Weapon selection
        document.querySelectorAll('.weapon-slot').forEach((slot, index) => {
            slot.addEventListener('click', () => {
                this.switchWeapon(index);
            });
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('mainMenu').classList.remove('active');
        document.getElementById('instructionsMenu').classList.remove('active');
        document.getElementById('gameScreen').classList.add('active');
        document.body.classList.add('game-active');
        document.body.classList.remove('menu-active');
        
        this.spawnInitialZombies();
        this.updateUI();
    }
    
    showInstructions() {
        document.getElementById('mainMenu').classList.remove('active');
        document.getElementById('instructionsMenu').classList.add('active');
    }
    
    showMainMenu() {
        document.getElementById('instructionsMenu').classList.remove('active');
        document.getElementById('gameOverScreen').classList.remove('active');
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('mainMenu').classList.add('active');
        document.body.classList.remove('game-active');
        document.body.classList.add('menu-active');
        this.gameState = 'menu';
    }
    
    showGameOver() {
        this.gameState = 'gameOver';
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('gameOverScreen').classList.add('active');
        document.body.classList.remove('game-active');
        document.body.classList.add('menu-active');
        
        // Update final stats
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalWave').textContent = this.wave;
        document.getElementById('zombiesKilled').textContent = this.zombiesKilledTotal;
    }
    
    resetGame() {
        this.score = 0;
        this.wave = 1;
        this.zombiesKilledTotal = 0;
        this.player.health = this.player.maxHealth;
        this.player.x = this.canvas.width / 2;
        this.player.y = this.canvas.height / 2;
        
        // Reset weapons
        this.weapons.forEach(weapon => {
            weapon.currentAmmo = weapon.maxAmmo;
        });
        this.currentWeapon = 0;
        this.reloading = false;
        
        // Clear game objects
        this.bullets = [];
        this.zombies = [];
        this.particles = [];
        this.powerUps = [];
        
        this.zombiesInWave = 10;
        this.zombiesSpawned = 0;
    }
    
    switchWeapon(index) {
        if (index !== this.currentWeapon && !this.reloading) {
            this.currentWeapon = index;
            this.updateWeaponUI();
            this.updateUI();
        }
    }
    
    reload() {
        const weapon = this.weapons[this.currentWeapon];
        if (weapon.currentAmmo < weapon.maxAmmo && weapon.totalAmmo > 0 && !this.reloading) {
            this.reloading = true;
            this.reloadStartTime = Date.now();
        }
    }
    
    updateWeaponUI() {
        document.querySelectorAll('.weapon-slot').forEach((slot, index) => {
            if (index === this.currentWeapon) {
                slot.classList.add('active');
            } else {
                slot.classList.remove('active');
            }
        });
    }
    
    updateUI() {
        const weapon = this.weapons[this.currentWeapon];
        
        // Health
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('healthBar').style.width = healthPercent + '%';
        
        // Ammo
        document.getElementById('currentAmmo').textContent = weapon.currentAmmo;
        document.getElementById('totalAmmo').textContent = weapon.totalAmmo;
        
        // Score and wave
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('waveValue').textContent = this.wave;
        document.getElementById('zombiesLeft').textContent = Math.max(0, this.zombiesInWave - this.zombiesSpawned + this.zombies.length);
    }
    
    spawnInitialZombies() {
        this.zombiesSpawned = 0;
        this.spawnZombie();
    }
    
    spawnZombie() {
        if (this.zombiesSpawned >= this.zombiesInWave) return;
        
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch (side) {
            case 0: // Top
                x = Math.random() * this.canvas.width;
                y = -50;
                break;
            case 1: // Right
                x = this.canvas.width + 50;
                y = Math.random() * this.canvas.height;
                break;
            case 2: // Bottom
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + 50;
                break;
            case 3: // Left
                x = -50;
                y = Math.random() * this.canvas.height;
                break;
        }
        
        const zombie = {
            x: x,
            y: y,
            width: 25,
            height: 25,
            speed: 1 + Math.random() * 0.5 + (this.wave - 1) * 0.1,
            health: 50 + (this.wave - 1) * 10,
            maxHealth: 50 + (this.wave - 1) * 10,
            damage: 20 + (this.wave - 1) * 5,
            lastAttack: 0,
            attackCooldown: 1000,
            angle: 0,
            type: Math.random() < 0.8 ? 'normal' : 'fast'
        };
        
        if (zombie.type === 'fast') {
            zombie.speed *= 1.5;
            zombie.health *= 0.7;
            zombie.damage *= 0.8;
            zombie.width = 20;
            zombie.height = 20;
        }
        
        this.zombies.push(zombie);
        this.zombiesSpawned++;
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        this.updatePlayer(deltaTime);
        this.updateBullets(deltaTime);
        this.updateZombies(deltaTime);
        this.updateParticles(deltaTime);
        this.updateWeapons(deltaTime);
        this.updateWave(deltaTime);
        this.updateUI();
        
        // Spawn zombies gradually
        if (this.zombiesSpawned < this.zombiesInWave && Math.random() < 0.02) {
            this.spawnZombie();
        }
        
        // Check game over
        if (this.player.health <= 0) {
            this.showGameOver();
        }
    }
    
    updatePlayer(deltaTime) {
        // Movement
        let dx = 0, dy = 0;
        if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
        if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
        if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
        if (this.keys['d'] || this.keys['arrowright']) dx += 1;
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            dx *= 0.707;
            dy *= 0.707;
        }
        
        // Apply movement
        this.player.x += dx * this.player.speed;
        this.player.y += dy * this.player.speed;
        
        // Keep player in bounds
        this.player.x = Math.max(this.player.width / 2, Math.min(this.canvas.width - this.player.width / 2, this.player.x));
        this.player.y = Math.max(this.player.height / 2, Math.min(this.canvas.height - this.player.height / 2, this.player.y));
        
        // Calculate angle to mouse
        this.player.angle = Math.atan2(this.mouse.y - this.player.y, this.mouse.x - this.player.x);
        
        // Shooting
        if (this.mouse.down) {
            this.shoot();
        }
    }
    
    updateBullets(deltaTime) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            bullet.x += bullet.vx;
            bullet.y += bullet.vy;
            
            // Remove bullets that are off screen
            if (bullet.x < 0 || bullet.x > this.canvas.width || 
                bullet.y < 0 || bullet.y > this.canvas.height) {
                this.bullets.splice(i, 1);
                continue;
            }
            
            // Check collision with zombies
            for (let j = this.zombies.length - 1; j >= 0; j--) {
                const zombie = this.zombies[j];
                if (this.checkCollision(bullet, zombie)) {
                    // Damage zombie
                    zombie.health -= bullet.damage;
                    
                    // Create blood particles
                    this.createBloodParticles(zombie.x, zombie.y);
                    
                    // Remove bullet
                    this.bullets.splice(i, 1);
                    
                    // Check if zombie is dead
                    if (zombie.health <= 0) {
                        this.score += 100 + (this.wave - 1) * 10;
                        this.zombiesKilledTotal++;
                        this.zombies.splice(j, 1);
                        
                        // Create explosion particles
                        this.createExplosionParticles(zombie.x, zombie.y);
                        
                        // Chance to drop power-up
                        if (Math.random() < 0.1) {
                            this.createPowerUp(zombie.x, zombie.y);
                        }
                    }
                    break;
                }
            }
        }
    }
    
    updateZombies(deltaTime) {
        for (let i = this.zombies.length - 1; i >= 0; i--) {
            const zombie = this.zombies[i];
            
            // Move towards player
            const dx = this.player.x - zombie.x;
            const dy = this.player.y - zombie.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                zombie.x += (dx / distance) * zombie.speed;
                zombie.y += (dy / distance) * zombie.speed;
                zombie.angle = Math.atan2(dy, dx);
            }
            
            // Check collision with player
            if (this.checkCollision(zombie, this.player)) {
                const now = Date.now();
                if (now - zombie.lastAttack > zombie.attackCooldown) {
                    this.player.health -= zombie.damage;
                    zombie.lastAttack = now;
                    
                    // Damage flash effect
                    this.createDamageFlash();
                    
                    // Knockback
                    const knockbackDistance = 30;
                    const angle = Math.atan2(this.player.y - zombie.y, this.player.x - zombie.x);
                    this.player.x += Math.cos(angle) * knockbackDistance;
                    this.player.y += Math.sin(angle) * knockbackDistance;
                }
            }
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            particle.life -= deltaTime;
            particle.alpha = particle.life / particle.maxLife;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateWeapons(deltaTime) {
        // Handle reloading
        if (this.reloading) {
            const weapon = this.weapons[this.currentWeapon];
            if (Date.now() - this.reloadStartTime > weapon.reloadTime) {
                const ammoNeeded = weapon.maxAmmo - weapon.currentAmmo;
                const ammoToReload = Math.min(ammoNeeded, weapon.totalAmmo);
                weapon.currentAmmo += ammoToReload;
                weapon.totalAmmo -= ammoToReload;
                this.reloading = false;
            }
        }
    }
    
    updateWave(deltaTime) {
        // Check if wave is complete
        if (this.zombies.length === 0 && this.zombiesSpawned >= this.zombiesInWave) {
            this.wave++;
            this.zombiesInWave = Math.floor(10 + (this.wave - 1) * 3);
            this.zombiesSpawned = 0;
            
            // Restore some ammo
            this.weapons.forEach(weapon => {
                weapon.totalAmmo = Math.min(weapon.totalAmmo + Math.floor(weapon.maxAmmo * 0.5), weapon.maxAmmo * 5);
            });
            
            // Heal player slightly
            this.player.health = Math.min(this.player.maxHealth, this.player.health + 20);
        }
    }
    
    shoot() {
        const now = Date.now();
        const weapon = this.weapons[this.currentWeapon];
        
        if (now - this.lastShot < weapon.fireRate || weapon.currentAmmo <= 0 || this.reloading) {
            return;
        }
        
        this.lastShot = now;
        weapon.currentAmmo--;
        
        // Create muzzle flash
        this.createMuzzleFlash();
        
        // Shotgun fires multiple pellets
        const pellets = weapon.pellets || 1;
        
        for (let i = 0; i < pellets; i++) {
            const spread = (Math.random() - 0.5) * weapon.spread;
            const angle = this.player.angle + spread;
            
            const bullet = {
                x: this.player.x,
                y: this.player.y,
                vx: Math.cos(angle) * weapon.bulletSpeed,
                vy: Math.sin(angle) * weapon.bulletSpeed,
                damage: weapon.damage,
                width: 4,
                height: 4
            };
            
            this.bullets.push(bullet);
        }
        
        // Auto-reload if empty
        if (weapon.currentAmmo === 0 && weapon.totalAmmo > 0) {
            this.reload();
        }
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    createBloodParticles(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                friction: 0.9,
                life: 1000,
                maxLife: 1000,
                alpha: 1,
                color: '#ff0000',
                size: Math.random() * 3 + 2
            });
        }
    }
    
    createExplosionParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                friction: 0.95,
                life: 800,
                maxLife: 800,
                alpha: 1,
                color: '#ffaa00',
                size: Math.random() * 4 + 3
            });
        }
    }
    
    createMuzzleFlash() {
        const angle = this.player.angle;
        const distance = 25;
        const x = this.player.x + Math.cos(angle) * distance;
        const y = this.player.y + Math.sin(angle) * distance;
        
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                friction: 0.8,
                life: 100,
                maxLife: 100,
                alpha: 1,
                color: '#ffff00',
                size: Math.random() * 5 + 3
            });
        }
    }
    
    createDamageFlash() {
        // This would typically flash the screen red
        // For now, we'll create some red particles around the player
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: this.player.x + (Math.random() - 0.5) * 40,
                y: this.player.y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                friction: 0.9,
                life: 500,
                maxLife: 500,
                alpha: 1,
                color: '#ff0000',
                size: Math.random() * 3 + 2
            });
        }
    }
    
    createPowerUp(x, y) {
        const types = ['health', 'ammo'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        this.powerUps.push({
            x: x,
            y: y,
            width: 20,
            height: 20,
            type: type,
            collected: false,
            bobOffset: Math.random() * Math.PI * 2
        });
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState !== 'playing') return;
        
        // Draw grid
        this.drawGrid();
        
        // Draw game objects
        this.drawBullets();
        this.drawZombies();
        this.drawPlayer();
        this.drawParticles();
        this.drawPowerUps();
        
        // Draw reload indicator
        if (this.reloading) {
            this.drawReloadIndicator();
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawPlayer() {
        this.ctx.save();
        this.ctx.translate(this.player.x, this.player.y);
        this.ctx.rotate(this.player.angle);
        
        // Draw player body
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(-this.player.width / 2, -this.player.height / 2, this.player.width, this.player.height);
        
        // Draw weapon
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(this.player.width / 2, -3, 20, 6);
        
        // Draw direction indicator
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.player.width / 2 - 5, -2, 8, 4);
        
        this.ctx.restore();
    }
    
    drawZombies() {
        this.zombies.forEach(zombie => {
            this.ctx.save();
            this.ctx.translate(zombie.x, zombie.y);
            this.ctx.rotate(zombie.angle);
            
            // Draw zombie body
            if (zombie.type === 'fast') {
                this.ctx.fillStyle = '#ff6600';
            } else {
                this.ctx.fillStyle = '#ff0000';
            }
            this.ctx.fillRect(-zombie.width / 2, -zombie.height / 2, zombie.width, zombie.height);
            
            // Draw health bar
            this.ctx.restore();
            const healthPercent = zombie.health / zombie.maxHealth;
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(zombie.x - zombie.width / 2, zombie.y - zombie.height / 2 - 8, zombie.width, 4);
            this.ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
            this.ctx.fillRect(zombie.x - zombie.width / 2, zombie.y - zombie.height / 2 - 8, zombie.width * healthPercent, 4);
        });
    }
    
    drawBullets() {
        this.ctx.fillStyle = '#ffff00';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x - bullet.width / 2, bullet.y - bullet.height / 2, bullet.width, bullet.height);
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            const bob = Math.sin(Date.now() * 0.005 + powerUp.bobOffset) * 3;
            
            if (powerUp.type === 'health') {
                this.ctx.fillStyle = '#00ff00';
            } else if (powerUp.type === 'ammo') {
                this.ctx.fillStyle = '#ffff00';
            }
            
            this.ctx.fillRect(powerUp.x - powerUp.width / 2, powerUp.y - powerUp.height / 2 + bob, powerUp.width, powerUp.height);
        });
    }
    
    drawReloadIndicator() {
        const weapon = this.weapons[this.currentWeapon];
        const progress = (Date.now() - this.reloadStartTime) / weapon.reloadTime;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(this.canvas.width / 2 - 100, this.canvas.height / 2 + 50, 200, 20);
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillRect(this.canvas.width / 2 - 100, this.canvas.height / 2 + 50, 200 * Math.min(progress, 1), 20);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('RELOADING...', this.canvas.width / 2, this.canvas.height / 2 + 45);
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new ZombieGame();
});