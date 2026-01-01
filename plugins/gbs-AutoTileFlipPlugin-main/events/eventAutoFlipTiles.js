export const id = "EVENT_AUTO_FLIP_TILES";
export const name = "Auto flip tiles";
export const groups = ["Misc"];

export const autoLabel = (fetchArg) => {
  return `Auto flip tiles`;
};

export const fields = [
  
];

const TILE_COLOR_PROP_FLIP_HORIZONTAL = 0x20;
const TILE_COLOR_PROP_FLIP_VERTICAL = 0x40;

const background_cache = {};

const reverse_bits = (n) => {
    let result = 0
    for (let i = 0; i < 8; i++) {
        result <<= 1;
        result |= (n & 1);
        n >>= 1;
    }
    return result
}

const flip_tile_x = (tile) => {
  
  const output = [];
  for (let i = 0; i < 16; i+=2) {
    output.push(reverse_bits(tile[i]));
    output.push(reverse_bits(tile[i + 1]));   
  }
  return output;
};

const flip_tile_y = (tile) => {
  const output = [];
  for (let i = 14; i >= 0; i-=2) {
    output.push(tile[i]);
    output.push(tile[i + 1]);
  }
  return output;
};

export const compile = (input, helpers) => {
  const { options } = helpers;  
  const { scene } = options;  
  if (!background_cache[scene.backgroundId]){	
    const tilemapData = scene.background.tilemap.data;
    const tilemapAttrData = scene.background.tilemapAttr?.data;
    const tilesetData = scene.background.tileset.data;
    const cgbTilesetData = scene.background.cgbTileset?.data || [];
    const tileLookup = {};
    const newTilesetData = [];
    const newCgbTilesetData = [];
    let tileData = [];
    let flippedTileData = [];
    
    //first bank 128
    //prefill tileLookup    
    for (let i = 0; i < Math.min(128, (tilesetData.length >> 4)); i++){
      tileData = tilesetData.slice((i << 4), (i << 4) + 16);
            
      //horizontal flip check  in lookup
      flippedTileData = flip_tile_x(tileData);      
      tileDataHash = JSON.stringify(flippedTileData);
      existingTile = tileLookup[tileDataHash];
      if (existingTile){
        continue;		
      }
         
      //vertical flip check  in lookup
      flippedTileData = flip_tile_y(tileData)
      tileDataHash = JSON.stringify(flippedTileData);
      existingTile = tileLookup[tileDataHash];
      if (existingTile){
        continue;	
      }
      
      
      //horizontal & vertical flip check  in lookup
      flippedTileData = flip_tile_x(flip_tile_y(tileData));
      tileDataHash = JSON.stringify(flippedTileData);
      existingTile = tileLookup[tileDataHash];
      if (existingTile){	  
        continue;	
      }  
      if (newTilesetData.length < 2048){
        tileLookup[JSON.stringify(tileData)] = { tileId: newTilesetData.length >> 4, isBank2: false };
        newTilesetData.push(...tileData); 
      } else if (newCgbTilesetData.length < 2048) {
        tileLookup[JSON.stringify(tileData)] = { tileId: newCgbTilesetData.length >> 4, isBank2: true };
        newCgbTilesetData.push(...tileData);
      }
    }
    //second bank 128
    for (let i = 0; i < Math.min(128, (cgbTilesetData.length >> 4)); i++){
      tileData = cgbTilesetData.slice((i << 4), (i << 4) + 16);
                    
      //horizontal flip check  in lookup       
      flippedTileData = flip_tile_x(tileData);
      tileDataHash = JSON.stringify(flippedTileData);
      existingTile = tileLookup[tileDataHash];
      if (existingTile){
        continue;		
      }        
      
      //vertical flip check  in lookup
      flippedTileData = flip_tile_y(tileData)
      tileDataHash = JSON.stringify(flippedTileData);
      existingTile = tileLookup[tileDataHash];
      if (existingTile){
        continue;	
      }
      
      //horizontal & vertical flip check  in lookup
      flippedTileData = flip_tile_x(flip_tile_y(tileData));
      tileDataHash = JSON.stringify(flippedTileData);
      existingTile = tileLookup[tileDataHash];
      if (existingTile){	  
        continue;	
      }    
      if (newTilesetData.length < 2048){
        tileLookup[JSON.stringify(tileData)] = { tileId: newTilesetData.length >> 4, isBank2: false };
        newTilesetData.push(...tileData); 
      } else if (newCgbTilesetData.length < 2048) {
        tileLookup[JSON.stringify(tileData)] = { tileId: newCgbTilesetData.length >> 4, isBank2: true };
        newCgbTilesetData.push(...tileData);
      }
    }
    
    //first bank after 128
    //prefill tileLookup    
    if ((tilesetData.length >> 4) > 128){
      for (let i = 128; i < (tilesetData.length >> 4); i++){
        tileData = tilesetData.slice((i << 4), (i << 4) + 16);
              
        //horizontal flip check  in lookup
        flippedTileData = flip_tile_x(tileData);      
        tileDataHash = JSON.stringify(flippedTileData);
        existingTile = tileLookup[tileDataHash];
        if (existingTile){
          continue;		
        }
          
        //vertical flip check  in lookup
        flippedTileData = flip_tile_y(tileData)
        tileDataHash = JSON.stringify(flippedTileData);
        existingTile = tileLookup[tileDataHash];
        if (existingTile){
          continue;	
        }
        
        
        //horizontal & vertical flip check  in lookup
        flippedTileData = flip_tile_x(flip_tile_y(tileData));
        tileDataHash = JSON.stringify(flippedTileData);
        existingTile = tileLookup[tileDataHash];
        if (existingTile){	  
          continue;	
        }  
        if (newTilesetData.length < 2048){
          tileLookup[JSON.stringify(tileData)] = { tileId: newTilesetData.length >> 4, isBank2: false };
          newTilesetData.push(...tileData); 
        } else if (newCgbTilesetData.length < 2048) {
          tileLookup[JSON.stringify(tileData)] = { tileId: newCgbTilesetData.length >> 4, isBank2: true };
          newCgbTilesetData.push(...tileData);
        } else if (((newTilesetData.length + newCgbTilesetData.length) & 31) == 0){
          tileLookup[JSON.stringify(tileData)] = { tileId: newTilesetData.length >> 4, isBank2: false };
          newTilesetData.push(...tileData); 
        } else {          
          tileLookup[JSON.stringify(tileData)] = { tileId: newCgbTilesetData.length >> 4, isBank2: true };
          newCgbTilesetData.push(...tileData);   
        }
      }
    }
    //second bank after 128
    if ((cgbTilesetData.length >> 4) > 128){
      for (let i = 128; i < (cgbTilesetData.length >> 4); i++){
        tileData = cgbTilesetData.slice((i << 4), (i << 4) + 16);
                      
        //horizontal flip check  in lookup       
        flippedTileData = flip_tile_x(tileData);
        tileDataHash = JSON.stringify(flippedTileData);
        existingTile = tileLookup[tileDataHash];
        if (existingTile){
          continue;		
        }        
        
        //vertical flip check  in lookup
        flippedTileData = flip_tile_y(tileData)
        tileDataHash = JSON.stringify(flippedTileData);
        existingTile = tileLookup[tileDataHash];
        if (existingTile){
          continue;	
        }
        
        //horizontal & vertical flip check  in lookup
        flippedTileData = flip_tile_x(flip_tile_y(tileData));
        tileDataHash = JSON.stringify(flippedTileData);
        existingTile = tileLookup[tileDataHash];
        if (existingTile){	  
          continue;	
        }    
        if (newTilesetData.length < 2048){
          tileLookup[JSON.stringify(tileData)] = { tileId: newTilesetData.length >> 4, isBank2: false };
          newTilesetData.push(...tileData); 
        } else if (newCgbTilesetData.length < 2048) {
          tileLookup[JSON.stringify(tileData)] = { tileId: newCgbTilesetData.length >> 4, isBank2: true };
          newCgbTilesetData.push(...tileData);
        } else if (((newTilesetData.length + newCgbTilesetData.length) & 31) == 0){
          tileLookup[JSON.stringify(tileData)] = { tileId: newTilesetData.length >> 4, isBank2: false };
          newTilesetData.push(...tileData); 
        } else {          
          tileLookup[JSON.stringify(tileData)] = { tileId: newCgbTilesetData.length >> 4, isBank2: true };
          newCgbTilesetData.push(...tileData);   
        }
      }
    }
    
    let new_ui_reserved_offset = ((newTilesetData.length >> 4) > 128 && (newTilesetData.length >> 4) < 192)? (192 - (newTilesetData.length >> 4)): 0;
    let new_ui_reserved_offset_bank2 = ((newCgbTilesetData.length >> 4) > 128 && (newCgbTilesetData.length >> 4) < 192)? (192 - (newCgbTilesetData.length >> 4)): 0;    
    
    let ui_reserved_offset = ((tilesetData.length >> 4) > 128 && (tilesetData.length >> 4) < 192)? (192 - (tilesetData.length >> 4)): 0;
    let ui_reserved_offset_bank2 = ((cgbTilesetData.length >> 4) > 128 && (cgbTilesetData.length >> 4) < 192)? (192 - (cgbTilesetData.length >> 4)): 0;
    
    //parse tilemap
    for (let y = 0; y < scene.background.height; y++){
      for (let x = 0; x < scene.background.width; x++){
        const tileIndex = y * scene.background.width + x;
        let tileAttr = tilemapAttrData[tileIndex];
        let tileId = tilemapData[tileIndex];
        if (tileAttr & 0x08 && cgbTilesetData){
          tileId = (tileId >= 128 && ui_reserved_offset_bank2)? (tileId - ui_reserved_offset_bank2): tileId;
          tileData = cgbTilesetData.slice((tileId << 4), (tileId << 4) + 16);
        } else {
          tileId = (tileId >= 128 && ui_reserved_offset)? (tileId - ui_reserved_offset): tileId;
          tileData = tilesetData.slice((tileId << 4), (tileId << 4) + 16);
        }
        //no flip check in lookup
        let tileDataHash = JSON.stringify(tileData);
        let existingTile = tileLookup[tileDataHash];
        if (existingTile){
          if (existingTile.isBank2){
            tilemapData[tileIndex] = (existingTile.tileId >= 128 && new_ui_reserved_offset_bank2)? (existingTile.tileId + new_ui_reserved_offset_bank2): existingTile.tileId;
            tileAttr = (tileAttr | 0x08);
          } else {
            tilemapData[tileIndex] = (existingTile.tileId >= 128 && new_ui_reserved_offset)? (existingTile.tileId + new_ui_reserved_offset): existingTile.tileId;
            tileAttr = (tileAttr & ~(0x08));
          }          
          tilemapAttrData[tileIndex] = tileAttr & ~(TILE_COLOR_PROP_FLIP_VERTICAL | TILE_COLOR_PROP_FLIP_HORIZONTAL);
          continue;		  
        }
        
        //horizontal flip check  in lookup
        flippedTileData = flip_tile_x(tileData);
        tileDataHash = JSON.stringify(flippedTileData);
        existingTile = tileLookup[tileDataHash];
        if (existingTile){
          if (existingTile.isBank2){
            tilemapData[tileIndex] = (existingTile.tileId >= 128 && new_ui_reserved_offset_bank2)? (existingTile.tileId + new_ui_reserved_offset_bank2): existingTile.tileId;
            tileAttr = (tileAttr | 0x08);
          } else {
            tilemapData[tileIndex] = (existingTile.tileId >= 128 && new_ui_reserved_offset)? (existingTile.tileId + new_ui_reserved_offset): existingTile.tileId;
            tileAttr = (tileAttr & ~(0x08));
          }   
          tilemapAttrData[tileIndex] = tileAttr | TILE_COLOR_PROP_FLIP_HORIZONTAL;
          continue;	
        }
        
        //vertical flip check  in lookup
        flippedTileData = flip_tile_y(tileData);
        tileDataHash = JSON.stringify(flippedTileData);
        existingTile = tileLookup[tileDataHash];
        if (existingTile){
          if (existingTile.isBank2){
            tilemapData[tileIndex] = (existingTile.tileId >= 128 && new_ui_reserved_offset_bank2)? (existingTile.tileId + new_ui_reserved_offset_bank2): existingTile.tileId;
            tileAttr = (tileAttr | 0x08);
          } else {
            tilemapData[tileIndex] = (existingTile.tileId >= 128 && new_ui_reserved_offset)? (existingTile.tileId + new_ui_reserved_offset): existingTile.tileId;
            tileAttr = (tileAttr & ~(0x08));
          }   
          tilemapAttrData[tileIndex] = tileAttr | TILE_COLOR_PROP_FLIP_VERTICAL;
          continue;	
        }
        
        //horizontal & vertical flip check  in lookup
        flippedTileData = flip_tile_x(flip_tile_y(tileData));
        tileDataHash = JSON.stringify(flippedTileData);
        existingTile = tileLookup[tileDataHash];
        if (existingTile){
          if (existingTile.isBank2){
            tilemapData[tileIndex] = (existingTile.tileId >= 128 && new_ui_reserved_offset_bank2)? (existingTile.tileId + new_ui_reserved_offset_bank2): existingTile.tileId;
            tileAttr = (tileAttr | 0x08);
          } else {
            tilemapData[tileIndex] = (existingTile.tileId >= 128 && new_ui_reserved_offset)? (existingTile.tileId + new_ui_reserved_offset): existingTile.tileId;
            tileAttr = (tileAttr & ~(0x08));
          }   
          tilemapAttrData[tileIndex] = tileAttr | TILE_COLOR_PROP_FLIP_VERTICAL | TILE_COLOR_PROP_FLIP_HORIZONTAL;		  
          continue;	
        }        
      }
    }	
	  scene.background.tileset.data = newTilesetData;
    if (scene.background.cgbTileset){
      if (newCgbTilesetData.length){
        scene.background.cgbTileset.data = newCgbTilesetData;
      } else {
        scene.background.cgbTileset = null;
      }    
    } 
	  background_cache[scene.backgroundId] = true;
  }  
};
