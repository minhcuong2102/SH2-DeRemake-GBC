# gbs-AutoTileFlipPlugin
Plugin to automaticaly detect and assign tile flipping in gb studio

Must be in "color + monochrome" or "color only mode"
While waiting for tile flipping to be added to GBStudio (https://github.com/chrismaltby/gb-studio/pull/1738), 
this plugin will detect mirrored tiles in a background, assign the mirrored attributes to those tiles and optimize the tileset to remove the redundant tiles.

Simply add the "Auto flip tiles" event to the init of the scene you want to have this opmitization.
<img width="523" height="208" alt="image" src="https://github.com/user-attachments/assets/c200f835-c82f-4174-a073-534cbc0d53af" />

(example scene with 128 unique tiles flipped in all directions without the plugin)
<img width="586" height="665" alt="image" src="https://github.com/user-attachments/assets/e315cbb8-4d6a-4258-a3ee-c62f8d802723" />

(example scene with 128 unique tiles flipped in all directions with the plugin)
<img width="589" height="627" alt="image" src="https://github.com/user-attachments/assets/b4d0506d-265a-4d89-9fbf-cb6ead0837dc" />

