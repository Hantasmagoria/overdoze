## Project 1: overdoze Post Mortem

#### Approach and Process

1. What in my process and approach to this project would I do differently next time?
  * spend more time and effort actually doing the research and information gathering, and put more thought and resources into the planning phase. 

2. What in my process and approach to this project went well that I would repeat next time?

  * I applied the pomodoro technique to maximize efficiency during the whole process. It actually turned out horribly at first, because there was no planning. I focused one pomodoro onto planning out the day, and the rest was actually very smooth(aside from the very painful debugging process, which no sane person can really do anything about in our current era).

--

#### Code and Code Design

1. What in my code and program design in the project would I do differently next time?
  * having an actual UML model would be great, especially for having an overview of the whole project so that I could zoom in and out and have an objective view of the code and how it works and how it's supposed to work especially when debugging... though I guess this would go in to the planning phase too.

  * having a better way to manage assets would be great, but this is partly because asset management wasn't exactly planned very well on my end.

  * maybe I should've started with a proper start menu or user interface instead of just a "good night, sweet dreams" dom manipulation gimmick.

1. What in my code and program design in the project went well? Is there anything I would do the same next time?

  For each, please include code examples.
  1. Code snippet up to 20 lines.
  2. Code design documents or architecture drawings / diagrams.

  * : This code was okay:
  ```javascript
    drawMap(tSimage, columns, map, tScolumns, tileSize) {
    for (let i = map.length; i >=0 ; i--) {
      let val = map[i];
      let srcX = (val % columns) * tileSize;
      let srcY = Math.floor(val / columns) * tileSize;
      let destX = (i % tScolumns) * tileSize;
      let destY = Math.floor(i / tScolumns) * tileSize;

      this.buffer.drawImage(tSimage, srcX, srcY, tileSize, tileSize, destX, destY, tileSize, tileSize)
    }
  }
};
```

* I spent a few pomodoros on analyzing the jump frames. I could've spent some time console.log-ing the coordinates of the character for each jump maneuver, possibly even getting solid data on the character's maximum speed, but because this isn't meant to be a competitive game by design, I decided that just pulling out a couple of screenshots from a screen recording for each jump maneuver would already be pretty amazing in terms of capturing the data I needed. I wasn't wrong, and below is proof. 
<!-- Also for any future legal proceedings, I wish to present this as my sole supporting document with regards to my request to type with a keyboard instead of writing. -->

![jump frame data](overdoze-jump_frame_data.png)

#### Unit 1 Post Mortem
1. What habits did I use during this unit that helped me? 
  * taking care of myself(big thanks to [@norman87](https://github.com/norman87) for the casual reminders),
  * proper hydration, exercise, (I would say diet here but I've been eating trash mostly these few weeks. I eat enough/frequently to have forgotten that hunger exists, at least.)
  * I commented for myself because as a psychopath myself I know exactly what I would do if I would ever want to physically harm another human being because of terrible commenting. On the flipside though, psychopathy is an entire spectrum, so my way of commenting might not cater to all forms of psychopathy, and I may need to do some commenting revisions.
2. What habits did I have during this unit that I can improve on?
  * Might need to look up better commenting frameworks or principles. 
  * Need to eat better food; I can already feel the physiological differences since changing my diet, and my cognitive performance has shifted, serotonin fluctuations sometimes feel as dangerous as drunk parkour. 
  * I'm unsure if there are better techniques than the pomodoro technique, or at least better suited for me. I'm going to have to spend a couple of pomodoros on looking this up.
3. How is the overall level of the course during this unit? (instruction, course materials, etc.)

  * I applied as much of the knowledge I learned in this course so far in to this project. 

  ---{Difficulity}---

  ☑☑☑☑☑☑☐☐☐☐ Doable

  ---{Grind}---

  ☑☑☑☑☐☐☐☐☐☐ Can be tough to cram certain concepts, but progression is linear.

