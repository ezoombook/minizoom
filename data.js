'use strict';

function chapters() {
  return parts().filter(function(part){
      return part.type === "heading";
  });
}

function layers() {
  return [
  {title: "Original",  key : 0},
  {title: "Fairly Abridged", key : 1},
    ];
}

function parts() {
  return [
  {contents: "Chapter I",  key : 0, type: "heading", level:1},
  {key:0.5},
  {contents: "Once upon a time...", key : 1},
  {key:1.5},
  {contents: "There was a little", key : 2},
  {key:2.5}
  ];
}

if (typeof module === "object") {
  module.exports = {
    "layers" : layers,
    "parts": parts,
    "chapters": chapters
  };
}
