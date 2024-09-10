# Game Object System Documentation

## Overview

The provided code implements a game object system using ES6 classes, a `Dictionary` to manage game objects, and `GameObject` instances to represent various entities in a game, such as the `Camera` and `Player`. The system supports parent-child relationships through UUID references for flexible object management.

## Classes and Functions

### 1. `Dictionary`

The `Dictionary` class is used to manage a collection of game objects. It maintains an array of `DictionaryEntries`, where each entry corresponds to a game object.

#### Methods

-   **constructor()**  
    Initializes a new instance of the `Dictionary` class, creating an empty array for `entries`.

-   **assignEntry(value, ...args)**  
    Adds a new `DictionaryEntries` object to the `entries` array.
    -   **Parameters:**
        -   `value`: The game object to store in the dictionary.
        -   `...args`: Additional arguments for the entry.
-   **getItemById(id = "")**  
    Retrieves a `DictionaryEntries` object by the specified UUID.

    -   **Parameters:**
        -   `id`: The UUID of the entry to retrieve (default is an empty string).
    -   **Returns:** A `DictionaryEntries` instance or `undefined` if not found.

-   **getItemByClass(classes = "")**  
    Finds and returns the first entry in the dictionary that matches the specified class name.
    -   **Parameters:**
        -   `classes`: The name of the class to match.
    -   **Returns:** A `DictionaryEntries` instance or `undefined` if not found.

### 2. `DictionaryEntries`

Represents an entry in the `Dictionary`. It contains a reference to a game object and manages relationships with other game objects.

#### Properties

-   **id**: A UUID string identifying the entry.
-   **value**: The actual game object (instance of `GameObject` or `null`).

#### Methods

-   **constructor(value, ...args)**  
    Initializes a `DictionaryEntries` instance.

    -   **Parameters:**
        -   `value`: The game object to associate with this entry.
        -   `...args`: Additional parameters affecting the entry's behavior.

    If the `args` contain an `emit` property, it checks for a `recieverClass` and assigns the current entry's ID to the parent object.

### 3. `GameObject`

The base class for all game objects. It provides basic properties and methods for positioning and managing references.

#### Properties

-   **position**: A vector representing the object's position in 2D space.
-   **dimension**: A vector representing the object's width and height.
-   **recieveReferences**: A flag indicating whether the object can receive references.
-   **references**: An array of UUIDs for referencing child objects.

#### Methods

-   **constructor(args = {})**  
    Initializes a `GameObject` instance.

    -   **Parameters:**
        -   `args`: An object that may include `x`, `y`, `width`, `height`, and `recieveReferences`.

-   **assignReferences(ref)**  
    Allows the object to accept a reference from a child.
    -   **Parameters:**
        -   `ref`: The UUID of the child object.

### 4. `Camera` (extends `GameObject`)

Represents the camera in the game, inheriting from `GameObject`. It is initialized to always receive references.

#### Methods

-   **constructor(...args)**  
    Initializes a `Camera` instance with reference reception enabled.

### 5. `Player` (extends `GameObject`)

Represents a player character in the game. Inherits functionality from `GameObject`.

#### Methods

-   **constructor(...args)**  
    Initializes a `Player` instance.

### 6. `init(value, ...args)`

A helper function to add new game objects to the `GameObjects` dictionary.

#### Parameters

-   `value`: The game object to initialize and store.
-   `...args`: Additional arguments affecting the initialization.

### 7. `setup()`

Function to initialize the game environment, create `Camera` and `Player` objects, and set up the main game canvas.

### 8. `draw()`

Main function that continuously updates the game frame. It clears the background and renders FPS and delta time display.

## Usage

To create and manage game objects:

1. Use `init(new Camera(...))` to create and register a camera.
2. Use `init(new Player(), { emit: true, recieverClass: "Camera" })` to create a player that references the camera.
3. Adjust the canvas size based on the current window size.

## Dependencies

-   Lodash
-   p5.js