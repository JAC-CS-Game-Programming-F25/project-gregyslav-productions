# Final Project

-   [ ] Read the [project requirements](https://vikramsinghmtl.github.io/420-5P6-Game-Programming/project/requirements).
-   [ ] Replace the sample proposal below with the one for your game idea.
-   [ ] Get the proposal greenlit by Vik.
-   [ ] Place any assets in `assets/` and remember to update `src/config.json`.
-   [ ] Decide on a height and width inside `src/globals.js`. The height and width will most likely be determined based on the size of the assets you find.
-   [ ] Start building the individual components of your game, constantly referring to the proposal you wrote to keep yourself on track.
-   [ ] Good luck, you got this!

---

# TITLE_PENDING

## ✒️ Description

Our game is a roguelike top-down shooter, where you control a speceship and fight bosses. You control a small space ship, which you can move on the screen with wasd, while it shoots automatically.

The boss has a healthbar on the top of the screen, and the player has a healthbar in a bottom corner.

The bosses you face have lots of health and unique attacks and abilities for attacking the player. The bosses stay on the top of the screen, in most cases.

Only one boss will be implemented, the MechTitan, which can use:
- Laser Barrage, where it fires a bunch of projectiles of the player for a duration, with a spread
- Missile Swarm, where it fires 5 missiles that home in on the player and explode after a while
- Shield Bash, where it becomes invincible, dashes forward, comes back to the top of the screen and stops being invincible

While you fight the bosses, asteroids spawn on the screen, which can be destroyed by shooting them. Destroyed asteroids drop temporary power-ups.

The possible power-ups are:
- Rapid Fire, which increases the rate of fire of your weapon
- Triple Shot, which make your weapon fire 3 projectiles in a small spread instead of 1
- Shield, which makes your ship invincible
- Speed Boost, which makes your ship move faster
- Screen Clear, which clears all projectiles from the screen

When a boss is defeated, there's a small intermission delay, then the next boss spawns

For now, you fight increasing numbers of the same boss at a time (first one, then two at a time, etc.)

## 📃 Requirements

1. The user can move the ship with WASD.
2. The user ship fires automatically.
3. The user ship can pick up power-ups.
4. The user ship gets effects from picked up power-ups.
5. The user ship can get hit by asteroids and boss attacks.
6. When the user ship health hits 0, it explodes.
7. The asteroids can be destroyed by player bullets.
8. When destroyed, the asteroids drop a power-up.
9. The system shall shuffle the user's deck.
10. The system shall draw the top 7 cards from the user's deck.
11. If the user does not have a Basic Pokémon in their hand the system shall "mulligan" until they do.
12. Upon each mulligan, the AI shall draw a card.
13. The user shall put one of their Basic Pokémon face down as their Active Pokémon.
14. The user shall put up to 5 more Basic Pokémon face down on their Bench.
15. Upon a new turn, the system shall draw a card from the deck of the current player.
16. Upon a new turn, the system shall place the drawn card in the hand of the current player.
17. The user shall put (up to 5 total) Basic Pokémon cards from their hand onto their Bench.
18. The user shall Evolve their Pokémon as many times as they choose.
19. The user shall attach an Energy card from their hand to one of their Pokémon once per turn.
20. The user shall play Trainer cards (as many as they want, but only one Supporter card and one Stadium card per turn).
21. The user shall Retreat their Active Pokémon once per turn.
22. The user shall use as many Abilities as they choose.
23. The user shall attack the opponent's Active Pokémon.
24. After a player attacks, the system shall end their turn and start their opponent's turn.
25. The system shall execute any "special conditions" after a turn is over.
26. The user shall pick a Victory Card when the opposing Active Pokémon dies.

### 🤖 State Diagram

![State Diagram](./assets/images/StateDiagram.png)

### 🗺️ Class Diagram

![Class Diagram](./assets/images/ClassDiagramZoom.png)

### 🧵 Wireframes

![Title Screen](./assets/images/wireframes/TitleScreen.png)

A nice introduction for the player.

![Menu Screen](./assets/images/wireframes/MenuScreen.png)

-   _High Score_ shows you how many bosses you managed to kill in a row before dying.
-   _Resume_ loads your most recent save, so you can continue your fight.
-   _Battle_ starts a new battle from the beginning.

![Game Screen](./assets/images/wireframes/GameScreen.png)

The game screen, the heart of the project. Health bar on top for boss, on bottom for player. In the left bottom corner are the power-ups. The power-up duration left will be displayed with a bar inside it (think vertical health bar).

![Victory Screen](./assets/images/wireframes/VictoryScreen.png)

Your goal is to get to this screen. Serves as a short intermission before the next boss.

![Victory Screen](./assets/images/wireframes/GameOverScreen.png)

Try to avoid this screen.

### 🎨 Assets

We used [app.diagrams.net](https://app.diagrams.net/) to create the wireframes. Wireframes are the equivalent to the skeleton of a web app since they are used to describe the functionality of the product and the users experience.

We plan on following trends already found in other trading card video games, such as Pokémon Trading Card Game Online, Hearthstone, Magic the Gathering Arena, and Gwent.

The GUI will be kept simple and playful, as to make sure the game is easy to understand what each component does and is, as well as light hearted to keep to the Pokémon theme.

#### 🖼️ Images

-   Most images will be used from the well known community driven wikipedia site, [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page).
-   Especially their [Trading Card Game section](<https://bulbapedia.bulbagarden.net/wiki/Full_Art_card_(TCG)>).

#### ✏️ Fonts

For fonts, a simple sans-serif like Roboto will look quite nice. It's a font that is legible, light on storage size, and fun to keep with the theme we're going for. We also used a more cartoonish Pokemon font for the title screen.

-   [Pokemon](https://www.dafont.com/pokemon.font)
-   [Roboto](https://fonts.google.com/specimen/Roboto)

#### 🔊 Sounds

All sounds were taken from [freesound.org](https://freesound.org) for the actions pertaining to cards.

-   [Shuffle cards](https://freesound.org/people/VKProduktion/sounds/217502/)
-   [Flip card](https://freesound.org/people/Splashdust/sounds/84322/)

### 📚 References

-   [Pokemon Rulebook](http://assets.pokemon.com/assets/cms2/pdf/trading-card-game/rulebook/xy8-rulebook-en.pdf)
