import kaboom from "https://unpkg.com/kaboom@3000.1.17/dist/kaboom.mjs";
import { level2 } from "./level2.js";

kaboom();

scene("level1", () => {
    
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
    loadSprite("bubble", "../assets/bubbles-pixel.png");
    loadSprite("lever", "../assets/lever-pixel.png", {
        sliceX: 2,
        anims: {
            "off": { from: 0, to: 0, speed: 1, loop: false }, 
            "on": { from: 1, to: 1, speed: 1, loop: false },
        },
    });

    const lever = add([
        sprite("lever"),
        pos(32, height() - 30), 
        anchor("center"),
        area(),
        "lever", 
    ]);
    let leverState = "off";
    lever.play("off");

    const leverText = add([
        text("Press 'I'\nto turn it on", { size: 6 }),
        pos(lever.pos.x, lever.pos.y - 20),
        anchor("center"),
        color(255, 255, 255),
        opacity(0),
        "leverText"
    ]);

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


    add([
        rect(48, 8),
        area(),
        outline(1),
        pos(342, 48),
        body({ isStatic: true }),
    ])

    const portal = add([
        rect(12, 22),
        area(),
        color(0, 0, 0),
        outline(1),
        pos(370, 26),
        body({ isStatic: true }),
        "portal",
    ])

    let nearPortal = false;
    player.onCollide("portal", () => {
        nearPortal = true;
    });

    player.onCollideEnd("portal", () => {
        nearPortal = false;
    });

    function changeLevel() {
        if (nearPortal) {
            debug.log("Player entered portal! Changing level...");
            level2();
        }
    }

    add([
        rect(10, 20),
        area(),
        color(54,1,63),
        outline(1),
        pos(372, 27),
        body({ isStatic: true }),
    ])

    add([
        rect(10, 5),
        area(),
        color(255,0,66),
        outline(1),
        pos(318, height() - 28), 
        body({ isStatic: true }),
    ])

    player.onGround(() => {
        if (!isKeyDown("left") && !isKeyDown("right")) {
            player.play("idle")
        } else {
            player.play("run")
        }
    })

    player.onAnimEnd((anim) => {
        if (anim === "idle") {
        }
    })

    onKeyPress("space", () => {
        if (player.attachedToBubble) {
            player.attachedToBubble = null;
            player.jump(JUMP_FORCE);
            player.play("jump");
            debug.log("Player detached from bubble");
        } else {
            if (player.isGrounded()) {
                player.jump(JUMP_FORCE);
                player.play("jump");
            }
        }
    })

    onKeyDown("left", () => {
        player.move(-SPEED, 0)
        player.flipX = true
        if (player.isGrounded() && player.curAnim() !== "run") {
            player.play("run")
        }
    })

    onKeyDown("right", () => {
        player.move(SPEED, 0)
        player.flipX = false
        if (player.isGrounded() && player.curAnim() !== "run") {
            player.play("run")
        }
    })

    ;["left", "right"].forEach((key) => {
        onKeyRelease(key, () => {
            if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
                player.play("idle")
            }
        })
    })


    let nearLever = false;

    player.onCollide("lever", () => {
        nearLever = true;
        leverText.opacity = 1;
    });

    player.onCollideEnd("lever", () => {
        nearLever = false;
        leverText.opacity = 0;
    });

    function spawnBubble() {
        const bubble = add([
            sprite("bubble"),
            pos(321, height() - 30),
            anchor("center"),
            opacity(0.8),
            area(),
            "bubble", 
        ]);

        bubble.onUpdate(() => {
            bubble.move(0, -72);
            if (bubble.pos.y < 10 || bubble.opacity <= 0) {
                destroy(bubble); 
            }
        });

        player.onCollide("bubble", () => {
            player.attachedToBubble = bubble;
            player.isJumping = false;
        });
    }
    
    onKeyPress("i", () => {
        if (nearLever && leverState == "off") {
            lever.play("on");
            leverState = "on";
            debug.log("Lever turned ON!");
            loop(2, () => {
                spawnBubble();
            });
        }
    });

    player.onUpdate(() => {
        if (player.attachedToBubble) {
            player.pos = player.attachedToBubble.pos;
        }
    });


    onUpdate(() => {
        player.pos.x = Math.max(0, Math.min(player.pos.x, width()));
        changeLevel();
    });



    const getInfo = () => `This is level 1
The player can jump and move left/right
Turn on the lever and attach yourself to the
Bubbles to reach the portal
    `.trim()

    const label = add([
        text(getInfo(), { size: 10 }),
        color(0, 0, 0),
        pos(4),
    ])

    label.onUpdate(() => {
        label.text = getInfo()
    })
});

go("level1");