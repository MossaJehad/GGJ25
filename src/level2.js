import kaboom from "https://unpkg.com/kaboom@3000.1.17/dist/kaboom.mjs";
kaboom();

export function level2() {
    scene("level2", () => {
        kaboom({
            scale: 4,
            font: "monospace",
            background: [141, 183, 255],
        })
    
        loadSprite("dino", "https://kaboomjs.com/examples/sprites/dino.png", {
            sliceX: 9,
            anims: {
                "idle": {
                    from: 0,
                    to: 3,
                    speed: 5,
                    loop: true,
                },
                "run": {
                    from: 4,
                    to: 7,
                    speed: 10,
                    loop: true,
                },
                "jump": 8,
            },
        })
    
        const SPEED = 120
        const JUMP_FORCE = 240
    
        setGravity(640)
    
    
        const player = add([
            sprite("dino"),
            pos(center()),
            anchor("center"),
            area(),
            body(),
        ])
    
        player.play("idle")
    
        add([
            rect(width(), 24),
            area(),
            outline(1),
            pos(0, height() - 24),
            body({ isStatic: true }),
        ])
    

        player.play("idle")

        onUpdate(() => {
            player.pos.x = Math.max(0, Math.min(player.pos.x, width()));
        });
        
        add([
            pos(24, 24),
            text("Made this game with just JavaScript (no game engine). It’s my first try, and I’ll keep improving for the next jam. I wish you all the best!", {
                size: 12,
                width: 320,
                font: "monospace",
            }),
        ])
    });
    go("level2");

}